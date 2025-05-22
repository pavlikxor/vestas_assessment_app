import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskStoreService } from '../../services/task-store.service';
import { TaskDeleteModalComponent } from '../confirm-modal/confirm-modal.component';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-task-list',
  imports: [TaskDeleteModalComponent, TaskFormModalComponent, DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit{

  ngOnInit(): void {
    this.taskStoreService.loadTasks();
  }


  taskStoreService = inject(TaskStoreService)

  showConfirm = false;
  taskToDelete: Task | null = null;
  showTaskModal = false;
  taskBeingEdited: Task | null = null;

  confirmDelete(task: Task) {
    this.taskToDelete = task;
    this.showConfirm = true;
  }

  handleDelete() {
    // if (this.taskToDelete) {
    //   this.taskStoreService.deleteTask(this.taskToDelete.id);
    // }
    // this.closeConfirmModal();
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
