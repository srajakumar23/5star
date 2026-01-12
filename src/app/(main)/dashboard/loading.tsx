

export default function DashboardLoading() {
    return (
        <div className="space-y-6 md:space-y-8 pb-10 -mx-2 xl:mx-0">

            {/* Hero Section Skeleton */}
            <div className="rounded-[24px] md:rounded-[32px] p-6 md:p-10 bg-gray-100 min-h-[480px] md:min-h-[420px] flex flex-col justify-between relative overflow-hidden animate-pulse">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gray-200/50 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl" />

                <div className="w-full">
                    <div className="space-y-4 mb-8">
                        <div className="h-4 w-32 bg-gray-200 rounded-full" />
                        <div className="h-12 w-64 bg-gray-300 rounded-xl" />
                        <div className="h-4 w-48 bg-gray-200 rounded-full" />

                        <div className="flex gap-2 mt-6">
                            <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                            <div className="h-8 w-32 bg-gray-200 rounded-lg" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/50 h-40 rounded-[24px]" />
                        <div className="bg-white/50 h-40 rounded-[24px]" />
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <div className="h-14 w-full md:w-48 bg-gray-200 rounded-[20px]" />
                    <div className="h-14 w-14 bg-gray-200 rounded-[20px]" />
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-2 gap-4">
                <div className="h-48 rounded-[28px] bg-gray-100 animate-pulse" />
                <div className="h-48 rounded-[28px] bg-gray-100 animate-pulse" />
            </div>

            {/* Recent Activity Skeleton */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-6 w-32 bg-gray-100 rounded-full" />
                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                </div>

                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100" />
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-gray-100 rounded-full" />
                                <div className="h-3 w-24 bg-gray-50 rounded-full" />
                            </div>
                        </div>
                        <div className="h-6 w-20 bg-gray-100 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}
