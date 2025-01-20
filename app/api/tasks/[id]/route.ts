import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { auth } from '@/lib/auth';
import { TaskService } from '@/lib/services/taskService';
import { TaskUpdate } from '@/lib/types/task';
import { logger } from '@/lib/utils/logger';
import { getUserByEmail } from '@/lib/services/userService';
import type { Session } from 'next-auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(auth) as Session | null;
    
    if (!session?.user?.email) {
      logger.warn('GET /api/tasks/[id]', 'Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      logger.error('GET /api/tasks/[id]', 'User not found', { email: session.user.email });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const taskId = parseInt(params.id, 10);
    if (isNaN(taskId)) {
      logger.warn('GET /api/tasks/[id]', 'Invalid task ID', { taskId: params.id });
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    logger.debug('GET /api/tasks/[id]', 'Fetching task', { taskId });
    const task = await TaskService.getTask(taskId, user.id);

    if (!task) {
      logger.warn('GET /api/tasks/[id]', 'Task not found', { taskId });
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    logger.debug('GET /api/tasks/[id]', 'Task fetched successfully', { taskId });
    return NextResponse.json(task);
  } catch (error) {
    logger.error('GET /api/tasks/[id]', 'Error fetching task', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(auth) as Session | null;
    
    if (!session?.user?.email) {
      logger.warn('PATCH /api/tasks/[id]', 'Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      logger.error('PATCH /api/tasks/[id]', 'User not found', { email: session.user.email });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const taskId = parseInt(params.id, 10);
    if (isNaN(taskId)) {
      logger.warn('PATCH /api/tasks/[id]', 'Invalid task ID', { taskId: params.id });
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const updates: TaskUpdate = await req.json();
    logger.debug('PATCH /api/tasks/[id]', 'Updating task', { taskId, updates });
    
    const task = await TaskService.updateTask(taskId, user.id, updates);

    if (!task) {
      logger.warn('PATCH /api/tasks/[id]', 'Task not found', { taskId });
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    logger.debug('PATCH /api/tasks/[id]', 'Task updated successfully', { taskId });
    return NextResponse.json(task);
  } catch (error) {
    logger.error('PATCH /api/tasks/[id]', 'Error updating task', { error });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(auth) as Session | null;
    
    if (!session?.user?.email) {
      logger.warn('DELETE /api/tasks/[id]', 'Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      logger.error('DELETE /api/tasks/[id]', 'User not found', { email: session.user.email });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const taskId = parseInt(params.id, 10);
    if (isNaN(taskId)) {
      logger.warn('DELETE /api/tasks/[id]', 'Invalid task ID', { taskId: params.id });
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    logger.debug('DELETE /api/tasks/[id]', 'Deleting task', { taskId });
    const deleted = await TaskService.deleteTask(taskId, user.id);

    if (!deleted) {
      logger.warn('DELETE /api/tasks/[id]', 'Task not found', { taskId });
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    logger.debug('DELETE /api/tasks/[id]', 'Task deleted successfully', { taskId });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error('DELETE /api/tasks/[id]', 'Error deleting task', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 