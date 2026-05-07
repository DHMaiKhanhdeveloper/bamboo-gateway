export interface TestCounts {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
}

export interface CommitInfo {
  sha: string;
  message: string;
  author: string;
  branch: string;
  url: string;
}

export interface Environment {
  ci: boolean;
  browser: string;
  os: string;
  nodeVersion: string;
}

export interface TestMetrics {
  avgTestDuration: number;
  slowestTest: {
    name: string;
    duration: number;
  } | null;
  retries: number;
  timeouts: number;
}

export interface ChangeFromPrevious {
  status: "improved" | "degraded" | "stable";
  durationDelta: number;
  coverageDelta: number;
  newFailures: number;
  fixedFailures: number;
}

export interface TestRun {
  id: string;
  status: "passed" | "failed" | "flaky";
  timestamp: string;
  duration: number;
  testCounts: TestCounts;
  coverage: number;
  commit: Partial<CommitInfo>;
  changeFromPrevious?: ChangeFromPrevious;
}

export interface LatestRun extends TestRun {
  durationFormatted: string;
  reportUrl: string;
  commit: CommitInfo;
  environment: Environment;
  metrics: TestMetrics;
}

export interface Stats {
  totalRuns: number;
  passedRuns: number;
  failedRuns: number;
  flakyRuns: number;
  lastUpdated: string;
  avgDuration: number;
  avgCoverage: number;
  successRate: number;
  trend: "improving" | "stable" | "declining";
  consecutivePasses: number;
  consecutiveFailures: number;
  lastFailure: {
    timestamp: string;
    reason: string;
  } | null;
}

export interface HealthScore {
  overall: number;
  stability: number;
  performance: number;
  coverage: number;
}

export interface SuiteAggregation {
  suiteName: string;
  category: string;
  latestRun: LatestRun;
  history: TestRun[];
  stats: Stats;
  healthScore: HealthScore;
}

export interface TestSuiteSummary {
  suiteName: string;
  category: string;
  status: "passed" | "failed" | "flaky";
  lastRun: string;
  successRate: number;
  healthScore: number;
  testCounts: TestCounts;
}

export interface TestSuitesManifest {
  suites: TestSuiteSummary[];
  lastUpdated: string;
  totalSuites: number;
}

