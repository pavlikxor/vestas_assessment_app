import { HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { tapResponse } from '@ngrx/operators';
import { patchState, signalState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { NotificationService } from "../components/notification/notification.service";
import { CreateTask } from "../components/task-form-modal/task-form-modal.service";
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
    private readonly notificationService = inject(NotificationService);
    private readonly state = signalState(initialState);

    readonly tasks = this.state.tasks;
    readonly isLoading = this.state.isLoading;

    loadTasks = rxMethod<void>(
        pipe(
            tap(() => patchState(this.state, { isLoading: true })),
            exhaustMap(() => this.taskApiService.getTasks().pipe(
                tapResponse({
                    next: (tasks) => patchState(this.state, { tasks }),
                    error: (err: HttpErrorResponse) => {
                        this.notificationService.error(
                            'Failed to load tasks: ' + (err?.message || err?.error || err)
                        );
                    },
                    finalize: () => {
                        patchState(this.state, { isLoading: false });
                        this.notificationService.success('Tasks loaded successfully');
                    },
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
                        error: (err: HttpErrorResponse) => {
                            this.notificationService.error(
                                `Failed to update task "${updatedTask.name}": ` + (err?.message || err?.error || err)
                            );
                        },
                        finalize: () => {
                            patchState(this.state, { isLoading: false });
                            this.notificationService.success(`Task "${updatedTask.name}" updated successfully`);
                        },
                    })
                )
            )
        )
    );

    updateTaskStatus = rxMethod<{ id: string, newStatus: Task['status'] }>(
        pipe(
            tap(() => patchState(this.state, { isLoading: true })),
            exhaustMap(({ id, newStatus }) => {
                const task = this.state.tasks().find(t => t.id === id);
                return this.taskApiService.saveTasks(
                    this.state.tasks().map(t => t.id === id ? { ...t, status: newStatus } : t)
                ).pipe(
                    tapResponse({
                        next: () => {
                            const updatedTasks = this.state.tasks().map(t => t.id === id ? { ...t, status: newStatus } : t);
                            patchState(this.state, { tasks: updatedTasks });
                        },
                        error: (err: HttpErrorResponse) => {
                            this.notificationService.error(
                                `Failed to update status for task "${task?.name ?? id}": ` + (err?.message || err?.error || err)
                            );
                        },
                        finalize: () => {
                            patchState(this.state, { isLoading: false });
                            this.notificationService.success(`Task "${task?.name ?? id}" status updated successfully`);
                        },
                    })
                )
            })
        )
    );

    addTask = rxMethod<CreateTask>(
        pipe(
            tap(() => patchState(this.state, { isLoading: true })),
            exhaustMap((newTask) => {
                const task: Task = {
                    ...newTask,
                    // FE should not be responsible for generating IDs, setting the createdAt and status while creating new Task
                    id: crypto.randomUUID(),
                    createdAt: new Date().toISOString(),
                    status: 'Todo',
                };
                return this.taskApiService.saveTasks([...this.state.tasks(), task]).pipe(
                    tapResponse({
                        next: () => {
                            const updatedTasks = [...this.state.tasks(), task];
                            patchState(this.state, { tasks: updatedTasks });
                        },
                        error: (err: HttpErrorResponse) => {
                            this.notificationService.error(
                                `Failed to add task "${newTask.name}": ` + (err?.message || err?.error || err)
                            );
                        },
                        finalize: () => {
                            patchState(this.state, { isLoading: false });
                            this.notificationService.success(`Task "${newTask.name}" added successfully`);
                        },
                    })
                )
            }
            )
        )
    );

    deleteTask = rxMethod<string>(
        pipe(
            tap(() => patchState(this.state, { isLoading: true })),
            exhaustMap((id) => {
                const task = this.state.tasks().find(t => t.id === id);
                return this.taskApiService.saveTasks(this.state.tasks().filter(t => t.id !== id)).pipe(
                    tapResponse({
                        next: () => {
                            const updatedTasks = this.state.tasks().filter(t => t.id !== id);
                            patchState(this.state, { tasks: updatedTasks });
                        },
                        error: (err: HttpErrorResponse) => {
                            this.notificationService.error(
                                `Failed to delete task "${task?.name ?? id}": ` + (err?.message || err?.error || err)
                            );
                        },
                        finalize: () => {
                            patchState(this.state, { isLoading: false });
                            this.notificationService.success(`Task "${task?.name ?? id}" deleted successfully`);
                        },
                    })
                )
            })
        )
    );
}
