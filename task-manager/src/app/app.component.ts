import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NotificationComponent } from './components/notification/notification.component';
import { TaskFilterComponent } from './components/task-filter/task-filter.component';
import { TaskFormModalComponent } from './components/task-form-modal/task-form-modal.component';
import { TaskFormModalService } from './components/task-form-modal/task-form-modal.service';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskStoreService } from './services/task-store.service';

@Component({
  selector: 'app-root',
  imports: [
    TaskFilterComponent,
    TaskListComponent,
    TaskFormModalComponent,
    ConfirmModalComponent,
    LoaderComponent,
    NotificationComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Task Manager';

  private taskFormModalService = inject(TaskFormModalService);
  private taskStoreService = inject(TaskStoreService);
  private destroyRef = inject(DestroyRef);

  openCreateModal() {
    this.taskFormModalService
      .open()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newTask => {
        if (newTask) {
          this.taskStoreService.addTask(newTask);
        }
      });
  }
}
