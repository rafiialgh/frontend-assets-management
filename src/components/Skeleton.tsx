import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface StatCardProps extends React.ComponentProps<'div'> {
  dataNumber?: number;
}

  export function StatCardSkeleton({ className, dataNumber = 1 }: StatCardProps) {
    return (
      <div
        className={cn(
          'flex items-center gap-4 bg-sidebar border rounded-sm p-4 h-full',
          className
        )}
      >
        <Skeleton className='h-10 w-10 rounded-full' />
        <div className='flex-1 flex-col justify-items-end'>
          {Array.from({ length: dataNumber }).map((_, index) => (
          <div key={index} className="mb-2">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
        </div>
      </div>
    );
  }

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-10 w-full' /> {/* Search/filter bar */}
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} className='h-12 w-full' />
      ))}
    </div>
  );
}