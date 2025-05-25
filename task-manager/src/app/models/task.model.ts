export type TaskStatus = 'Todo' | 'InProgress' | 'Completed';

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
}

export type CreateTask = Omit<Task, 'id' | 'createdAt' | 'status'>;

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    'Todo': 'Todo',
    'InProgress': 'In progress',
    'Completed': 'Completed'
};
