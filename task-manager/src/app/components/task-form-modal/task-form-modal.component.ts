import { Component, effect, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateTask, Task } from '../../models/task.model';
import { TaskFormModalService } from './task-form-modal.service';

@Component({
  selector: 'app-task-form-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form-modal.component.html',
})
export class TaskFormModalComponent {
  isOpen = signal(false);
  task = signal<Task | null>(null);
  nameControl = new FormControl<string | null>(null, Validators.required);
  descriptionControl = new FormControl<string | null>(null);
  taskForm = new FormGroup({
    name: this.nameControl,
    description: this.descriptionControl,
  });

  private taskFormModalService = inject(TaskFormModalService);

  constructor() {
    effect(() => {
      this.isOpen.set(!!this.taskFormModalService.data());
      this.task.set(this.taskFormModalService.data()?.task ?? null);
      this.taskForm.reset({
        name: this.task()?.name ?? null,
        description: this.task()?.description ?? null,
      });
    });
  }

  onSave() {
    const task = this.task();
    const formValue = this.taskForm.value;
    const name = formValue.name?.trim();
    if (name) {
      if (task) {
        const updatedTask: Task = {
          ...task,
          name,
          description: formValue.description?.trim(),
        };
        this.taskFormModalService.close(updatedTask);
      } else {
        const newTask: CreateTask = {
          name,
          description: formValue.description?.trim(),
        };
        this.taskFormModalService.close(newTask);
      }
      this.resetModal();
    }
  }

  onCancel() {
    this.taskFormModalService.close(false);
    this.resetModal();
  }

  private resetModal() {
    this.isOpen.set(false);
    this.taskForm.reset();
    this.task.set(null);
  }
}
