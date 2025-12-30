export default function ProjectsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-xl border border-border h-[400px] animate-pulse flex flex-col overflow-hidden">
                    <div className="h-48 bg-muted"></div>
                    <div className="p-6 space-y-4 flex-1">
                        <div className="h-6 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                        <div className="flex gap-2 pt-4 mt-auto">
                            <div className="h-6 w-16 bg-muted rounded-full"></div>
                            <div className="h-6 w-16 bg-muted rounded-full"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
