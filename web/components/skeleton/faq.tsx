import { Skeleton } from "./Skeleton";

export function FAQSkeleton() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 flex flex-col items-center gap-4">
          <Skeleton className="h-7 w-48 rounded-full" />
          <Skeleton className="h-10 md:h-12 w-72 md:w-96" />
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
            >
              <Skeleton className="w-9 h-9 flex-shrink-0" variant="circular" />
              <Skeleton className="h-6 flex-1" />
              <Skeleton className="w-5 h-5 flex-shrink-0" variant="circular" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
