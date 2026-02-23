import { Injectable, signal, effect, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private storageKey = 'toolhub-theme';
    isDarkMode = signal(false);

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            // Load saved theme preference
            const savedTheme = localStorage.getItem(this.storageKey);
            if (savedTheme) {
                this.isDarkMode.set(savedTheme === 'dark');
            } else {
                // Check system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.isDarkMode.set(prefersDark);
            }
        }

        // Apply theme on changes
        effect(() => {
            this.applyTheme(this.isDarkMode());
        });
    }

    toggleTheme(): void {
        this.isDarkMode.update(dark => !dark);
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.storageKey, this.isDarkMode() ? 'dark' : 'light');
        }
    }

    private applyTheme(isDark: boolean): void {
        if (isPlatformBrowser(this.platformId)) {
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }
}
