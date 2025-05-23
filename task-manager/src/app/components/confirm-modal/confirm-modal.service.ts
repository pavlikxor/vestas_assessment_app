import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmModalData {
    message: string;
    confirmText?: string;
    cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmModalService {
    data = signal<ConfirmModalData | null>(null);
    private currentClose$?: Subject<boolean>;

    open(data: ConfirmModalData): Observable<boolean> {
        this.data.set(data);
        this.currentClose$ = new Subject<boolean>();
        return this.currentClose$.asObservable();
    }

    close(result: boolean) {
        this.data.set(null);
        this.currentClose$?.next(result);
        this.currentClose$?.complete();
        this.currentClose$ = undefined;
    }
}