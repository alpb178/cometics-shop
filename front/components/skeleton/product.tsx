import { Skeleton } from "./Skeleton";

export function ProductSkeleton() {
  return (
    <div className="relative w-full overflow-hidden bg-background min-h-screen">
      <div className="container mx-auto px-4 py-20 md:py-40">
        <div className="gap-12 grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div>
            <Skeleton className="w-full md:h-[800px] h-[400px] mb-4" />
            <div className="flex justify-center items-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-20 h-20 border-2 border-border" />
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-24" variant="rectangular" />
            </div>
            <div className="space-y-3 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4 mb-6">
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-px w-full mb-6" variant="rectangular" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

