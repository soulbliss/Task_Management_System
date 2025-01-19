"use client"

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import { TaskStats } from "@/lib/types/task";
import StatsCards from "./components/stats-cards";
import RecentTasks from "./components/recent-tasks";
import TaskStatusChart from './components/task-status-chart';

export default function DashboardPage() {
  const summaryData = {
    totalTasks: 25,
    tasksCompleted: "40%",
    tasksPending: "60%",
    averageTime: "3.5 hrs",
    pendingTasks: 15,
    totalTimeLapsed: "56 hrs",
    timeToFinish: "24 hrs",
  }

  const priorityData = [
    { priority: 1, pending: 3, timeLapsed: 12, timeToFinish: 8 },
    { priority: 2, pending: 5, timeLapsed: 6, timeToFinish: 3 },
    { priority: 3, pending: 1, timeLapsed: 8, timeToFinish: 7 },
    { priority: 4, pending: 0, timeLapsed: 0, timeToFinish: 0 },
    { priority: 5, pending: 6, timeLapsed: 30, timeToFinish: 6 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <nav className="flex gap-4">
            <a href="/dashboard" className="font-semibold">Dashboard</a>
            <a href="/tasks" className="text-indigo-600">Task list</a>
          </nav>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>

          <Suspense fallback={<div>Loading stats...</div>}>
            <StatsCards />
          </Suspense>

          <div className="grid gap-6 md:grid-cols-2">
            <Suspense fallback={<div>Loading chart...</div>}>
              <TaskStatusChart />
            </Suspense>
            <Suspense fallback={<div>Loading tasks...</div>}>
              <RecentTasks />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

