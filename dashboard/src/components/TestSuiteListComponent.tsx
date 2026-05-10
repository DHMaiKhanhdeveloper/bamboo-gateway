import { TestSuiteCard } from "@/components/TestSuiteCard";
import { AlertCircle, FileSearch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TestSuiteSummary } from "@/types/test-suite";

interface TestSuiteListProps {
  suites: TestSuiteSummary[];
  onSuiteClick: (suiteName: string) => void;
  isLoading?: boolean;
  embedded?: boolean;
}

function LoadingSkeleton() {
  return (
    <Card className="flex flex-col gap-6 py-1 overflow-hidden bg-white border-slate-200 border-l-4">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-1" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </Card>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <FileSearch className="h-7 w-7 sm:h-8 sm:w-8 text-slate-400" />
        </div>
        <h3 className="text-slate-900 mb-1">No test suites found</h3>
        <p className="text-slate-500 text-center max-w-sm text-sm">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-slate-400" />
      </div>
      <h3 className="text-slate-900 mb-1">No test suites available</h3>
      <p className="text-slate-500 text-center max-w-sm text-sm">
        There are no test suites to display
      </p>
    </div>
  );
}

export function TestSuiteListComponent({
  suites,
  onSuiteClick,
  isLoading = false,
  embedded = false,
}: TestSuiteListProps) {
  if (isLoading) {
    const skeletons = (
      <>
        {[...Array(3)].map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </>
    );
    return embedded ? skeletons : <div className="space-y-3">{skeletons}</div>;
  }

  if (suites.length === 0) {
    const empty = <EmptyState hasFilters={false} />;
    return embedded ? <div className="col-span-full">{empty}</div> : empty;
  }

  const sortedSuites = [...suites].sort((a, b) => {
    const dateA = new Date(a.lastRun).getTime();
    const dateB = new Date(b.lastRun).getTime();
    const dateDiff = dateB - dateA;
    if (Math.abs(dateDiff) < 300000) {
      if (a.status === "failed" && b.status !== "failed") return -1;
      if (a.status !== "failed" && b.status === "failed") return 1;
    }
    return dateDiff;
  });

  const cards = sortedSuites.map(suite => (
    <TestSuiteCard
      key={suite.suiteName}
      suite={suite}
      onClick={() => onSuiteClick(suite.suiteName)}
    />
  ));

  return embedded ? <>{cards}</> : <div className="space-y-3">{cards}</div>;
}
