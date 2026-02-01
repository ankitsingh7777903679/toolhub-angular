import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private storageKey = 'toolhub-theme';
    isDarkMode = signal(false);

    constructor() {
        // Load saved theme preference
        const savedTheme = localStorage.getItem(this.storageKey);
        if (savedTheme) {
            this.isDarkMode.set(savedTheme === 'dark');
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDarkMode.set(prefersDark);
        }

        // Apply theme on changes
        effect(() => {
            this.applyTheme(this.isDarkMode());
        });
    }

    toggleTheme(): void {
        this.isDarkMode.update(dark => !dark);
        localStorage.setItem(this.storageKey, this.isDarkMode() ? 'dark' : 'light');
    }

    private applyTheme(isDark: boolean): void {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}
