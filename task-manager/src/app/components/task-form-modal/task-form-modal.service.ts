import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Task } from '../../models/task.model';

export type CreateTask = Omit<Task, 'id' | 'createdAt' | 'status'>;
type TaskModalResult = Task | CreateTask | false;

@Injectable({ providedIn: 'root' })
export class TaskFormModalService {
    data$ = new BehaviorSubject<{ task: Task | null } | undefined>(undefined);
    private currentClose$ = new Subject<TaskModalResult>();

    open(task: Task | null = null): Observable<TaskModalResult> {
        this.data$.next({ task });
        return this.currentClose$.asObservable();
    }

    close(result: TaskModalResult) {
        this.data$.next(undefined);
        this.currentClose$.next(result);
        this.currentClose$.complete();
    }

}