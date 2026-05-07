import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Search, Eye, Clock, Monitor, Target } from "lucide-react";

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

interface TestCasesTableProps {
  testCases: TestCase[];
}

export default function TestCasesTable({ testCases }: TestCasesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  const filteredTestCases = testCases.filter(testCase => {
    const matchesSearch =
      testCase.ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testCase.testPath.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || testCase.status === statusFilter;
    const matchesBranch =
      branchFilter === "all" || testCase.branch === branchFilter;

    return matchesSearch && matchesStatus && matchesBranch;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: "bg-green-100 text-green-800 hover:bg-green-100",
      failed: "bg-red-100 text-red-800 hover:bg-red-100",
      skipped: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    };
    return variants[status as keyof typeof variants] || "secondary";
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return "text-green-600";
    if (coverage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const uniqueBranches = [...new Set(testCases.map(tc => tc.branch))];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Cases</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search test cases..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="passed">Passed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="skipped">Skipped</SelectItem>
            </SelectContent>
          </Select>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {uniqueBranches.map(branch => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Test Path</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestCases.map(testCase => (
                <TableRow key={testCase.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    <a
                      href={testCase.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      {testCase.ticket}
                    </a>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {testCase.testPath}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(testCase.status)}>
                      {testCase.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      {testCase.branch}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatDuration(testCase.duration)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span className={getCoverageColor(testCase.coverage)}>
                        {testCase.coverage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{testCase.author}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Badge className={getStatusBadge(testCase.status)}>
                              {testCase.status}
                            </Badge>
                            {testCase.ticket}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">
                                Test Path
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {testCase.testPath}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Branch
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {testCase.branch}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Author
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {testCase.author}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Commit
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {testCase.commit}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Duration
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {formatDuration(testCase.duration)}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Coverage
                              </label>
                              <p
                                className={`text-sm ${getCoverageColor(testCase.coverage)}`}
                              >
                                {testCase.coverage}%
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Timestamp
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {new Date(testCase.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium">
                              Report URL
                            </label>
                            <p className="text-sm text-muted-foreground">
                              <a
                                href={testCase.reportUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {testCase.reportUrl}
                              </a>
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredTestCases.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No test cases found matching your filters.
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredTestCases.length} of {testCases.length} test cases
        </div>
      </CardContent>
    </Card>
  );
}
