'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle, Clock, BarChart } from 'lucide-react';
import { logger } from '@/lib/utils/logger';

interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  averageCompletionTime: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        logger.debug('StatsCards', 'Fetched stats', data);
        
        // Ensure all values are numbers and not null/undefined
        const sanitizedData = {
          totalTasks: parseInt(data.total_tasks) || 0,
          completedTasks: parseInt(data.completed_tasks) || 0,
          pendingTasks: parseInt(data.pending_tasks) || 0,
          inProgressTasks: parseInt(data.in_progress_tasks) || 0,
          averageCompletionTime: Number(data.average_completion_time) || 0
        };
        
        setStats(sanitizedData);
      } catch (err) {
        logger.error('StatsCards', 'Error fetching stats', { error: err });
        setError('Failed to load statistics');
      }
    }

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">{error}</div>
    );
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 card-header">
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

  const calculatePercentage = (value: number) => {
    if (!stats || !value || stats.totalTasks === 0) return 0;
    return Math.round((value / stats.totalTasks) * 100);
  };

  const cards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: ClipboardList,
      color: "text-blue-600",
    },
    {
      title: "Completed",
      value: stats.completedTasks,
      percentage: calculatePercentage(stats.completedTasks),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: stats.inProgressTasks,
      percentage: calculatePercentage(stats.inProgressTasks),
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Pending",
      value: stats.pendingTasks,
      percentage: calculatePercentage(stats.pendingTasks),
      icon: BarChart,
      color: "text-yellow-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 card-header">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            {'percentage' in card && (
              <p className="text-xs text-muted-foreground">
                {card.percentage}% of total tasks
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 