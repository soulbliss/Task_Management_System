"use client"

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StatsCards from "./components/stats-cards";
import RecentTasks from "./components/recent-tasks";
import { UserNav } from "@/components/user-nav";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dashboard-layout">
      <header className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <nav className="flex gap-4">
            <a href="/dashboard" className="font-semibold">Dashboard</a>
            <a href="/tasks" className="text-indigo-600">Task list</a>
          </nav>
          <UserNav />
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="space-y-6">
          <Suspense fallback={<StatsCardsSkeleton />}>
            <StatsCards />
          </Suspense>

          <Suspense fallback={<div className="min-h-[400px] rounded-lg border bg-card text-card-foreground shadow-sm p-6">Loading tasks...</div>}>
            <RecentTasks />
          </Suspense>
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

