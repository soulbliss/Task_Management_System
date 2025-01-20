"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { TaskForm } from '@/components/task-form'
import { logger } from '@/lib/utils/logger'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  start_time: string
  end_time: string
  created_at: string
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        credentials: 'include', // Include cookies for authentication
      })
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

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleEditTask = async (taskId: string) => {
    try {
      router.push(`/tasks/${taskId}/edit`)
    } catch (error) {
      logger.error('TasksPage', 'Error navigating to edit task', { taskId, error })
      toast.error('Failed to open edit page')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      toast.success('Task deleted successfully')
      fetchTasks() // Refresh the task list
    } catch (error) {
      logger.error('TasksPage', 'Error deleting task', { taskId, error })
      toast.error('Failed to delete task')
    }
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Task Creation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm onSuccess={fetchTasks} />
          </CardContent>
        </Card>

        {/* Task List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
          {isLoading ? (
            <div className="text-center py-4">Loading tasks...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No tasks found. Create your first task above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTask(task.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{task.description}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Start:</span> {formatDate(task.start_time)}
                      </div>
                      <div>
                        <span className="font-medium">End:</span> {formatDate(task.end_time)}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-gray-400">
                    Created: {formatDate(task.created_at)}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

