import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';
import { TaskStoreService } from '../../services/task-store.service';
import { ConfirmModalService } from '../confirm-modal/confirm-modal.service';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-task-list',
  imports: [TaskFormModalComponent, DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  taskStoreService = inject(TaskStoreService)
  confirmModalService = inject(ConfirmModalService)
  ngOnInit(): void {
    this.taskStoreService.loadTasks();
  }

  showConfirm = false;
  taskToDelete: Task | null = null;
  showTaskModal = false;
  taskBeingEdited: Task | null = null;

  updateStatus(id: string, newStatus: TaskStatus): void {
    this.taskStoreService.updateTaskStatus({ id, newStatus })
  }

  confirmDelete(task: Task) {
    this.taskToDelete = task;
    this.showConfirm = true;
  }

  handleDelete(taskToDelete: Task) {
    this.confirmModalService.open({ message: 'Are you sure you want to delete the task: ' + taskToDelete.name + '?' }).subscribe()
  }

  closeConfirmModal() {
    this.showConfirm = false;
    this.taskToDelete = null;
  }

  openTaskModal(task: Task | null = null) {
    this.taskBeingEdited = task;
    this.showTaskModal = true;
  }

  closeTaskModal() {
    this.taskBeingEdited = null;
    this.showTaskModal = false;
  }
}
