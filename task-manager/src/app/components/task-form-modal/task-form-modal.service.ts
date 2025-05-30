import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CreateTask, Task } from '../../models/task.model';

type TaskModalResult = Task | CreateTask | false;

@Injectable({ providedIn: 'root' })
export class TaskFormModalService {
  data = signal<{ task: Task | null } | null>(null);
  private currentClose$?: Subject<TaskModalResult>;

  open(task: Task | null = null): Observable<TaskModalResult> {
    this.data.set({ task });
    this.currentClose$ = new Subject<TaskModalResult>();
    return this.currentClose$.asObservable();
  }

  close(result: TaskModalResult) {
    this.data.set(null);
    this.currentClose$?.next(result);
    this.currentClose$?.complete();
    this.currentClose$ = undefined;
  }
}
