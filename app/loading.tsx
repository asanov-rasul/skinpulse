import { ItemCardSkeletonGrid } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="skeleton mb-2 h-8 w-56 rounded-lg" />
        <div className="skeleton h-4 w-72 rounded-lg" />
      </div>
      <div className="mb-6 h-4 w-32 rounded-lg" />
      <ItemCardSkeletonGrid count={4} />
      <div className="my-6 h-4 w-32 rounded-lg" />
      <ItemCardSkeletonGrid count={4} />
    </section>
  );
}
