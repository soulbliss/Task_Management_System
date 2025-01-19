import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { TaskService } from '@/lib/services/taskService';
import { TaskCreate } from '@/lib/types/task';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await TaskService.getTasks(parseInt(session.user.id), page, limit);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.start_time || !body.end_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse dates
    const startTime = new Date(body.start_time);
    const endTime = new Date(body.end_time);

    // Validate date range
    if (endTime <= startTime) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    const task: TaskCreate = {
      title: body.title,
      description: body.description,
      status: body.status || 'pending',
      start_time: startTime,
      end_time: endTime
    };

    const result = await TaskService.createTask(parseInt(session.user.id), task);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 