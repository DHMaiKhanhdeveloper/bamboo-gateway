import {
  ArrowLeft,
  GitBranch,
  GitCommit,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  AlertTriangle,
  ExternalLink,
  Info,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import type { SuiteAggregation } from "@/types/test-suite";
import { Link } from "react-router-dom";

interface SuiteDetailsComponentProps {
  suiteData: SuiteAggregation;
  onBack: () => void;
}

export function SuiteDetailsComponent({
  suiteData,
  onBack,
}: SuiteDetailsComponentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getStatusColor = (status: string) => {
    return status === "passed" ? "text-emerald-600" : "text-rose-600";
  };

  const getStatusBgColor = (status: string) => {
    return status === "passed" ? "bg-emerald-50" : "bg-rose-50";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case "declining":
        return <TrendingUp className="h-4 w-4 text-rose-600 rotate-180" />;
      default:
        return <Activity className="h-4 w-4 text-slate-600" />;
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 50) return "text-amber-600";
    return "text-rose-600";
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const { latestRun, stats, healthScore } = suiteData;
  const isFailed = latestRun.status === "failed";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10"
              aria-label="Back to test suites"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {suiteData.category}
                </Badge>
                <Badge
                  className={`${getStatusBgColor(latestRun.status)} ${getStatusColor(latestRun.status)} border-0 text-xs`}
                >
                  {latestRun.status === "passed" ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  {latestRun.status}
                </Badge>
              </div>
              <h1 className="text-slate-900 truncate text-base sm:text-xl md:text-2xl">
                {suiteData.suiteName}
              </h1>
              <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                <Clock className="h-3 w-3" />
                <span>{formatRelativeTime(latestRun.timestamp)}</span>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-2">
              <Link to={`/reports/${suiteData.suiteName}/playwright`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-20 sm:pb-6">
        {/* Alert Banner for Failed Tests */}
        {isFailed && (
          <Alert className="bg-rose-50 border-rose-200">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <AlertDescription className="text-rose-900">
              <span className="block sm:inline">
                <strong>{latestRun.testCounts.failed}</strong> of{" "}
                <strong>{latestRun.testCounts.total}</strong> tests failed.
              </span>
              {stats.lastFailure && (
                <span className="block sm:inline sm:ml-2 text-rose-700 text-sm mt-1 sm:mt-0">
                  {stats.lastFailure.reason}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs sm:text-sm">Tests</span>
                <Activity className="h-4 w-4 text-slate-400" />
              </div>
              <div className="text-slate-900 text-xl sm:text-2xl">
                {latestRun.testCounts.total}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                <span className="text-emerald-600">
                  {latestRun.testCounts.passed}
                </span>{" "}
                /{" "}
                <span className="text-rose-600">
                  {latestRun.testCounts.failed}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs sm:text-sm">
                  Duration
                </span>
                <Clock className="h-4 w-4 text-slate-400" />
              </div>
              <div className="text-slate-900 text-xl sm:text-2xl">
                {latestRun.durationFormatted}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {latestRun.metrics.avgTestDuration}ms avg
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs sm:text-sm">
                  Success Rate
                </span>
                <TrendingUp className="h-4 w-4 text-slate-400" />
              </div>
              <div
                className={`text-xl sm:text-2xl ${getHealthColor(stats.successRate)}`}
              >
                {stats.successRate}%
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.passedRuns}/{stats.totalRuns} runs
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs sm:text-sm">
                  Health
                </span>
                <Shield className="h-4 w-4 text-slate-400" />
              </div>
              <div
                className={`text-xl sm:text-2xl ${getHealthColor(healthScore.overall)}`}
              >
                {healthScore.overall}
              </div>
              <Progress
                value={healthScore.overall}
                className="h-1.5 mt-2"
                indicatorClassName={getHealthBg(healthScore.overall)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Tabs - Mobile Optimized */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-10 sm:h-11 bg-slate-100 p-1 rounded-lg">
            <TabsTrigger
              value="overview"
              className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="metrics"
              className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600"
            >
              Metrics
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-600"
            >
              History
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-3 sm:space-y-4 mt-4">
            {/* Test Results Summary */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span className="text-slate-700 text-sm">Passed</span>
                    </div>
                    <span className="text-slate-900">
                      {latestRun.testCounts.passed}
                    </span>
                  </div>
                  <Progress
                    value={
                      (latestRun.testCounts.passed /
                        latestRun.testCounts.total) *
                      100
                    }
                    className="h-2"
                    indicatorClassName="bg-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                      <span className="text-slate-700 text-sm">Failed</span>
                    </div>
                    <span className="text-slate-900">
                      {latestRun.testCounts.failed}
                    </span>
                  </div>
                  <Progress
                    value={
                      (latestRun.testCounts.failed /
                        latestRun.testCounts.total) *
                      100
                    }
                    className="h-2"
                    indicatorClassName="bg-rose-500"
                  />
                </div>

                {latestRun.testCounts.skipped > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <span className="text-slate-700 text-sm">Skipped</span>
                      </div>
                      <span className="text-slate-900">
                        {latestRun.testCounts.skipped}
                      </span>
                    </div>
                    <Progress
                      value={
                        (latestRun.testCounts.skipped /
                          latestRun.testCounts.total) *
                        100
                      }
                      className="h-2"
                      indicatorClassName="bg-amber-500"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Commit Info */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  Commit Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <GitCommit className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <code className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs sm:text-sm mb-2">
                      {latestRun.commit.sha}
                    </code>
                    <p className="text-slate-700 text-sm sm:text-base break-words">
                      {latestRun.commit.message}
                    </p>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      by {latestRun.commit.author}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <GitBranch className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-500 text-xs mb-0.5">Branch</p>
                    <p className="text-slate-700 text-sm truncate">
                      {latestRun.commit.branch}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environment */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  Environment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Browser</p>
                    <p className="text-slate-700 text-sm capitalize">
                      {latestRun.environment.browser}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">OS</p>
                    <p className="text-slate-700 text-sm capitalize">
                      {latestRun.environment.os}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Node Version</p>
                    <p className="text-slate-700 text-sm">
                      {latestRun.environment.nodeVersion}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">CI</p>
                    <Badge
                      variant={
                        latestRun.environment.ci ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {latestRun.environment.ci ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-3 sm:space-y-4 mt-4">
            {/* Health Score Breakdown */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  Health Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 text-sm">Stability</span>
                    <span
                      className={`${getHealthColor(healthScore.stability)}`}
                    >
                      {healthScore.stability}%
                    </span>
                  </div>
                  <Progress
                    value={healthScore.stability}
                    className="h-2"
                    indicatorClassName={getHealthBg(healthScore.stability)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 text-sm">Performance</span>
                    <span
                      className={`${getHealthColor(healthScore.performance)}`}
                    >
                      {healthScore.performance}%
                    </span>
                  </div>
                  <Progress
                    value={healthScore.performance}
                    className="h-2"
                    indicatorClassName={getHealthBg(healthScore.performance)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 text-sm">Coverage</span>
                    <span className={`${getHealthColor(healthScore.coverage)}`}>
                      {healthScore.coverage}%
                    </span>
                  </div>
                  <Progress
                    value={healthScore.coverage}
                    className="h-2"
                    indicatorClassName={getHealthBg(healthScore.coverage)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-500 text-xs">Avg Test</span>
                    </div>
                    <p className="text-slate-900 text-lg sm:text-xl">
                      {latestRun.metrics.avgTestDuration}ms
                    </p>
                  </div>

                  {latestRun.metrics.slowestTest && (
                    <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-500 text-xs">Slowest</span>
                      </div>
                      <p className="text-slate-900 text-lg sm:text-xl">
                        {latestRun.metrics.slowestTest.duration}ms
                      </p>
                      <p className="text-slate-500 text-xs mt-1 truncate">
                        {latestRun.metrics.slowestTest.name}
                      </p>
                    </div>
                  )}

                  <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-xs block mb-2">
                      Retries
                    </span>
                    <p className="text-slate-900 text-lg sm:text-xl">
                      {latestRun.metrics.retries}
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-500 text-xs block mb-2">
                      Timeouts
                    </span>
                    <p className="text-slate-900 text-lg sm:text-xl">
                      {latestRun.metrics.timeouts}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trends */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Trends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(stats.trend)}
                    <div>
                      <p className="text-slate-700 text-sm">Overall Trend</p>
                      <p className="text-slate-500 text-xs capitalize">
                        {stats.trend}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 sm:p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p className="text-emerald-700 text-xs mb-1">
                      Consecutive Passes
                    </p>
                    <p className="text-emerald-900 text-xl sm:text-2xl">
                      {stats.consecutivePasses}
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 bg-rose-50 rounded-lg border border-rose-100">
                    <p className="text-rose-700 text-xs mb-1">
                      Consecutive Failures
                    </p>
                    <p className="text-rose-900 text-xl sm:text-2xl">
                      {stats.consecutiveFailures}
                    </p>
                  </div>
                </div>

                {stats.lastFailure && (
                  <div className="p-3 sm:p-4 bg-rose-50 rounded-lg border border-rose-100">
                    <div className="flex items-start gap-2 mb-1">
                      <Info className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <p className="text-rose-700 text-xs">Last Failure</p>
                    </div>
                    <p className="text-rose-900 text-sm">
                      {formatDate(stats.lastFailure.timestamp)}
                    </p>
                    <p className="text-rose-700 text-xs mt-1 break-words">
                      {stats.lastFailure.reason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-3 sm:space-y-4 mt-4">
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  Run History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suiteData.history.slice(0, 10).map(run => (
                  <div
                    key={run.id}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {run.status === "passed" ? (
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-rose-100 flex items-center justify-center">
                          <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge
                          className={`${getStatusBgColor(run.status)} ${getStatusColor(run.status)} border-0 text-xs`}
                        >
                          {run.status}
                        </Badge>
                        <span className="text-slate-500 text-xs">
                          {formatDate(run.timestamp)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm mb-2">
                        <div>
                          <span className="text-slate-500">Tests: </span>
                          <span className="text-slate-700">
                            {run.testCounts.passed}/{run.testCounts.total}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Duration: </span>
                          <span className="text-slate-700">
                            {(run.duration / 1000).toFixed(2)}s
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                          {run.commit.sha}
                        </code>
                        {run.commit.branch && (
                          <span className="text-slate-500 text-xs truncate">
                            {run.commit.branch}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <Card className="bg-white border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">
                  All-Time Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-slate-500 text-xs mb-1">Total Runs</p>
                    <p className="text-slate-900 text-xl sm:text-2xl">
                      {stats.totalRuns}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p className="text-emerald-600 text-xs mb-1">Passed</p>
                    <p className="text-emerald-900 text-xl sm:text-2xl">
                      {stats.passedRuns}
                    </p>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                    <p className="text-rose-600 text-xs mb-1">Failed</p>
                    <p className="text-rose-900 text-xl sm:text-2xl">
                      {stats.failedRuns}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-slate-500 text-xs mb-1">Avg Duration</p>
                    <p className="text-slate-900 text-xl sm:text-2xl">
                      {(stats.avgDuration / 1000).toFixed(1)}s
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-slate-500 text-xs mb-1">Avg Coverage</p>
                    <p className="text-slate-900 text-xl sm:text-2xl">
                      {stats.avgCoverage}%
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-amber-600 text-xs mb-1">Flaky</p>
                    <p className="text-amber-900 text-xl sm:text-2xl">
                      {stats.flakyRuns}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Action Bar - Sticky at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 sm:hidden shadow-lg z-20">
        <div className="flex items-center gap-2">
          <Link
            to={`/reports/${suiteData.suiteName}/playwright`}
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              View Report
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
