import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private idCounter = 0;
    toasts = signal<Toast[]>([]);

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 4000): void {
        const id = ++this.idCounter;
        const toast: Toast = { id, message, type };

        this.toasts.update(toasts => [...toasts, toast]);

        setTimeout(() => this.remove(id), duration);
    }

    success(message: string): void {
        this.show(message, 'success');
    }

    error(message: string): void {
        this.show(message, 'error', 5000);
    }

    info(message: string): void {
        this.show(message, 'info');
    }

    warning(message: string): void {
        this.show(message, 'warning');
    }

    remove(id: number): void {
        this.toasts.update(toasts => toasts.filter(t => t.id !== id));
    }
}
