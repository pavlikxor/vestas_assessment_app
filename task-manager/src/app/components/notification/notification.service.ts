import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationMessage {
    index: number;
    text: string;
    type: NotificationType;
    duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private messages = signal<NotificationMessage[]>([]);
    private counter = 0;

    messagesList = this.messages.asReadonly();

    success(text: string) {
        this.show(text, 'success');
    }

    info(text: string) {
        this.show(text, 'info');
    }

    warning(text: string) {
        this.show(text, 'warning');
    }

    error(text: string) {
        this.show(text, 'error');
    }

    remove(index: number) {
        this.messages.update(msgs => msgs.filter(msg => msg.index !== index));
    }

    private show(text: string, type: NotificationType = 'info', duration = 2500,) {
        const index = ++this.counter;
        this.messages.update(msgs => [...msgs, { index, text, type, duration }]);
        return index;
    }
}
