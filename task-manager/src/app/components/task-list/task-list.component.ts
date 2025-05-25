import { DatePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Task, TASK_STATUS_LABELS, TaskStatus } from '../../models/task.model';
import { TaskStoreService } from '../../services/task-store.service';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';
import { TaskFormModalService } from '../task-form-modal/task-form-modal.service';

@Component({
  selector: 'app-task-list',
  imports: [DatePipe, NgClass],
  templateUrl: './task-list.component.html',
})

export class TaskListComponent implements OnInit {
  statusLabels = TASK_STATUS_LABELS;
  taskStoreService = inject(TaskStoreService)
  private confirmModalService = inject(ConfirmModalService)
  private taskFormModalService = inject(TaskFormModalService)
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.taskStoreService.loadTasks();
  }

  handleUpdateStatus(id: string, newStatus: TaskStatus): void {
    this.taskStoreService.updateTaskStatus({ id, newStatus })
  }

  handleDelete(taskToDelete: Task) {
    this.confirmModalService.open({ message: 'Are you sure you want to delete the task: ' + taskToDelete.name + '?' }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(isConfirmed => { if (isConfirmed) { this.taskStoreService.deleteTask(taskToDelete.id) } });
  }

  handleEdit(task: Task) {
    this.taskFormModalService.open(task).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(updatedTask => {
      if (updatedTask && 'id' in updatedTask) {
        this.taskStoreService.updateTask(updatedTask);
      }
    }
    );
  }

}
