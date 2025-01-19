'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TaskStatus } from '@/lib/types/task';

const statusOptions: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
];

export default function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex gap-4 items-center">
      <div className="w-[250px]">
        <Select
          defaultValue={searchParams.get('status') || 'all'}
          onValueChange={(value) => {
            router.push(`?${createQueryString('status', value)}`);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Input
        placeholder="Search tasks..."
        className="max-w-sm"
        defaultValue={searchParams.get('search') || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            router.push(`?${createQueryString('search', value)}`);
          } else {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('search');
            router.push(params.toString() ? `?${params.toString()}` : '');
          }
        }}
      />
    </div>
  );
} 