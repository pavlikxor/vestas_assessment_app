import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CreateTask, Task } from '../../models/task.model';

type TaskModalResult = Task | CreateTask | false;

@Injectable({ providedIn: 'root' })
export class TaskFormModalService {
    data$ = new BehaviorSubject<{ task: Task | null } | undefined>(undefined);
    private currentClose$?: Subject<TaskModalResult>;

    open(task: Task | null = null): Observable<TaskModalResult> {
        this.data$.next({ task });
        this.currentClose$=new Subject<TaskModalResult>();
        return this.currentClose$.asObservable();
    }

    close(result: TaskModalResult) {
        this.data$.next(undefined);
        this.currentClose$?.next(result);
        this.currentClose$?.complete();
        this.currentClose$ = undefined;
    }

}