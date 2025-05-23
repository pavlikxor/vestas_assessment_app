import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { CreateTask, TaskFormModalService } from './task-form-modal.service';

@Component({
  selector: 'app-task-form-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form-modal.component.html',
})

export class TaskFormModalComponent implements OnInit {
  isOpen = signal(false);
  task = signal<Task | null>(null);
  nameControl = new FormControl<string | null>(null, Validators.required)
  descriptionControl = new FormControl<string | null>(null)
  taskForm = new FormGroup({
    name: this.nameControl,
    description: this.descriptionControl
  })

  private taskFormModalService = inject(TaskFormModalService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.taskFormModalService.data$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((data) => {
      this.isOpen.set(!!data);
      if (data?.task) {
        this.task.set(data.task);
        this.taskForm.reset({ name: data.task.name, description: data.task.description || null });
      }
    });
  }


  onSave() {
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
        this.taskFormModalService.close(updatedTask);
      } else {
        const newTask: CreateTask = {
          name,
          description: formValue.description?.trim(),
        };
        this.taskFormModalService.close(newTask);
      }
      this.resetModal()
    }
  }

  onCancel() {
    this.taskFormModalService.close(false);
    this.resetModal()
  }

  private resetModal() {
    this.isOpen.set(false);
    this.taskForm.reset();
    this.task.set(null);
  }
}
