import { Skeleton } from "./Skeleton";

export function PageSkeleton() {
  return (
    <div className="relative w-full overflow-hidden bg-background min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="relative h-screen w-full bg-muted/20">
        <Skeleton className="h-full w-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
          <Skeleton className="h-12 w-3/4 max-w-4xl mb-4" />
          <Skeleton className="h-8 w-2/3 max-w-3xl mb-6" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Features Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="space-y-8">
          <div className="text-center">
            <Skeleton className="h-10 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="space-y-4 p-6 border border-border rounded-lg bg-card/50"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12" variant="circular" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-6 py-12 text-center">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}
