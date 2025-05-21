import { inject, Injectable, signal } from "@angular/core";
import { Task } from "../models/task.model";
import { TaskApiService } from "./task-fake-api.service";

@Injectable({ providedIn: 'root' })
export class TaskStoreService {
    private taskApiService = inject(TaskApiService)
    private tasks = signal<Task[]>(this.taskApiService.getStoredTasks());
    private filter = signal<string>('');

    getTasks(): Task[] {
        return this.tasks();
    }

    getFilter(): string {
        return this.filter();
    }

    setFilter(value: string): void {
        this.filter.set(value);
    }

    filteredTasks(): Task[] {
        const filter = this.filter().toLowerCase();
        return this.tasks().filter(task =>
            task.name.toLowerCase().includes(filter) || task.status.toLowerCase().includes(filter)
        );
    }

    addTask(task: Task): void {
        const updated = [...this.tasks(), task];
        this.taskApiService.saveTasks(updated);
        this.tasks.set(updated);
    }

    deleteTask(id: string): void {
        const updated = this.tasks().filter(t => t.id !== id);
        this.taskApiService.saveTasks(updated);
        this.tasks.set(updated);
    }

    updateTask(updated: Task) {
        const newList = this.tasks().map(t => t.id === updated.id ? updated : t);
        this.taskApiService.saveTasks(newList);
        this.tasks.set(newList);
    }

    updateStatus(id: string, newStatus: Task['status']): void {
        const updated = this.tasks().map(t => t.id === id ? { ...t, status: newStatus } : t);
        this.taskApiService.saveTasks(updated);
        this.tasks.set(updated);
    }
}
