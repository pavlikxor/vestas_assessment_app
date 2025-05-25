import { Pipe, PipeTransform } from '@angular/core';
import { TASK_STATUS_LABELS, TaskStatus } from '../models/task.model';

@Pipe({
  name: 'taskStatusLabel',
  standalone: true,
})
export class TaskStatusLabelPipe implements PipeTransform {
  transform(status: TaskStatus): string {
    return TASK_STATUS_LABELS[status] || status;
  }
}
