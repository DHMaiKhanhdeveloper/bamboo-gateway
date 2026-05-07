import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, XCircle, Clock, Play, Target } from "lucide-react";

interface StatsData {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  averageCoverage: number;
}

interface DashboardStatsProps {
  stats: StatsData;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const passRate = ((stats.passed / stats.total) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
          <Play className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.duration} total runtime
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Passed</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.passed}
          </div>
          <p className="text-xs text-muted-foreground">{passRate}% pass rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <p className="text-xs text-muted-foreground">
            {((stats.failed / stats.total) * 100).toFixed(1)}% failure rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Skipped</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.skipped}
          </div>
          <p className="text-xs text-muted-foreground">
            {((stats.skipped / stats.total) * 100).toFixed(1)}% skipped
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <div
            className={`h-2 w-2 rounded-full ${parseFloat(passRate) > 80 ? "bg-green-600" : parseFloat(passRate) > 60 ? "bg-yellow-600" : "bg-red-600"}`}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{passRate}%</div>
          <p className="text-xs text-muted-foreground">Overall success rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Coverage</CardTitle>
          <Target className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.averageCoverage}%
          </div>
          <p className="text-xs text-muted-foreground">Average test coverage</p>
        </CardContent>
      </Card>
    </div>
  );
}
