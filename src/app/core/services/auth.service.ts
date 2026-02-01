import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'user' | 'admin';
}

export interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = environment.apiUrl;

    // Signals for reactive state
    private currentUser = signal<User | null>(null);
    private token = signal<string | null>(null);

    // Computed values
    isLoggedIn = computed(() => !!this.currentUser());
    isAdmin = computed(() => this.currentUser()?.role === 'admin');
    user = computed(() => this.currentUser());

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        // Load from localStorage on init
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            this.token.set(storedToken);
            this.currentUser.set(JSON.parse(storedUser));
        }
    }

    signup(username: string, email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/signup`, {
            username,
            email,
            password
        }).pipe(
            tap(response => this.handleAuth(response))
        );
    }

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, {
            email,
            password
        }).pipe(
            tap(response => this.handleAuth(response))
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.token.set(null);
        this.currentUser.set(null);
        this.router.navigate(['/']);
    }

    getToken(): string | null {
        return this.token();
    }

    private handleAuth(response: AuthResponse): void {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.token.set(response.token);
        this.currentUser.set(response.user);
    }

    // Check if current user is the admin (for backward compatibility)
    checkAdminAccess(): boolean {
        const user = this.currentUser();
        return user?.role === 'admin';
    }
}
