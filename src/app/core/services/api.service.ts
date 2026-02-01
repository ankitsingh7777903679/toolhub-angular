import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Tools
    getTools(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/tools`);
    }

    getToolsByCategory(categoryId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/tools/category/${categoryId}`);
    }

    getTool(id: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/tools/${id}`);
    }

    createTool(tool: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/tools`, tool);
    }

    deleteTool(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/tools/${id}`);
    }

    // Categories
    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/categories`);
    }

    // Users (Admin)
    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/users`);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/users/${id}`);
    }

    // Dashboard Stats
    getDashboardStats(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/stats/dashboard`);
    }

    // AI Generation
    generateAIContent(promptType: string, text: string, paragraphs?: number): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/ai/generate`, {
            promptType,
            text,
            paragraphs
        });
    }
}
