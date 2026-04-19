import { Skeleton } from "./Skeleton";

export function ProductListSkeleton() {
  return (
    <div className="relative w-full overflow-hidden bg-background min-h-screen">
      <div className="container mx-auto px-4 py-20">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <Skeleton className="h-10 w-full sm:w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div 
              key={i} 
              className="group relative bg-card border border-border rounded-lg overflow-hidden transition-shadow hover:shadow-lg"
            >
              {/* Image */}
              <Skeleton className="w-full aspect-square" />
              
              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Badge */}
                <div className="flex justify-between items-start">
                  <Skeleton className="h-5 w-20" variant="rectangular" />
                  <Skeleton className="h-6 w-6" variant="circular" />
                </div>
                
                {/* Title */}
                <Skeleton className="h-5 w-3/4" />
                
                {/* Description */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                
                {/* Price and Button */}
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

