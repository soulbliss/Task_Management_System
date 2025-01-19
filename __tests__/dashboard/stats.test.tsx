import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import StatsCards from '@/app/dashboard/components/stats-cards';
import TaskStatusChart from '@/app/dashboard/components/task-status-chart';

const mockStats = {
  totalTasks: 10,
  completedTasks: 4,
  pendingTasks: 4,
  inProgressTasks: 2,
  averageCompletionTime: 72,
};

describe('Dashboard Statistics', () => {
  describe('StatsCards', () => {
    it('should render stats cards with correct data', async () => {
      server.use(
        http.get('/api/dashboard/stats', () => {
          return HttpResponse.json(mockStats);
        })
      );

      render(<StatsCards />);

      // Wait for stats to load
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Check if stats are rendered correctly
      expect(screen.getByText('10')).toBeInTheDocument(); // Total tasks
      expect(screen.getByText('40%')).toBeInTheDocument(); // Completion rate
      expect(screen.getByText('6')).toBeInTheDocument(); // Active tasks
      expect(screen.getByText('72h')).toBeInTheDocument(); // Average completion time
    });

    it('should handle loading state', () => {
      render(<StatsCards />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
      server.use(
        http.get('/api/dashboard/stats', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(<StatsCards />);
      expect(await screen.findByText(/failed to load statistics/i)).toBeInTheDocument();
    });
  });

  describe('TaskStatusChart', () => {
    it('should render pie chart with correct data', async () => {
      server.use(
        http.get('/api/dashboard/stats', () => {
          return HttpResponse.json(mockStats);
        })
      );

      render(<TaskStatusChart />);

      // Wait for chart to load
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Check if chart segments are rendered
      expect(screen.getByText('40%')).toBeInTheDocument(); // Completed tasks
      expect(screen.getByText('40%')).toBeInTheDocument(); // Pending tasks
      expect(screen.getByText('20%')).toBeInTheDocument(); // In progress tasks
    });

    it('should show empty state when no tasks exist', async () => {
      server.use(
        http.get('/api/dashboard/stats', () => {
          return HttpResponse.json({
            ...mockStats,
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            inProgressTasks: 0,
          });
        })
      );

      render(<TaskStatusChart />);
      expect(await screen.findByText(/no tasks available/i)).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
      server.use(
        http.get('/api/dashboard/stats', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      render(<TaskStatusChart />);
      expect(await screen.findByText(/failed to load statistics/i)).toBeInTheDocument();
    });

    it('should update chart when data changes', async () => {
      const { rerender } = render(<TaskStatusChart />);

      // Initial data
      server.use(
        http.get('/api/dashboard/stats', () => {
          return HttpResponse.json(mockStats);
        })
      );

      await waitFor(() => {
        expect(screen.getByText('40%')).toBeInTheDocument();
      });

      // Updated data
      server.use(
        http.get('/api/dashboard/stats', () => {
          return HttpResponse.json({
            ...mockStats,
            completedTasks: 6,
            pendingTasks: 2,
          });
        })
      );

      rerender(<TaskStatusChart />);

      await waitFor(() => {
        expect(screen.getByText('60%')).toBeInTheDocument(); // New completion rate
      });
    });
  });
}); 