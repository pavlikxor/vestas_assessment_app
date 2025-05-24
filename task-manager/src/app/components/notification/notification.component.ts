import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { NotificationSnackClassDirective } from './notification-snack-class.directive';
import { NotificationService } from './notification.service';

const DURATION = 3000;

@Component({
    selector: 'app-notification',
    imports: [NotificationSnackClassDirective],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
    notificationService = inject(NotificationService);
    private destroyRef = inject(DestroyRef);

    ngOnInit() {
        for (const msg of this.notificationService.messagesList()) {
            timer(DURATION)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => this.close(msg.index));
        }
    }

    close(index: number) {
        this.notificationService.remove(index);
    }
}
