import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <nav class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-14 md:h-16">
          <a routerLink="/" class="flex items-center gap-2">
            <img src="assets/logo.webp" alt="2olhub" class="h-16 md:h-24 w-auto object-contain" fetchpriority="high" height="64" width="200">
          </a>

          <div *ngIf="!isAdminRoute()" class="hidden lg:flex items-center gap-8">
            <a routerLink="/pdf" class="text-gray-700 hover:text-blue-500 font-medium">PDF</a>
            <a routerLink="/image" class="text-gray-700 hover:text-blue-500 font-medium">Image</a>
            <a routerLink="/file" class="text-gray-700 hover:text-blue-500 font-medium">File</a>
            <a routerLink="/write" class="text-gray-700 hover:text-blue-500 font-medium">AI Write</a>
            <a routerLink="/feedback" class="text-gray-700 hover:text-blue-500 font-medium">Feedback</a>
          </div>

          <div class="flex items-center gap-3 md:gap-4">
            <!-- Dark Mode Toggle -->
            <button 
              (click)="themeService.toggleTheme()" 
              class="theme-toggle w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
              [title]="themeService.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              [attr.aria-label]="themeService.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <i class="fa-solid" [class]="themeService.isDarkMode() ? 'fa-sun text-yellow-500' : 'fa-moon'"></i>
            </button>
            <ng-container *ngIf="authService.isLoggedIn(); else loginBtn">
              <div class="relative group">
                <button class="w-8 h-8 md:w-10 md:h-10 bg-blue-500 text-white rounded-full font-bold flex items-center justify-center text-sm md:text-base" aria-label="User menu">
                  {{ getUserInitial() }}
                </button>
                <div class="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div class="bg-white rounded-xl shadow-xl p-4 min-w-[200px]">
                    <div class="border-b pb-3 mb-3">
                      <p class="font-medium text-gray-900">{{ authService.user()?.username }}</p>
                      <p class="text-xs text-gray-500">{{ authService.user()?.email }}</p>
                    </div>
                    <a *ngIf="authService.isAdmin()" routerLink="/admin" class="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                      <i class="fa-solid fa-gauge-high mr-2"></i> Admin Panel
                    </a>
                    <button (click)="logout()" class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <i class="fa-solid fa-arrow-right-from-bracket mr-2"></i> Log out
                    </button>
                  </div>
                </div>
              </div>
            </ng-container>
            <ng-template #loginBtn>
              <button (click)="showLogin = true" class="hidden md:block bg-blue-500 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors">
                Sign In
              </button>
            </ng-template>

            <button (click)="isMenuOpen = !isMenuOpen" class="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              [attr.aria-label]="isMenuOpen ? 'Close menu' : 'Open menu'" [attr.aria-expanded]="isMenuOpen">
              <i [class.fa-bars]="!isMenuOpen" [class.fa-xmark]="isMenuOpen" class="fa-solid text-lg text-gray-700 dark:text-gray-200"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="isMenuOpen" class="lg:hidden py-4 border-t">
          <div class="flex flex-col gap-4">
            <a routerLink="/pdf" (click)="isMenuOpen = false" class="text-gray-700 font-medium hover:text-blue-500 transition-colors">PDF Tools</a>
            <a routerLink="/image" (click)="isMenuOpen = false" class="text-gray-700 font-medium hover:text-blue-500 transition-colors">Image Tools</a>
            <a routerLink="/file" (click)="isMenuOpen = false" class="text-gray-700 font-medium hover:text-blue-500 transition-colors">File Tools</a>
            <a routerLink="/write" (click)="isMenuOpen = false" class="text-gray-700 font-medium hover:text-blue-500 transition-colors">AI Write</a>
            <a routerLink="/feedback" (click)="isMenuOpen = false" class="text-gray-700 font-medium hover:text-blue-500 transition-colors">Feedback</a>
            <button *ngIf="!authService.isLoggedIn()" (click)="showLogin = true; isMenuOpen = false" class="bg-blue-500 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors w-fit">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Auth Modal (Login/Signup) -->
    <div *ngIf="showLogin" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" (click)="showLogin = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8" (click)="$event.stopPropagation()">
        <h2 class="text-2xl font-bold text-center text-gray-900 mb-6">
          {{ isSignup ? 'Create Account' : 'Login to 2olhub' }}
        </h2>
        <form (ngSubmit)="isSignup ? signup() : login()">
          <div *ngIf="isSignup" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" [(ngModel)]="signupUsername" name="username" class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500" placeholder="johndoe">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" [(ngModel)]="loginEmail" name="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500" placeholder="name@example.com">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" [(ngModel)]="loginPassword" name="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500">
          </div>
          <button type="submit" [disabled]="isLoading" class="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            <i *ngIf="isLoading" class="fa-solid fa-spinner fa-spin"></i>
            {{ isLoading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In') }}
          </button>
        </form>
        <p class="text-center text-gray-600 mt-4">
          {{ isSignup ? 'Already have an account?' : "Don't have an account?" }}
          <button (click)="isSignup = !isSignup" class="text-blue-500 font-medium hover:underline ml-1">
            {{ isSignup ? 'Sign In' : 'Sign Up' }}
          </button>
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class NavbarComponent {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  isMenuOpen = false;
  showLogin = false;
  isSignup = false;
  loginEmail = '';
  loginPassword = '';
  signupUsername = '';
  isLoading = false;

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  getUserInitial(): string {
    const user = this.authService.user();
    return user?.username ? user.username.charAt(0).toUpperCase() : '';
  }

  logout(): void {
    this.authService.logout();
    this.toastService.success('Logged out successfully');
  }

  login(): void {
    if (this.isLoading) return;
    this.isLoading = true;
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeModal();
        this.toastService.success('Welcome back!');
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.error?.error || 'Login failed. Please try again.');
      }
    });
  }

  signup(): void {
    if (this.isLoading) return;

    // Validation
    if (!this.signupUsername || this.signupUsername.length < 3) {
      this.toastService.error('Username must be at least 3 characters long');
      return;
    }

    if (/\d/.test(this.signupUsername)) {
      this.toastService.error('Username cannot contain numbers');
      return;
    }

    if (!this.loginEmail || !this.isValidEmail(this.loginEmail)) {
      this.toastService.error('Please enter a valid email address');
      return;
    }

    if (!this.loginPassword || this.loginPassword.length < 6) {
      this.toastService.error('Password must be at least 6 characters long');
      return;
    }

    this.isLoading = true;
    this.authService.signup(this.signupUsername, this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeModal();
        this.toastService.success('Account created successfully!');
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.error?.error || 'Signup failed. Please try again.');
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private closeModal(): void {
    this.showLogin = false;
    this.isSignup = false;
    this.loginEmail = '';
    this.loginPassword = '';
    this.signupUsername = '';
  }
}


