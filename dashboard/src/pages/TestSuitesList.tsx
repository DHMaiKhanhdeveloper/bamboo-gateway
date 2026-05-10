import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, LayoutGrid, List as ListIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { StatsHeader } from "@/components/StatsHeader";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { SearchBar } from "@/components/SearchBar";
import { TestSuiteListComponent } from "@/components/TestSuiteListComponent";
import type { TestSuitesManifest } from "@/types/test-suite";

export default function TestSuitesList() {
  const navigate = useNavigate();
  const [manifest, setManifest] = useState<TestSuitesManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "failed" | "passed">(
    "all"
  );
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchManifest = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      if (isRefresh) {
        const delay = Math.random() * 500 + 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const response = await fetch("/test-suites.json");
      if (!response.ok) {
        throw new Error("Failed to load test suites manifest");
      }
      const data = await response.json();
      setManifest(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load test suites"
      );
      console.error("Failed to load test suites:", err);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchManifest();
  }, []);

  // Aggregate counts
  const totalTests =
    manifest?.suites.reduce((sum, suite) => sum + suite.testCounts.total, 0) ||
    0;
  const passedTests =
    manifest?.suites.reduce((sum, suite) => sum + suite.testCounts.passed, 0) ||
    0;
  const failedTests =
    manifest?.suites.reduce((sum, suite) => sum + suite.testCounts.failed, 0) ||
    0;
  const skippedTests =
    manifest?.suites.reduce(
      (sum, suite) => sum + suite.testCounts.skipped,
      0
    ) || 0;
  const passedSuites =
    manifest?.suites.filter(s => s.status === "passed").length || 0;
  const failedSuites =
    manifest?.suites.filter(s => s.status === "failed").length || 0;
  const passRate =
    totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  const filteredSuites =
    manifest?.suites.filter(suite => {
      if (activeTab !== "all" && suite.status !== activeTab) return false;
      if (
        searchQuery &&
        !suite.suiteName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !suite.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    }) || [];

  const handleSuiteClick = (suiteName: string) => {
    navigate(`/suite/${encodeURIComponent(suiteName)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-violet-500 animate-spin" />
            <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-fuchsia-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.2s" }} />
          </div>
          <p className="text-slate-500 text-sm tracking-wide">Loading test suites…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/40">
        <TopBar />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto border-rose-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-rose-600 mb-4">{error}</p>
                <Button
                  onClick={() => void fetchManifest(false)}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <TopBar />

      <StatsHeader
        passRate={passRate}
        failedSuites={failedSuites}
        passedSuites={passedSuites}
        totalTests={totalTests}
        totalSuites={manifest?.suites.length || 0}
        passedTests={passedTests}
        failedTests={failedTests}
        skippedTests={skippedTests}
        lastUpdated={manifest?.lastUpdated || new Date().toISOString()}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 -mt-2 relative z-10 space-y-6">
        {/* Category breakdown chart */}
        <CategoryBreakdown suites={manifest?.suites || []} />

        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/70 shadow-sm shadow-slate-200/40 p-4 sm:p-5 sticky top-14 z-20"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search suite or category…"
              />
            </div>

            <div className="flex items-center gap-1 rounded-md border border-slate-200 p-0.5 bg-white">
              <button
                onClick={() => setLayout("grid")}
                className={`h-9 w-9 rounded inline-flex items-center justify-center transition ${
                  layout === "grid"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`h-9 w-9 rounded inline-flex items-center justify-center transition ${
                  layout === "list"
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                title="List view"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => void fetchManifest(true)}
              className="h-11 w-11 flex-shrink-0 bg-white"
              disabled={isRefreshing}
              title="Refresh"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={v => setActiveTab(v as typeof activeTab)}
            className="w-full mt-3"
          >
            <TabsList className="grid w-full grid-cols-3 h-11 bg-slate-100/70 p-1 rounded-lg">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-600 transition-all"
              >
                All
                <span
                  className={`ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs ${
                    activeTab === "all"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {manifest?.suites.length || 0}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="failed"
                className="data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 transition-all"
              >
                Failed
                {failedSuites > 0 && (
                  <span
                    className={`ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs ${
                      activeTab === "failed"
                        ? "bg-white/20 text-white"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {failedSuites}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="passed"
                className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 transition-all"
              >
                Passed
                {passedSuites > 0 && (
                  <span
                    className={`ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs ${
                      activeTab === "passed"
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {passedSuites}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Result count */}
        <div className="flex items-center justify-between px-1 -mt-3">
          <p className="text-sm text-slate-600">
            Showing{" "}
            <span className="text-slate-900 font-medium tabular-nums">
              {filteredSuites.length}
            </span>{" "}
            of{" "}
            <span className="tabular-nums">{manifest?.suites.length || 0}</span>{" "}
            suite{(manifest?.suites.length || 0) !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Suite list — grid or list layout */}
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 gap-4"
              : "space-y-3"
          }
        >
          <TestSuiteListComponent
            suites={filteredSuites}
            onSuiteClick={handleSuiteClick}
            isLoading={false}
            embedded
          />
        </div>

        {/* Footer */}
        <footer className="pt-8 text-center text-xs text-slate-400">
          <p>
            Bamboo QA Dashboard ·{" "}
            <a
              href="https://github.com/DHMaiKhanhdeveloper/bamboo-gateway"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-700 underline-offset-2 hover:underline"
            >
              Source on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
