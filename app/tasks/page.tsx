"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

interface Task {
  id: number
  title: string
  status: "pending" | "finished"
  priority: number
  startTime: Date
  endTime: Date
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Buy clothes",
      status: "pending",
      priority: 5,
      startTime: new Date("2024-11-26T11:00"),
      endTime: new Date("2024-11-30T11:00"),
    },
    {
      id: 2,
      title: "Finish code",
      status: "finished",
      priority: 2,
      startTime: new Date("2024-11-25T09:05"),
      endTime: new Date("2024-11-25T15:15"),
    },
    // Add more sample tasks as needed
  ])

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Task list</h1>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Start time: ASC</DropdownMenuItem>
                <DropdownMenuItem>Start time: DESC</DropdownMenuItem>
                <DropdownMenuItem>End time: ASC</DropdownMenuItem>
                <DropdownMenuItem>End time: DESC</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsDialogOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600">{task.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={task.status === "pending" ? "secondary" : "default"}>
                        {task.status}
                      </Badge>
                      <Badge variant="outline">Priority: {task.priority}</Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-500">Start</div>
                      <div>{format(task.startTime, "dd-MMM-yy HH:mm")}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-500">End</div>
                      <div>{format(task.endTime, "dd-MMM-yy HH:mm")}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingTask(task)
                        setIsDialogOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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

