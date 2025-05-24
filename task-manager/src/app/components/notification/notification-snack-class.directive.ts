import { Directive, HostBinding, input } from '@angular/core';

@Directive({
    selector: '[notificationSnackClass]',
    standalone: true
})
export class NotificationSnackClassDirective {
    type = input.required<string | undefined>({
        alias: 'notificationSnackClass'
    });

    @HostBinding('class')
    get classList(): string {
        switch (this.type()) {
            case 'success': return 'bg-green-600 text-white';
            case 'info': return 'bg-blue-600 text-white';
            case 'warning': return 'bg-yellow-400 text-black';
            case 'error': return 'bg-red-600 text-white';
            default: return 'bg-gray-600 text-white';
        }
    }
}
