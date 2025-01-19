'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { logger } from '@/lib/utils/logger';

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  averageCompletionTime: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        logger.debug('StatsCards', 'Fetched dashboard stats', data);
        
        // Ensure all required fields are present with default values
        const validatedStats: DashboardStats = {
          totalTasks: data.total_tasks ?? 0,
          completedTasks: data.completed_tasks ?? 0,
          pendingTasks: data.pending_tasks ?? 0,
          inProgressTasks: data.in_progress_tasks ?? 0,
          averageCompletionTime: data.average_completion_time ?? 0
        };
        
        setStats(validatedStats);
      } catch (err) {
        const errorMessage = 'Failed to load statistics';
        logger.error('StatsCards', errorMessage, { error: err });
        setError(errorMessage);
      }
    }

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (!stats) {
    return <StatsCardsSkeleton />;
  }

  const completionRate = stats.totalTasks === 0 ? 0 : 
    Math.round((stats.completedTasks / stats.totalTasks) * 100);

  const cards = [
    {
      title: "Total Tasks",
      value: String(stats.totalTasks || 0),
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
    },
    {
      title: "Active Tasks",
      value: String((stats.pendingTasks || 0) + (stats.inProgressTasks || 0)),
    },
    {
      title: "Avg. Completion Time",
      value: stats.averageCompletionTime ? `${Math.round(stats.averageCompletionTime)}h` : '0h',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 