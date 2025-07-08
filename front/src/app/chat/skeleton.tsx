import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4 mt-3">
      <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-[250px] bg-gray-700" />
        {/* <Skeleton className="h-4 w-[200px]" /> */}
      </div>
    </div>
  )
}
