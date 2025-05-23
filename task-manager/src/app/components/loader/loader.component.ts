import { Component, inject } from '@angular/core';
import { TaskStoreService } from '../../services/task-store.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  taskStoreService = inject(TaskStoreService);
}
