import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function BioassayDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-3/4 mt-2" />
        <Skeleton className="h-4 w-40 mt-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="w-full">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-1" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-9 flex-grow" />
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-40 w-full" />
                </div>
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
