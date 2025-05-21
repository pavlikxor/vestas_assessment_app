import { Component } from '@angular/core';
import { TaskFormModalComponent } from './components/task-form-modal/task-form-modal.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  imports: [TaskListComponent, TaskFormModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Task Manager';

  showAddTaskModal = false;

  openCreateModal() {
    this.showAddTaskModal = true;
  }

  closeAddModal() {
    this.showAddTaskModal = false;
  }
}
