export default function ClinicLoading() {
  return (
    <div className="space-y-6">
      {/* Page header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-40 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-24 rounded-md bg-muted animate-pulse" />
      </div>
      {/* Content skeleton */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 rounded-md bg-muted animate-pulse" style={{ opacity: 1 - i * 0.15 }} />
        ))}
      </div>
    </div>
  );
}
