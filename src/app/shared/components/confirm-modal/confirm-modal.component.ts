import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (confirmService.isOpen()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" (click)="confirmService.respond(false)">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="p-6 pb-4">
            <div class="flex items-center gap-4">
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center"
                [class]="getIconBgClass()">
                <i [class]="getIconClass()" class="text-xl"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ confirmService.options().title }}</h3>
              </div>
            </div>
            <p class="text-gray-600 mt-4">{{ confirmService.options().message }}</p>
          </div>
          
          <!-- Actions -->
          <div class="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
            <button 
              (click)="confirmService.respond(false)"
              class="px-5 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              {{ confirmService.options().cancelText }}
            </button>
            <button 
              (click)="confirmService.respond(true)"
              class="px-5 py-2 rounded-lg font-medium text-white transition-colors"
              [class]="getButtonClass()">
              {{ confirmService.options().confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
    styles: [`
    @keyframes scale-in {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
    .animate-scale-in {
      animation: scale-in 0.2s ease-out;
    }
  `]
})
export class ConfirmModalComponent {
    confirmService = inject(ConfirmService);

    getIconBgClass(): string {
        const type = this.confirmService.options().type;
        const classes: Record<string, string> = {
            danger: 'bg-red-100 text-red-600',
            warning: 'bg-yellow-100 text-yellow-600',
            info: 'bg-blue-100 text-blue-600'
        };
        return classes[type || 'danger'];
    }

    getIconClass(): string {
        const type = this.confirmService.options().type;
        const icons: Record<string, string> = {
            danger: 'fa-solid fa-trash',
            warning: 'fa-solid fa-triangle-exclamation',
            info: 'fa-solid fa-circle-info'
        };
        return icons[type || 'danger'];
    }

    getButtonClass(): string {
        const type = this.confirmService.options().type;
        const classes: Record<string, string> = {
            danger: 'bg-red-500 hover:bg-red-600',
            warning: 'bg-yellow-500 hover:bg-yellow-600',
            info: 'bg-blue-500 hover:bg-blue-600'
        };
        return classes[type || 'danger'];
    }
}
