import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { auth } from '@/lib/auth';
import { TaskService } from '@/lib/services/taskService';
import type { Session } from 'next-auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(auth) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = parseInt(params.id);
    const metrics = await TaskService.getTimeMetrics(taskId, parseInt(session.user.id));

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching time metrics:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 