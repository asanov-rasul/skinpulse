export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="skeleton mb-6 h-64 w-full rounded-2xl" />
      <div className="skeleton mb-3 h-6 w-1/3 rounded-lg" />
      <div className="skeleton mb-8 h-4 w-1/4 rounded-lg" />
      <div className="skeleton h-48 w-full rounded-2xl" />
    </div>
  );
}
