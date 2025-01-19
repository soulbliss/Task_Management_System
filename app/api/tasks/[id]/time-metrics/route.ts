import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { TaskService } from '@/lib/services/taskService';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession();
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