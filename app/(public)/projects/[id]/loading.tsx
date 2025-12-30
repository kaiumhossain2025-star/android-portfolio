export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
      <div className="h-10 bg-muted rounded w-2/3 mb-6" />
      <div className="h-64 bg-muted rounded mb-8" />
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
      </div>
    </div>
  )
}
