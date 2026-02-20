export function CollegeSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-300 dark:bg-gray-700" />
            <div className="p-6 space-y-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
        </div>
    );
}

export function CollegeGridSkeleton() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
                <CollegeSkeleton key={i} />
            ))}
        </div>
    );
}