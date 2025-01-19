export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at?: string;
  deleted?: boolean;
}

export interface TaskCreate {
  title: string;
  description: string;
  status: TaskStatus;
  start_time: Date;
  end_time: Date;
}

export interface TaskUpdate extends Partial<TaskCreate> {
  status?: TaskStatus;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  averageCompletionTime: number;
} 