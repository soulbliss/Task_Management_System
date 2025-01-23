"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold">Task Management System</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Stay organized, boost productivity, and achieve your goals with our intuitive task management platform.
        </p>
        <div className="space-x-4">
          <Button asChild className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200">
            <Link href="/register">Register</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

