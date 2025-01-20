import pool from '@/lib/db';
import { Task, TaskCreate, TaskUpdate, TaskStats } from '@/lib/types/task';
import { logger } from '@/lib/utils/logger';

export class TaskService {
  static async createTask(userId: number, task: TaskCreate): Promise<Task> {
    const { title, description, status, start_time, end_time } = task;
    
    // Validate time range
    if (new Date(end_time) <= new Date(start_time)) {
      throw new Error('End time must be after start time');
    }

    try {
      const result = await pool.query(
        `INSERT INTO tasks (user_id, title, description, status, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId, title, description, status, start_time, end_time]
      );

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating task:', error);
      throw error;
    }
  }

  static async getTasks(userId: number, page: number = 1, limit: number = 10): Promise<{ tasks: Task[], total: number }> {
    const offset = (page - 1) * limit;

    const [tasksResult, countResult] = await Promise.all([
      pool.query(
        `SELECT * FROM tasks
         WHERE user_id = $1 AND deleted IS NOT TRUE
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      ),
      pool.query(
        'SELECT COUNT(*) FROM tasks WHERE user_id = $1 AND deleted IS NOT TRUE',
        [userId]
      )
    ]);

    return {
      tasks: tasksResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  static async getTask(taskId: number, userId: number): Promise<Task | null> {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2 AND deleted IS NOT TRUE',
      [taskId, userId]
    );

    return result.rows[0] || null;
  }

  static async updateTask(taskId: number, userId: number, updates: TaskUpdate): Promise<Task | null> {
    // Build dynamic update query
    const validUpdates = ['title', 'description', 'status', 'start_time', 'end_time'];
    const updates_filtered = Object.entries(updates)
      .filter(([key]) => validUpdates.includes(key) && updates[key as keyof TaskUpdate] !== undefined);

    if (updates_filtered.length === 0) {
      throw new Error('No valid updates provided');
    }

    // If updating times, validate the range
    if (updates.start_time || updates.end_time) {
      const task = await this.getTask(taskId, userId);
      if (!task) throw new Error('Task not found');

      const newStartTime = updates.start_time ? new Date(updates.start_time) : new Date(task.start_time);
      const newEndTime = updates.end_time ? new Date(updates.end_time) : new Date(task.end_time);

      if (newEndTime <= newStartTime) {
        throw new Error('End time must be after start time');
      }
    }

    const setClause = updates_filtered
      .map(([key], index) => `${key} = $${index + 3}`)
      .join(', ');
    
    const values = updates_filtered.map(([, value]) => value);

    try {
      const result = await pool.query(
        `UPDATE tasks 
         SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1 AND user_id = $2 AND deleted IS NOT TRUE
         RETURNING *`,
        [taskId, userId, ...values]
      );

      return result.rows[0] || null;
    } catch (error) {
      logger.error('Error updating task:', error);
      throw error;
    }
  }

  static async deleteTask(taskId: number, userId: number): Promise<boolean> {
    const result = await pool.query(
      'UPDATE tasks SET deleted = TRUE WHERE id = $1 AND user_id = $2 AND deleted IS NOT TRUE RETURNING id',
      [taskId, userId]
    );

    return (result.rowCount ?? 0) > 0;
  }

  static async getTaskStats(userId: number): Promise<TaskStats> {
    const result = await pool.query(`
      WITH task_metrics AS (
        SELECT
          COUNT(*) as total_tasks,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks,
          COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tasks,
          AVG(CASE 
            WHEN status = 'completed' 
            THEN EXTRACT(EPOCH FROM (end_time - start_time))
            ELSE NULL 
          END) as avg_completion_time
        FROM tasks
        WHERE user_id = $1 AND deleted IS NOT TRUE
      )
      SELECT
        total_tasks,
        completed_tasks,
        pending_tasks,
        in_progress_tasks,
        COALESCE(avg_completion_time, 0) as average_completion_time
      FROM task_metrics
    `, [userId]);

    return result.rows[0];
  }

  static async getTimeMetrics(taskId: number, userId: number): Promise<{
    total_time: number;
    time_lapsed: number;
    balance_time: number;
  }> {
    const task = await this.getTask(taskId, userId);
    if (!task) throw new Error('Task not found');

    const now = new Date();
    const startTime = new Date(task.start_time);
    const endTime = new Date(task.end_time);

    // Total time to finish (in seconds)
    const totalTime = (endTime.getTime() - startTime.getTime()) / 1000;

    // Time lapsed (in seconds)
    let timeLapsed = 0;
    if (now > startTime) {
      timeLapsed = Math.min(
        (now.getTime() - startTime.getTime()) / 1000,
        totalTime
      );
    }

    // Balance time (in seconds)
    let balanceTime = 0;
    if (now < endTime) {
      balanceTime = (endTime.getTime() - Math.max(now.getTime(), startTime.getTime())) / 1000;
    }

    return {
      total_time: totalTime,
      time_lapsed: timeLapsed,
      balance_time: balanceTime
    };
  }
} 