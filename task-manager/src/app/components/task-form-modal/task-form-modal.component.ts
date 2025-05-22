import { Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskStoreService } from '../../services/task-store.service';

@Component({
  selector: 'app-task-form-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.scss'
})
export class TaskFormModalComponent {
  task = input<Task | null>(null)
  closeModal = output<void>();

  nameControl = new FormControl<string | null>(null, Validators.required)
  descriptionControl = new FormControl<string | null>(null)
  taskForm = new FormGroup({
    name: this.nameControl,
    description: this.descriptionControl
  })

  private taskStoreService = inject(TaskStoreService)

  ngOnInit() {
    const currentTask = this.task();

    this.taskForm.reset({ name: currentTask?.name || null, description: currentTask?.description || null });
  }

  save() {
    const task = this.task();
    const formValue = this.taskForm.value;
    const name = formValue.name?.trim()
    if (name) {
      if (task) {
        const updatedTask: Task = {
          ...task,
          name,
          description: formValue.description?.trim()
        };
        this.taskStoreService.updateTask(updatedTask);
      } else {
        const newTask: Task = {
          id: crypto.randomUUID(),
          name,
          description: formValue.description?.trim(),
          status: 'Todo',
          createdAt: new Date().toISOString()
        };
        this.taskStoreService.addTask(newTask);
      }

      this.close();
    }
  }
  close() {
    this.closeModal.emit();
  }
}
