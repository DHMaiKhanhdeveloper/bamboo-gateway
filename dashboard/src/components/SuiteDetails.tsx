import { useState } from "react";
import {
  ArrowLeft,
  GitBranch,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  Zap,
  AlertTriangle,
  ExternalLink,
  Play,
  ChevronDown,
  Copy,
  Download,
  Share2,
  MoreVertical,
  Terminal,
  AlertCircle,
  CheckCheck,
  BarChart3,
  History,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SuiteAggregation } from "@/types/test-suite";
import { useNavigate } from "react-router-dom";

interface SuiteDetailsProps {
  suiteData: SuiteAggregation;
  onBack: () => void;
}

export function SuiteDetails({ suiteData, onBack }: SuiteDetailsProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [openSections, setOpenSections] = useState({
    quickInfo: true,
    performance: false,
    health: false,
    history: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatDate(dateString);
  };

  const getStatusColor = (status: string) => {
    return status === "passed" ? "text-emerald-600" : "text-rose-600";
  };

  const getStatusBgColor = (status: string) => {
    return status === "passed" ? "bg-emerald-50" : "bg-rose-50";
  };

  const getStatusBorderColor = (status: string) => {
    return status === "passed" ? "border-emerald-200" : "border-rose-200";
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

  const handleCopyCommit = async () => {
    try {
      await navigator.clipboard.writeText(latestRun.commit.sha);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textarea = document.createElement("textarea");
      textarea.value = latestRun.commit.sha;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Failed to copy text:", fallbackErr);
      }
      document.body.removeChild(textarea);
    }
  };

  const { latestRun, stats, healthScore } = suiteData;
  const isFailed = latestRun.status === "failed";
  const isPassed = latestRun.status === "passed";
  const successPercentage =
    (latestRun.testCounts.passed / latestRun.testCounts.total) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Enhanced Sticky Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="flex-shrink-0 h-9 w-9"
              aria-label="Back to test suites"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Badge variant="outline" className="text-xs border-slate-300">
                  {suiteData.category}
                </Badge>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getStatusBgColor(latestRun.status)}`}
                >
                  <Circle
                    className={`h-2 w-2 fill-current ${getStatusColor(latestRun.status)}`}
                  />
                  <span
                    className={`text-xs capitalize ${getStatusColor(latestRun.status)}`}
                  >
                    {latestRun.status}
                  </span>
                </div>
              </div>
              <h1 className="text-slate-900 truncate text-base sm:text-lg">
                {suiteData.suiteName}
              </h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 flex-shrink-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in CI
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4 pb-6">
        {/* 1. CRITICAL ALERTS - Top Priority */}
        {isFailed && (
          <Alert className="bg-rose-50 border-2 border-rose-300">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="text-rose-900">
                  <strong className="text-base">
                    {latestRun.testCounts.failed}
                  </strong>{" "}
                  test{latestRun.testCounts.failed > 1 ? "s" : ""} failed
                  {stats.consecutiveFailures > 1 && (
                    <span className="ml-2 text-sm">
                      • {stats.consecutiveFailures} consecutive failures
                    </span>
                  )}
                </p>
                {stats.lastFailure && (
                  <p className="text-sm text-rose-700">
                    {stats.lastFailure.reason}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isPassed && stats.consecutivePasses > 5 && (
          <Alert className="bg-emerald-50 border-2 border-emerald-300">
            <CheckCheck className="h-5 w-5 text-emerald-600" />
            <AlertDescription className="text-emerald-900">
              <strong>{stats.consecutivePasses}</strong> consecutive successful
              runs
              {stats.trend === "improving" && (
                <span className="ml-2">• Trend improving</span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {latestRun.testCounts.flaky > 0 && (
          <Alert className="bg-amber-50 border-2 border-amber-300">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-900">
              <strong>{latestRun.testCounts.flaky}</strong> flaky test
              {latestRun.testCounts.flaky > 1 ? "s" : ""} detected (passed after
              retries)
            </AlertDescription>
          </Alert>
        )}

        {/* 2. STATUS OVERVIEW - Hero Section */}
        <Card
          className={`border-2 ${getStatusBorderColor(latestRun.status)} ${getStatusBgColor(latestRun.status)}`}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`h-14 w-14 sm:h-16 sm:w-16 rounded-xl flex items-center justify-center ${
                    isPassed ? "bg-emerald-100" : "bg-rose-100"
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="h-8 w-8 sm:h-9 sm:w-9 text-emerald-600" />
                  ) : (
                    <XCircle className="h-8 w-8 sm:h-9 sm:w-9 text-rose-600" />
                  )}
                </div>
                <div>
                  <div
                    className={`text-3xl sm:text-4xl capitalize ${getStatusColor(latestRun.status)}`}
                  >
                    {latestRun.status}
                  </div>
                  <p className="text-slate-600 text-sm">
                    {formatRelativeTime(latestRun.timestamp)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-4xl sm:text-5xl tabular-nums ${getStatusColor(latestRun.status)}`}
                >
                  {Math.round(successPercentage)}%
                </div>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  {latestRun.testCounts.passed} / {latestRun.testCounts.total}
                </p>
              </div>
            </div>

            <Progress
              value={successPercentage}
              className="h-2.5 mb-4"
              indicatorClassName={isPassed ? "bg-emerald-500" : "bg-rose-500"}
            />

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="text-center p-2.5 sm:p-3 bg-white/70 rounded-lg border border-slate-200/50">
                <p className="text-xs text-slate-500 mb-0.5">Duration</p>
                <p className="text-base sm:text-lg text-slate-900 tabular-nums">
                  {latestRun.durationFormatted}
                </p>
              </div>
              <div className="text-center p-2.5 sm:p-3 bg-white/70 rounded-lg border border-slate-200/50">
                <p className="text-xs text-slate-500 mb-0.5">Health</p>
                <p
                  className={`text-base sm:text-lg tabular-nums ${getHealthColor(healthScore.overall)}`}
                >
                  {healthScore.overall}
                </p>
              </div>
              <div className="text-center p-2.5 sm:p-3 bg-white/70 rounded-lg border border-slate-200/50">
                <p className="text-xs text-slate-500 mb-0.5">Coverage</p>
                <p className="text-base sm:text-lg text-slate-900 tabular-nums">
                  {latestRun.coverage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button className="gap-2 h-11 sm:h-12 w-full" size="lg">
            <Play className="h-4 w-4" />
            Re-run Suite
          </Button>
          <Button
            variant="outline"
            className="gap-2 h-11 sm:h-12 w-full"
            size="lg"
            onClick={() =>
              navigate(`/reports/${suiteData.suiteName}/playwright`)
            }
          >
            <ExternalLink className="h-4 w-4" />
            Full Report
          </Button>
        </div>

        {/* 4. QUICK INFO - Always Visible, Collapsible */}
        <Collapsible
          open={openSections.quickInfo}
          onOpenChange={() => toggleSection("quickInfo")}
        >
          <Card className="bg-white border-slate-200">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="pb-3 cursor-pointer hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-slate-500" />
                    Quick Overview
                  </CardTitle>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform ${openSections.quickInfo ? "rotate-180" : ""}`}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                {/* Test Breakdown */}
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Test Results</p>

                  {/* Passed */}
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm text-emerald-900">Passed</span>
                    </div>
                    <span className="text-emerald-900 tabular-nums">
                      {latestRun.testCounts.passed}{" "}
                      <span className="text-emerald-600/60 text-xs">
                        / {latestRun.testCounts.total}
                      </span>
                    </span>
                  </div>

                  {/* Failed */}
                  {latestRun.testCounts.failed > 0 && (
                    <div className="flex items-center justify-between p-2.5 bg-rose-50 rounded-lg border border-rose-100">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-rose-600" />
                        <span className="text-sm text-rose-900">Failed</span>
                      </div>
                      <span className="text-rose-900 tabular-nums">
                        {latestRun.testCounts.failed}{" "}
                        <span className="text-rose-600/60 text-xs">
                          / {latestRun.testCounts.total}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Skipped */}
                  {latestRun.testCounts.skipped > 0 && (
                    <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                      <div className="flex items-center gap-2">
                        <Circle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm text-amber-900">Skipped</span>
                      </div>
                      <span className="text-amber-900 tabular-nums">
                        {latestRun.testCounts.skipped}{" "}
                        <span className="text-amber-600/60 text-xs">
                          / {latestRun.testCounts.total}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Commit Quick View */}
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Commit Info</p>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <code className="text-xs sm:text-sm font-mono text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                        {latestRun.commit.sha}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0"
                        onClick={e => {
                          e.stopPropagation();
                          handleCopyCommit();
                        }}
                      >
                        {copied ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-slate-700 mb-1 line-clamp-2">
                      {latestRun.commit.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <GitBranch className="h-3 w-3" />
                      <code className="font-mono">
                        {latestRun.commit.branch}
                      </code>
                      <span>•</span>
                      <span>{latestRun.commit.author}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Environment Quick View */}
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Environment</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                      <Terminal className="h-3.5 w-3.5 text-slate-400" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">Browser</p>
                        <p className="text-xs text-slate-900 capitalize truncate">
                          {latestRun.environment.browser}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200">
                      <Activity className="h-3.5 w-3.5 text-slate-400" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">OS</p>
                        <p className="text-xs text-slate-900 capitalize truncate">
                          {latestRun.environment.os}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* 5. PERFORMANCE METRICS - Collapsible */}
        <Collapsible
          open={openSections.performance}
          onOpenChange={() => toggleSection("performance")}
        >
          <Card className="bg-white border-slate-200">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="pb-3 cursor-pointer hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-slate-500" />
                    Performance
                  </CardTitle>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform ${openSections.performance ? "rotate-180" : ""}`}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Avg Test</p>
                    <p className="text-lg sm:text-xl text-slate-900 tabular-nums">
                      {latestRun.metrics.avgTestDuration}
                      <span className="text-xs text-slate-500">ms</span>
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Slowest</p>
                    <p className="text-lg sm:text-xl text-slate-900 tabular-nums">
                      {latestRun.metrics.slowestTest?.duration || 0}
                      <span className="text-xs text-slate-500">ms</span>
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Retries</p>
                    <p className="text-lg sm:text-xl text-slate-900 tabular-nums">
                      {latestRun.metrics.retries}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Timeouts</p>
                    <p className="text-lg sm:text-xl text-slate-900 tabular-nums">
                      {latestRun.metrics.timeouts}
                    </p>
                  </div>
                </div>

                {latestRun.metrics.slowestTest &&
                  latestRun.metrics.slowestTest.duration > 1000 && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <p className="text-xs text-amber-700 mb-1">
                        Slowest Test
                      </p>
                      <p className="text-sm text-amber-900 break-words">
                        {latestRun.metrics.slowestTest.name}
                      </p>
                    </div>
                  )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* 6. HEALTH & TRENDS - Collapsible */}
        <Collapsible
          open={openSections.health}
          onOpenChange={() => toggleSection("health")}
        >
          <Card className="bg-white border-slate-200">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="pb-3 cursor-pointer hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-slate-500" />
                    Health & Trends
                  </CardTitle>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform ${openSections.health ? "rotate-180" : ""}`}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                {/* Health Scores */}
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">Health Breakdown</p>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-sm text-slate-700">Stability</span>
                      <span
                        className={`tabular-nums ${getHealthColor(healthScore.stability)}`}
                      >
                        {healthScore.stability}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-sm text-slate-700">
                        Performance
                      </span>
                      <span
                        className={`tabular-nums ${getHealthColor(healthScore.performance)}`}
                      >
                        {healthScore.performance}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-sm text-slate-700">Coverage</span>
                      <span
                        className={`tabular-nums ${getHealthColor(healthScore.coverage)}`}
                      >
                        {healthScore.coverage}%
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Statistics</p>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      {getTrendIcon(stats.trend)}
                      <span className="text-sm text-slate-900 capitalize">
                        {stats.trend}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-base text-slate-900 tabular-nums">
                        {stats.successRate}%
                      </p>
                      <p className="text-xs text-slate-500">success rate</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                      <p className="text-xs text-emerald-700 mb-1">Passes</p>
                      <p className="text-xl text-emerald-900 tabular-nums">
                        {stats.consecutivePasses}
                      </p>
                    </div>

                    <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-100">
                      <p className="text-xs text-rose-700 mb-1">Failures</p>
                      <p className="text-xl text-rose-900 tabular-nums">
                        {stats.consecutiveFailures}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* 7. RUN HISTORY - Collapsible */}
        <Collapsible
          open={openSections.history}
          onOpenChange={() => toggleSection("history")}
        >
          <Card className="bg-white border-slate-200">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="pb-3 cursor-pointer hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-slate-500" />
                    <CardTitle className="text-base sm:text-lg">
                      Run History
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {suiteData.history.length}
                    </Badge>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform ${openSections.history ? "rotate-180" : ""}`}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <p className="text-xs text-slate-500 mb-0.5">Total</p>
                    <p className="text-lg text-slate-900 tabular-nums">
                      {stats.totalRuns}
                    </p>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                    <p className="text-xs text-emerald-600 mb-0.5">Passed</p>
                    <p className="text-lg text-emerald-900 tabular-nums">
                      {stats.passedRuns}
                    </p>
                  </div>
                  <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-100 text-center">
                    <p className="text-xs text-rose-600 mb-0.5">Failed</p>
                    <p className="text-lg text-rose-900 tabular-nums">
                      {stats.failedRuns}
                    </p>
                  </div>
                </div>

                {/* History List */}
                <ScrollArea className="h-[300px] pr-3">
                  <div className="space-y-2.5">
                    {suiteData.history.map(run => (
                      <div
                        key={run.id}
                        className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {run.status === "passed" ? (
                              <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center">
                                <XCircle className="h-4 w-4 text-rose-600" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <Badge
                                className={`${getStatusBgColor(run.status)} ${getStatusColor(run.status)} border-0 text-xs`}
                              >
                                {run.status}
                              </Badge>
                              <span className="text-xs text-slate-500 tabular-nums">
                                {formatDate(run.timestamp)}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs mb-1.5">
                              <div>
                                <span className="text-slate-500">Tests:</span>
                                <span className="text-slate-900 ml-1 tabular-nums">
                                  {run.testCounts.passed}/{run.testCounts.total}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500">Time:</span>
                                <span className="text-slate-900 ml-1 tabular-nums">
                                  {(run.duration / 1000).toFixed(1)}s
                                </span>
                              </div>
                            </div>

                            {run.commit.sha && (
                              <div className="flex items-center gap-1.5">
                                <code className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-mono">
                                  {run.commit.sha}
                                </code>
                                {run.commit.branch && (
                                  <>
                                    <span className="text-xs text-slate-400">
                                      •
                                    </span>
                                    <span className="text-xs text-slate-500 truncate font-mono">
                                      {run.commit.branch}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
}
