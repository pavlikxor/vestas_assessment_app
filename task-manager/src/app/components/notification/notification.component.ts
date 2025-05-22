import { NgClass } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { NotificationMessage, NotificationService } from './notification.service';

@Component({
    selector: 'app-notification',
    imports: [NgClass],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
    private notificationService = inject(NotificationService);

    snacks: Omit<NotificationMessage, 'duration'>[] = [];
    private timeouts = new Map<number, any>();

    constructor() {
        effect(() => {
            const messages = this.notificationService.messagesList();
            this.snacks = messages.map(msg => ({
                index: msg.index,
                text: msg.text,
                type: msg.type
            }));
            for (const msg of messages) {
                if (!this.timeouts.has(msg.index)) {
                    const timeoutId = setTimeout(() => this.close(msg.index), msg.duration ?? 2500);
                    this.timeouts.set(msg.index, timeoutId);
                }
            }
        });
    }

    close(index: number) {
        this.notificationService.remove(index);
        const timeoutId = this.timeouts.get(index);
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.timeouts.delete(index);
        }
    }
}
