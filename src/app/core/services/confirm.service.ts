import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

@Injectable({
    providedIn: 'root'
})
export class ConfirmService {
    private confirmSubject = new Subject<boolean>();

    isOpen = signal(false);
    options = signal<ConfirmOptions>({
        title: 'Confirm',
        message: 'Are you sure?'
    });

    confirm(options: ConfirmOptions): Promise<boolean> {
        this.options.set({
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            type: 'danger',
            ...options
        });
        this.isOpen.set(true);

        return new Promise((resolve) => {
            const subscription = this.confirmSubject.subscribe((result) => {
                subscription.unsubscribe();
                resolve(result);
            });
        });
    }

    respond(confirmed: boolean): void {
        this.isOpen.set(false);
        this.confirmSubject.next(confirmed);
    }
}
