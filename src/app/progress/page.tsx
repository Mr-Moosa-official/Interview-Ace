import AppLayout from "@/components/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { performanceOverTimeData, interviewHistoryData } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

const chartConfig = {
  "Overall Score": {
    label: "Overall Score",
    color: "hsl(var(--primary))",
  },
  Clarity: {
    label: "Clarity",
    color: "hsl(var(--chart-2))",
  },
  Pace: {
    label: "Pace",
    color: "hsl(var(--chart-3))",
  },
  Sentiment: {
    label: "Sentiment",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

function getScoreBadge(score: number) {
  if (score >= 85) return <Badge className="bg-green-500 hover:bg-green-600">Excellent</Badge>;
  if (score >= 70) return <Badge className="bg-yellow-500 hover:bg-yellow-600">Good</Badge>;
  if (score >= 50) return <Badge variant="secondary">Average</Badge>;
  return <Badge variant="destructive">Needs Improvement</Badge>;
}


export default function ProgressPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your improvement and review past interview sessions.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>
              Visualize your scores across different categories for each session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <AreaChart
                accessibilityLayer
                data={performanceOverTimeData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    label={{ value: "Score", angle: -90, position: 'insideLeft' }}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                    <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-Overall Score)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-Overall Score)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area
                  dataKey="Overall Score"
                  type="natural"
                  fill="url(#fillScore)"
                  stroke="var(--color-Overall Score)"
                  stackId="a"
                />
                 <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview History</CardTitle>
            <CardDescription>
              A log of all your past mock interview sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Seniority</TableHead>
                  <TableHead className="text-right">Overall Score</TableHead>
                  <TableHead className="text-center">Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviewHistoryData.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.date}</TableCell>
                    <TableCell>{session.role}</TableCell>
                    <TableCell>{session.seniority}</TableCell>
                    <TableCell className="text-right font-mono">{session.overallScore}</TableCell>
                    <TableCell className="text-center">{getScoreBadge(session.overallScore)}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="outline" size="sm">
                          View Details
                          <ArrowRight className="ml-2 size-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
