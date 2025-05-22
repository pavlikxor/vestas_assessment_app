import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, delay, distinctUntilChanged } from 'rxjs';
import { TaskStoreService } from '../../services/task-store.service';

@Component({
    selector: 'app-task-filter',
    imports: [ReactiveFormsModule],
    templateUrl: './task-filter.component.html',
})
export class TaskFilterComponent implements OnInit {

    private taskStoreService = inject(TaskStoreService);
    private destroyRef = inject(DestroyRef);
    filterControl = new FormControl<string | null>(null);

    ngOnInit(): void {
        this.filterControl.valueChanges
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                distinctUntilChanged(),
                debounceTime(500)
            )
            .subscribe((value) =>
                this.taskStoreService.loadTasks(value?.trim() || '')
            );
    }
}
