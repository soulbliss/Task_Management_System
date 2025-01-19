"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'

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
        
        <div className="grid gap-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-indigo-600">
                    {summaryData.totalTasks}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Total tasks</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-indigo-600">
                    {summaryData.tasksCompleted}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Tasks completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-indigo-600">
                    {summaryData.tasksPending}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Tasks pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-indigo-600">
                    {summaryData.averageTime}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Average time per completed task</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Pending task summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-indigo-600">
                    {summaryData.pendingTasks}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Pending tasks</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-indigo-600">
                    {summaryData.totalTimeLapsed}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Total time lapsed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-4xl font-bold text-indigo-600">
                    {summaryData.timeToFinish}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Total time to finish</p>
                  <p className="text-xs text-gray-400">estimated based on endtime</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>Task priority breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task priority</TableHead>
                      <TableHead>Pending tasks</TableHead>
                      <TableHead>Time lapsed (hrs)</TableHead>
                      <TableHead>Time to finish (hrs)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priorityData.map((row) => (
                      <TableRow key={row.priority}>
                        <TableCell>{row.priority}</TableCell>
                        <TableCell>{row.pending}</TableCell>
                        <TableCell>{row.timeLapsed}</TableCell>
                        <TableCell>{row.timeToFinish}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  )
}

