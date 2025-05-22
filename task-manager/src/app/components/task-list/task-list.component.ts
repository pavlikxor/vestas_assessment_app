import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskStoreService } from '../../services/task-store.service';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';
import { TaskFormModalService } from '../task-form-modal/task-form-modal.service';

@Component({
  selector: 'app-task-list',
  imports: [DatePipe],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit {
  taskStoreService = inject(TaskStoreService)
  private confirmModalService = inject(ConfirmModalService)
  private taskFormModalService = inject(TaskFormModalService)

  ngOnInit(): void {
    this.taskStoreService.loadTasks();
  }

  updateStatus(id: string, newStatus: TaskStatus): void {
    this.taskStoreService.updateTaskStatus({ id, newStatus })
  }

  handleDelete(taskToDelete: Task) {
    this.confirmModalService.open({ message: 'Are you sure you want to delete the task: ' + taskToDelete.name + '?' }).subscribe(isConfirmed => { if (isConfirmed) { this.taskStoreService.deleteTask(taskToDelete.id) } });
  }

  handleEdit(task: Task) {
    this.taskFormModalService.open(task).subscribe(updatedTask => {
      if (updatedTask && 'id' in updatedTask) {
        this.taskStoreService.updateTask(updatedTask);
      }
    }
    );
  }

}
