import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import TaskList from '@/app/dashboard/tasks/components/task-list';

const mockTasks = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    status: 'pending',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    status: 'in_progress',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

describe('TaskList', () => {
  it('should render task list with pagination', async () => {
    server.use(
      http.get('/api/tasks', () => {
        return HttpResponse.json({
          tasks: mockTasks,
          total: mockTasks.length,
        });
      })
    );

    render(<TaskList />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check if tasks are rendered
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();

    // Check pagination
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('should filter tasks by status', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('/api/tasks', ({ url }) => {
        const status = new URL(url).searchParams.get('status');
        const filteredTasks = status === 'all' 
          ? mockTasks 
          : mockTasks.filter(task => task.status === status);

        return HttpResponse.json({
          tasks: filteredTasks,
          total: filteredTasks.length,
        });
      })
    );

    render(<TaskList />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Filter by status
    await user.click(screen.getByRole('combobox', { name: /filter by status/i }));
    await user.click(screen.getByText(/in progress/i));

    // Check if only in_progress tasks are shown
    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('should search tasks', async () => {
    const user = userEvent.setup();

    server.use(
      http.get('/api/tasks', ({ url }) => {
        const search = new URL(url).searchParams.get('search');
        const filteredTasks = search
          ? mockTasks.filter(task => 
              task.title.toLowerCase().includes(search.toLowerCase()) ||
              task.description.toLowerCase().includes(search.toLowerCase())
            )
          : mockTasks;

        return HttpResponse.json({
          tasks: filteredTasks,
          total: filteredTasks.length,
        });
      })
    );

    render(<TaskList />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Search for task
    await user.type(screen.getByPlaceholderText(/search tasks/i), 'Task 1');

    // Check if only matching tasks are shown
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    server.use(
      http.get('/api/tasks', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<TaskList />);

    expect(await screen.findByText(/failed to load tasks/i)).toBeInTheDocument();
  });

  it('should handle empty task list', async () => {
    server.use(
      http.get('/api/tasks', () => {
        return HttpResponse.json({
          tasks: [],
          total: 0,
        });
      })
    );

    render(<TaskList />);

    expect(await screen.findByText(/no tasks found/i)).toBeInTheDocument();
  });
}); 