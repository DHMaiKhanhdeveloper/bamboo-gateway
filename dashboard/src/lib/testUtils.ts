// Test utilities for dashboard
export interface TestCase {
  id: string;
  ticket: string;
  branch: string;
  status: "passed" | "failed" | "skipped";
  duration: number;
  coverage: number;
  testPath: string;
  timestamp: string;
  author: string;
  commit: string;
  reportUrl: string;
}

export interface StatsData {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  averageCoverage: number;
}

export function getStats(testCases: TestCase[]): StatsData {
  const total = testCases.length;
  const passed = testCases.filter(tc => tc.status === "passed").length;
  const failed = testCases.filter(tc => tc.status === "failed").length;
  const skipped = testCases.filter(tc => tc.status === "skipped").length;

  const totalDuration = testCases.reduce((sum, tc) => sum + tc.duration, 0);
  const minutes = Math.floor(totalDuration / 60000);
  const seconds = Math.floor((totalDuration % 60000) / 1000);
  const duration = `${minutes}m ${seconds}s`;

  const averageCoverage =
    total > 0
      ? Math.round(testCases.reduce((sum, tc) => sum + tc.coverage, 0) / total)
      : 0;

  return {
    total,
    passed,
    failed,
    skipped,
    duration,
    averageCoverage,
  };
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export function getPieData(testCases: TestCase[]): ChartData[] {
  const stats = getStats(testCases);

  return [
    { name: "Passed", value: stats.passed, color: "#16a34a" },
    { name: "Failed", value: stats.failed, color: "#dc2626" },
    { name: "Skipped", value: stats.skipped, color: "#ca8a04" },
  ];
}

export interface BranchData {
  branch: string;
  passed: number;
  failed: number;
  skipped: number;
  averageCoverage: number;
}

export interface CoverageData {
  branch: string;
  coverage: number;
  color: string;
}

export function getBranchData(testCases: TestCase[]): BranchData[] {
  const branches = [...new Set(testCases.map(tc => tc.branch))];

  return branches.map(branch => {
    const branchTests = testCases.filter(tc => tc.branch === branch);
    const averageCoverage =
      branchTests.length > 0
        ? Math.round(
            branchTests.reduce((sum, tc) => sum + tc.coverage, 0) /
              branchTests.length
          )
        : 0;

    return {
      branch,
      passed: branchTests.filter(tc => tc.status === "passed").length,
      failed: branchTests.filter(tc => tc.status === "failed").length,
      skipped: branchTests.filter(tc => tc.status === "skipped").length,
      averageCoverage,
    };
  });
}

export function getCoverageData(testCases: TestCase[]): CoverageData[] {
  const branches = [...new Set(testCases.map(tc => tc.branch))];

  return branches.map(branch => {
    const branchTests = testCases.filter(tc => tc.branch === branch);
    const averageCoverage =
      branchTests.length > 0
        ? Math.round(
            branchTests.reduce((sum, tc) => sum + tc.coverage, 0) /
              branchTests.length
          )
        : 0;

    // Color based on coverage percentage
    let color = "#dc2626"; // Red for low coverage
    if (averageCoverage >= 80)
      color = "#16a34a"; // Green for high coverage
    else if (averageCoverage >= 60) color = "#ca8a04"; // Yellow for medium coverage

    return {
      branch,
      coverage: averageCoverage,
      color,
    };
  });
}
