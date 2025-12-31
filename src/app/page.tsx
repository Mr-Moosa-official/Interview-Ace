'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { performanceData } from "@/lib/mock-data";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your interview prep overview.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Start a New Session</CardTitle>
            <CardDescription>
              Customize your mock interview to match your career goals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/interview">
              <Button size="lg" className="w-full sm:w-auto">
                Start New Mock Interview
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Performance</CardTitle>
              <CardDescription>
                A look at your scores from the last few sessions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart accessibilityLayer data={performanceData.slice(0, 5)}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Focus Areas</CardTitle>
              <CardDescription>
                Top areas for improvement based on your history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <BarChart3 className="size-4" />
                  </div>
                  <span className="font-medium">Pacing and Clarity</span>
                  <span className="ml-auto text-muted-foreground">7/10 Avg.</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <BarChart3 className="size-4" />
                  </div>
                  <span className="font-medium">Behavioral Questioning</span>
                  <span className="ml-auto text-muted-foreground">6/10 Avg.</span>
                </li>
                <li className="flex items-center gap-3">
                   <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <BarChart3 className="size-4" />
                  </div>
                  <span className="font-medium">Technical Explanations</span>
                   <span className="ml-auto text-muted-foreground">8/10 Avg.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
