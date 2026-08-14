export default function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="bg-gray-200 h-52 w-full" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-9 bg-gray-200 rounded w-full mt-2" />
      </div>
    </div>
  );
}
