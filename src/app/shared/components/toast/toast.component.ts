import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in"
          [class]="getToastClass(toast.type)"
        >
          <i [class]="getIconClass(toast.type)"></i>
          <span class="flex-1 text-sm font-medium">{{ toast.message }}</span>
          <button (click)="toastService.remove(toast.id)" class="opacity-70 hover:opacity-100">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
    toastService = inject(ToastService);

    getToastClass(type: string): string {
        const classes: Record<string, string> = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            info: 'bg-blue-500 text-white',
            warning: 'bg-yellow-500 text-white'
        };
        return classes[type] || classes['info'];
    }

    getIconClass(type: string): string {
        const icons: Record<string, string> = {
            success: 'fa-solid fa-circle-check',
            error: 'fa-solid fa-circle-xmark',
            info: 'fa-solid fa-circle-info',
            warning: 'fa-solid fa-triangle-exclamation'
        };
        return icons[type] || icons['info'];
    }
}
