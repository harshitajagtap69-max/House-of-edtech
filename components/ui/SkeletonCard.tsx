export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="skeleton h-2.5 w-14 rounded-full mb-4" />
      <div className="skeleton h-4 w-4/5 rounded mb-2" />
      <div className="skeleton h-4 w-3/5 rounded mb-6" />
      <div className="flex gap-1.5 mb-4">
        <div className="skeleton h-4 w-12 rounded" />
        <div className="skeleton h-4 w-10 rounded" />
      </div>
      <div className="border-t border-gray-50 pt-3">
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
