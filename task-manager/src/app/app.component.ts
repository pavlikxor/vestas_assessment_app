import { Component, inject } from '@angular/core';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TaskFormModalComponent } from './components/task-form-modal/task-form-modal.component';
import { TaskFormModalService } from './components/task-form-modal/task-form-modal.service';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskStoreService } from './services/task-store.service';

@Component({
  selector: 'app-root',
  imports: [TaskListComponent, TaskFormModalComponent, ConfirmModalComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Task Manager';

  taskFormModalService = inject(TaskFormModalService)
  taskStoreService = inject(TaskStoreService)

  openCreateModal() {
    this.taskFormModalService.open().subscribe(newTask => {
      if (newTask) {
        this.taskStoreService.addTask(newTask);
      }
    });
  }
}
