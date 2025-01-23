import { http, HttpResponse } from 'msw';
import { Task } from '@/lib/types/task';

const mockTask: Task = {
  id: '1',
  user_id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  start_time: new Date().toISOString(),
  end_time: new Date(Date.now() + 86400000).toISOString(),
  created_at: new Date().toISOString(),
};

export const handlers = [
  // Auth handlers
  http.post('/api/auth/register', async () => {
    return HttpResponse.json({ success: true });
  }),

  // Task handlers
  http.get('/api/tasks', () => {
    return HttpResponse.json({
      tasks: [mockTask],
      total: 1,
    });
  }),

  http.get('/api/tasks/:id', ({ params }) => {
    return HttpResponse.json({
      ...mockTask,
      id: params.id,
    });
  }),

  http.post('/api/tasks', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({
      ...mockTask,
      ...data,
      id: '2',
    });
  }),

  http.patch('/api/tasks/:id', async ({ params, request }) => {
    const data = await request.json();
    return HttpResponse.json({
      ...mockTask,
      ...data,
      id: params.id,
    });
  }),

  http.delete('/api/tasks/:id', () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Dashboard stats handler
  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json({
      totalTasks: 10,
      completedTasks: 4,
      pendingTasks: 4,
      inProgressTasks: 2,
      averageCompletionTime: 72,
    });
  }),
]; 