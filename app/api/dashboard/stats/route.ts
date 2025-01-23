import { getServerSession } from "next-auth/next"
import { auth } from "@/lib/auth"
import { TaskService } from "@/lib/services/taskService"
import { NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/services/userService"
import type { Session } from "next-auth"

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(auth) as Session | null

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    const stats = await TaskService.getTaskStats(user.id)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 