import { NgClass } from '@angular/common';
import { Component, DestroyRef, effect, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { NotificationService } from './notification.service';

const DURATION = 3000;

@Component({
    selector: 'app-notification',
    imports: [NgClass],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
    notificationService = inject(NotificationService);
    private destroyRef = inject(DestroyRef);

    constructor() {
        effect(() => {
            for (const msg of this.notificationService.messagesList()) {
                timer(DURATION)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe(() => this.close(msg.index));
            }
        });
    }

    close(index: number) {
        this.notificationService.remove(index);
    }
}
