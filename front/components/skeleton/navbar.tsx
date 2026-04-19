import { Skeleton } from "./Skeleton";


export function NavbarSkeleton() {
  return (
    <nav className="top-0 z-50 fixed inset-x-0 mx-auto w-full">
      {/* Desktop Navbar Skeleton */}
      <div className="hidden lg:flex items-center justify-center w-full mb-10">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-3 mt-4 gap-6 rounded-2xl backdrop-blur-xl bg-white/95 shadow-xl border border-gray-200/50">
          {/* Logo */}
          <Skeleton className="h-10 w-32" />

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 flex-1 justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-20" />
            ))}
          </nav>

          {/* Cart Icon */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10" variant="circular" />
          </div>
        </div>
      </div>

      {/* Mobile Navbar Skeleton */}
      <div className="lg:hidden flex justify-between items-center bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200/50 px-4 py-3 w-full sticky top-0 z-50">
        {/* Menu Button */}
        <Skeleton className="h-10 w-10" variant="circular" />
        
        {/* Logo */}
        <Skeleton className="h-8 w-24" />

        {/* Cart Icon */}
        <Skeleton className="h-10 w-10" variant="circular" />
      </div>
    </nav>
  );
}
