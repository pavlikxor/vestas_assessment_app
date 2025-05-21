export type TaskStatus = 'Todo' | 'InProgress' | 'Completed';

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
}
