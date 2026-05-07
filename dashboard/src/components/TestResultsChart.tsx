import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface BranchData {
  branch: string;
  passed: number;
  failed: number;
  skipped: number;
}

interface TestResultsChartProps {
  pieData: ChartData[];
  branchData: BranchData[];
}

const COLORS = {
  passed: '#16a34a',
  failed: '#dc2626',
  skipped: '#ca8a04'
};

export default function TestResultsChart({ pieData, branchData }: TestResultsChartProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Results Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results by Branch</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="passed" fill={COLORS.passed} name="Passed" />
              <Bar dataKey="failed" fill={COLORS.failed} name="Failed" />
              <Bar dataKey="skipped" fill={COLORS.skipped} name="Skipped" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
