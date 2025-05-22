import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { Task } from "../models/task.model";

const TASKS_LOCAL_KEY = 'tasks'

@Injectable({ providedIn: 'root' })
export class TaskApiService {

    getTasks(): Observable<Task[]> {
        const data = localStorage.getItem(TASKS_LOCAL_KEY);
        return of(data ? JSON.parse(data) : []).pipe(delay(300));
    }

    saveTasks(tasks: Task[]): Observable<void> {
        return of(localStorage.setItem(TASKS_LOCAL_KEY, JSON.stringify(tasks))).pipe(delay(300));;
    }
}