import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface ConfirmModalData {
    message: string;
    confirmText?: string;
    cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmModalService {
    modalRequest$ = new Subject<ConfirmModalData>
    isOpen$ = new BehaviorSubject<boolean>(false)
    closeResult$ = new Subject<boolean>()

    open(data: ConfirmModalData): Observable<boolean> {
        this.isOpen$.next(true)
        this.modalRequest$.next(data);
        return this.closeResult$.asObservable();
    }

    close(result: boolean) {
        this.closeResult$.next(result)
    }
}