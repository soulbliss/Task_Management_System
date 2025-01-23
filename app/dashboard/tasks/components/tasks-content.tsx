'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TaskList from './task-list';
import TaskFilters from './task-filters';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

function CreateTaskButton() {
  return (
    <Button asChild>
      <Link href="/dashboard/tasks/create">
        <PlusIcon className="h-4 w-4 mr-2" />
        Create Task
      </Link>
    </Button>
  );
}

function TasksContentInner() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'all';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <CreateTaskButton />
      </div>
      <TaskFilters activeStatus={status} />
      <TaskList status={status} />
    </div>
  );
}

export function TasksContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TasksContentInner />
    </Suspense>
  );
} 