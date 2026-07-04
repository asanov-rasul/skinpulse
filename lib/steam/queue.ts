/**
 * Sequential, rate-limited request queue for Steam's unofficial market
 * endpoints. Steam's `priceoverview` endpoint has no published rate limit,
 * but in practice it starts returning 429s after roughly 15-20 requests
 * per minute from a single IP, and can stay in a cooldown for tens of
 * minutes if hammered. So: one request at a time, spaced out, with
 * exponential backoff on 429/5xx, and no concurrent fan-out.
 */

type QueuedJob<T> = {
  run: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (err: unknown) => void;
};

type AnyQueuedJob = QueuedJob<unknown>;

const MIN_SPACING_MS = 1500; // conservative floor between any two Steam requests
const MAX_BACKOFF_MS = 60_000;
const BASE_BACKOFF_MS = 2000;

class SteamRequestQueue {
  private queue: AnyQueuedJob[] = [];
  private processing = false;
  private consecutiveFailures = 0;
  private cooldownUntil = 0;

  enqueue<T>(run: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ run, resolve, reject } as AnyQueuedJob);
      void this.process();
    });
  }

  get pendingCount() {
    return this.queue.length;
  }

  private async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      if (now < this.cooldownUntil) {
        await sleep(this.cooldownUntil - now);
      }

      const job = this.queue.shift()!;
      try {
        const result = await job.run();
        this.consecutiveFailures = 0;
        job.resolve(result);
      } catch (err) {
        if (isRateLimitError(err)) {
          this.consecutiveFailures += 1;
          const backoff = Math.min(
            BASE_BACKOFF_MS * 2 ** (this.consecutiveFailures - 1),
            MAX_BACKOFF_MS
          );
          this.cooldownUntil = Date.now() + backoff;
          // Put the job back at the front so nothing is silently dropped
          this.queue.unshift(job);
          continue;
        }
        job.reject(err);
      }

      await sleep(MIN_SPACING_MS);
    }

    this.processing = false;
  }
}

export class RateLimitError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "RateLimitError";
    this.status = status;
  }
}

function isRateLimitError(err: unknown): err is RateLimitError {
  return err instanceof RateLimitError && (err.status === 429 || err.status >= 500);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Singleton across the server process (Next.js keeps modules warm between
// requests in the same runtime instance, so this gives us a real shared
// queue rather than a new one per request).
declare global {
  // eslint-disable-next-line no-var
  var __steamQueue: SteamRequestQueue | undefined;
}

export const steamQueue = globalThis.__steamQueue ?? new SteamRequestQueue();
if (process.env.NODE_ENV !== "production") globalThis.__steamQueue = steamQueue;
