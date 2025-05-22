import { inject, Injectable } from "@angular/core";
import { tapResponse } from '@ngrx/operators';
import { patchState, signalState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { Task } from "../models/task.model";
import { TaskApiService } from "./task-fake-api.service";

type TasksState = { tasks: Task[]; isLoading: boolean };

const initialState: TasksState = {
    tasks: [],
    isLoading: false,
};

@Injectable({ providedIn: 'root' })
export class TaskStoreService {
    private readonly taskApiService = inject(TaskApiService);
    private readonly state = signalState(initialState);

    readonly tasks = this.state.tasks;
    readonly isLoading = this.state.isLoading;

    loadTasks = rxMethod<void>(
        pipe(
            tap(() => patchState(this.state, { isLoading: true })),
            exhaustMap(() => this.taskApiService.getTasks().pipe(
                tapResponse({
                    next: (tasks) => patchState(this.state, { tasks }),
                    error: console.error,
                    finalize: () => patchState(this.state, { isLoading: false }),
                })
            )
            )
        )
    );

    updateTask = rxMethod<Task>(
        pipe(
            tap(() => patchState(this.state, { isLoading: true })),
            exhaustMap((updatedTask) =>
                this.taskApiService.saveTasks(
                    this.state.tasks().map(t => t.id === updatedTask.id ? updatedTask : t)
                ).pipe(
                    tapResponse({
                        next: () => {
                            const updatedTasks = this.state.tasks().map(t => t.id === updatedTask.id ? updatedTask : t);
                            patchState(this.state, { tasks: updatedTasks });
                        },
                        error: console.error,
                        finalize: () => patchState(this.state, { isLoading: false }),
                    })
                )
            )
        )
    );

    updateTaskStatus = rxMethod<{ id: string, newStatus: Task['status'] }>(
        pipe(
            tap(() => patchState(this.state, { isLoading: true })),
            exhaustMap(({ id, newStatus }) =>
                this.taskApiService.saveTasks(
                    this.state.tasks().map(t => t.id === id ? { ...t, status: newStatus } : t)
                ).pipe(
                    tapResponse({
                        next: () => {
                            const updatedTasks = this.state.tasks().map(t => t.id === id ? { ...t, status: newStatus } : t);
                            patchState(this.state, { tasks: updatedTasks });
                        },
                        error: console.error,
                        finalize: () => patchState(this.state, { isLoading: false }),
                    })
                )
            )
        )
    );

    addTask = rxMethod<Task>(
        pipe(
            tap(() => patchState(this.state, { isLoading: true })),
            exhaustMap((task) =>
                this.taskApiService.saveTasks([...this.state.tasks(), task]).pipe(
                    tapResponse({
                        next: () => {
                            const updatedTasks = [...this.state.tasks(), task];
                            patchState(this.state, { tasks: updatedTasks });
                        },
                        error: console.error,
                        finalize: () => patchState(this.state, { isLoading: false }),
                    })
                )
            )
        )
    );

    deleteTask = rxMethod<string>(
        pipe(
            tap(() => patchState(this.state, { isLoading: true })),
            exhaustMap((id) =>
                this.taskApiService.saveTasks(this.state.tasks().filter(t => t.id !== id)).pipe(
                    tapResponse({
                        next: () => {
                            const updatedTasks = this.state.tasks().filter(t => t.id !== id);
                            patchState(this.state, { tasks: updatedTasks });
                        },
                        error: console.error,
                        finalize: () => patchState(this.state, { isLoading: false }),
                    })
                )
            )
        )
    );
}

// export const taskStore = signalStore(
//   { providedIn: 'root' },
//   withState(() => {
//     const taskApiService = inject(TaskApiService);
//     return {
//       tasks: taskApiService.getStoredTasks() as Task[],
//       filter: '',
//     };
//   }),
//   withMethods(state => {
//     const taskApiService = inject(TaskApiService);

//     return {
//       setFilter(filter: string) {
//         state.filter.set(filter);
//       },
//       addTask(task: Task) {
//         const updated = [...state.tasks(), task];
//         taskApiService.saveTasks(updated);
//         state.tasks.set(updated);
//       },
//       deleteTask(id: string) {
//         const updated = state.tasks().filter(t => t.id !== id);
//         taskApiService.saveTasks(updated);
//         state.tasks.set(updated);
//       },
//       updateTask(updatedTask: Task) {
//         const updated = state.tasks().map(t => t.id === updatedTask.id ? updatedTask : t);
//         taskApiService.saveTasks(updated);
//         state.tasks.set(updated);
//       },
//       updateStatus(id: string, newStatus: Task['status']) {
//         const updated = state.tasks().map(t => t.id === id ? { ...t, status: newStatus } : t);
//         taskApiService.saveTasks(updated);
//         state.tasks.set(updated);
//       },
//       filteredTasks() {
//         const filter = state.filter().toLowerCase();
//         return state.tasks().filter(task =>
//           task.name.toLowerCase().includes(filter) || task.status.toLowerCase().includes(filter)
//         );
//       },
//       tasks: () => state.tasks(),
//       filter: () => state.filter()
//     };
//   })
// );


// @Injectable({ providedIn: 'root' })
// export class TaskStoreService {
//     private taskApiService = inject(TaskApiService)
//     private tasks = signal<Task[]>(this.taskApiService.getStoredTasks());
//     private filter = signal<string>('');

//     getTasks(): Task[] {
//         return this.tasks();
//     }

//     getFilter(): string {
//         return this.filter();
//     }

//     setFilter(value: string): void {
//         this.filter.set(value);
//     }

//     filteredTasks(): Task[] {
//         const filter = this.filter().toLowerCase();
//         return this.tasks().filter(task =>
//             task.name.toLowerCase().includes(filter) || task.status.toLowerCase().includes(filter)
//         );
//     }

//     addTask(task: Task): void {
//         const updated = [...this.tasks(), task];
//         this.taskApiService.saveTasks(updated);
//         this.tasks.set(updated);
//     }

//     deleteTask(id: string): void {
//         const updated = this.tasks().filter(t => t.id !== id);
//         this.taskApiService.saveTasks(updated);
//         this.tasks.set(updated);
//     }

//     updateTask(updated: Task) {
//         const newList = this.tasks().map(t => t.id === updated.id ? updated : t);
//         this.taskApiService.saveTasks(newList);
//         this.tasks.set(newList);
//     }

//     updateStatus(id: string, newStatus: Task['status']): void {
//         const updated = this.tasks().map(t => t.id === id ? { ...t, status: newStatus } : t);
//         this.taskApiService.saveTasks(updated);
//         this.tasks.set(updated);
//     }
// }
