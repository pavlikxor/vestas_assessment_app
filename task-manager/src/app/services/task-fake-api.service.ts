import { Injectable } from "@angular/core";
import { Task } from "../models/task.model";

const TASKS_LOCAL_KEY = 'tasks'

@Injectable({ providedIn: 'root' })
export class TaskApiService {

    getStoredTasks(): Task[] {
        const data = localStorage.getItem(TASKS_LOCAL_KEY);
        return data ? JSON.parse(data) : [];
    }

    saveTasks(tasks: Task[]): void {
        localStorage.setItem(TASKS_LOCAL_KEY, JSON.stringify(tasks));
    }
}