export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
      <div className="mb-4 h-4 w-1/3 rounded bg-gray-100" />
      <div className="mb-2 h-3 w-full rounded bg-gray-100" />
      <div className="mb-4 h-3 w-2/3 rounded bg-gray-100" />
      <div className="h-2 w-full rounded bg-gray-100" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="animate-pulse divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <div className="h-3 w-1/4 rounded bg-gray-100" />
          <div className="h-3 w-1/6 rounded bg-gray-100" />
          <div className="h-3 w-1/6 rounded bg-gray-100" />
          <div className="h-3 w-1/6 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
      <div className="mb-3 h-8 w-8 rounded-lg bg-gray-100" />
      <div className="mb-2 h-3 w-1/2 rounded bg-gray-100" />
      <div className="h-6 w-1/3 rounded bg-gray-100" />
    </div>
  );
}
