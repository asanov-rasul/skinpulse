"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle } from "lucide-react";
import { useToastStore } from "@/lib/store/useToastStore";
import { cn } from "@/lib/utils/cn";

const ICONS = { default: Bell, success: CheckCircle2, danger: AlertCircle };

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ReturnType<typeof useToastStore.getState>["toasts"][0]; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const Icon = ICONS[toast.variant ?? "default"];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className="glass pointer-events-auto flex w-72 items-start gap-3 rounded-xl p-3.5 shadow-glass"
    >
      <div
        className={cn(
          "mt-0.5 rounded-full p-1",
          toast.variant === "success" && "bg-accent-up/15 text-accent-up",
          toast.variant === "danger" && "bg-accent-down/15 text-accent-down",
          (!toast.variant || toast.variant === "default") && "bg-white/10 text-white/70"
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-xs text-white/50">{toast.description}</p>}
      </div>
    </motion.div>
  );
}
