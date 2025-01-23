"use client"

import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import StatsCards from "./components/stats-cards";
import RecentTasks from "./components/recent-tasks";
import { UserNav } from "@/components/user-nav";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans dashboard-layout italic">
      <header className="border-b bg-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <nav className="flex gap-4">
            <a href="/dashboard" className="font-semibold text-white hover:text-gray-300 font-inter italic">Dashboard</a>
            <a href="/tasks" className="text-blue-300 hover:text-blue-200 font-sans">Task list</a>
          </nav>
          <UserNav />
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 font-inter italic">
        <div className="space-y-6">
          <div className="italic">
            <Suspense fallback={<StatsCardsSkeleton />}>
              <StatsCards />
            </Suspense>
          </div>

          <div className="font-sans">
            <Suspense fallback={<div className="min-h-[400px] rounded-lg border bg-blue-800 text-white shadow-sm p-6">Loading tasks...</div>}>
              <div className="bg-blue-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Tasks</h2>
                <RecentTasks />
              </div>
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 italic">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium italic text-white">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold italic text-gray-200">--</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

