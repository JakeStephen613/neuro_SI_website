import Navbar from '@/components/layout/Navbar';

export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 animate-fade-in-up">
        <div className="glass-panel p-8 rounded-lg shadow-sm relative overflow-hidden">
          {/* Progress Bar Skeleton */}
          <div className="absolute top-0 left-0 h-1 w-1/4 bg-gray-300 animate-pulse"></div>

          <div className="mb-6 flex justify-between text-sm text-gray-500 font-mono">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Question Skeleton */}
          <div className="h-8 bg-gray-300 rounded mb-4 w-11/12 animate-pulse"></div>
          <div className="h-8 bg-gray-300 rounded mb-8 w-10/12 animate-pulse"></div>

          {/* Options Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full p-4 border border-gray-200 rounded-lg flex items-center gap-4 bg-white animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            {/* Button Skeleton */}
            <div className="h-12 w-40 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
