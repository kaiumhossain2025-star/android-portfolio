export function ProductsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-2xl border border-border h-full flex flex-col overflow-hidden animate-pulse">
                    <div className="h-48 w-full bg-muted" />
                    <div className="p-5 flex flex-col flex-grow gap-3">
                        <div className="h-6 w-3/4 bg-muted rounded" />
                        <div className="h-4 w-full bg-muted rounded" />
                        <div className="h-4 w-2/3 bg-muted rounded" />
                        <div className="h-4 w-1/3 mt-auto bg-muted rounded" />
                    </div>
                </div>
            ))}
        </div>
    )
}
