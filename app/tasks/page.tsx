"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { LogOut, Plus, ArrowUpDown } from 'lucide-react'
import { TaskDialog } from "@/components/task-dialog"
import { format } from "date-fns"
import { TaskForm } from '@/components/task-form'
import { logger } from '@/lib/utils/logger'

interface Task {
  id: number
  title: string
  description: string
  status: string
  start_time: string
  end_time: string
  created_at: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks')
        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }
        const data = await response.json()
        logger.debug('TasksPage', 'Fetched tasks', data)
        setTasks(data.tasks)
      } catch (error) {
        const errorMessage = 'Failed to load tasks'
        logger.error('TasksPage', errorMessage, { error })
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleAddTask = (task: Omit<Task, "id">) => {
    setTasks([...tasks, { ...task, id: tasks.length + 1 }])
  }

  const handleEditTask = (task: Task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <nav className="flex gap-4">
            <a href="/dashboard" className="text-gray-600">Dashboard</a>
            <a href="/tasks" className="font-semibold">Task list</a>
          </nav>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="grid gap-6">
          {/* Task Creation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskForm />
            </CardContent>
          </Card>

          {/* Task List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading tasks...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : tasks.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No tasks found. Create your first task above!
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span>Status: {task.status}</span>
                              <span>Start: {new Date(task.start_time).toLocaleString()}</span>
                              <span>End: {new Date(task.end_time).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        onSubmit={(task) => {
          if (editingTask) {
            handleEditTask({ ...task, id: editingTask.id })
          } else {
            handleAddTask(task)
          }
          setEditingTask(null)
          setIsDialogOpen(false)
        }}
      />
    </div>
  )
}

