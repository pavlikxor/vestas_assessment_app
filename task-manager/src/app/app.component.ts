import { Component, DestroyRef, inject } from '@angular/core';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TaskFilterComponent } from './components/task-filter/task-filter.component';
import { TaskFormModalComponent } from './components/task-form-modal/task-form-modal.component';
import { TaskFormModalService } from './components/task-form-modal/task-form-modal.service';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskStoreService } from './services/task-store.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [TaskFilterComponent, TaskListComponent, TaskFormModalComponent, ConfirmModalComponent, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {
  title = 'Task Manager';

  taskFormModalService = inject(TaskFormModalService)
  taskStoreService = inject(TaskStoreService)
  destroyRef = inject(DestroyRef);

  openCreateModal() {
    this.taskFormModalService.open().pipe(
      takeUntilDestroyed(this.destroyRef)).subscribe(newTask => {
        if (newTask) {
          this.taskStoreService.addTask(newTask);
        }
      });
  }
}
