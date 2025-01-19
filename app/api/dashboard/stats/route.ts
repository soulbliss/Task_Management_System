import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { TaskService } from '@/lib/services/taskService';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await TaskService.getTaskStats(parseInt(session.user.id));
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching task stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 