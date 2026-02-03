import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ToolStats {
    toolId: string;
    toolName: string;
    category: string;
    count: number;
    lastUsed: Date;
}

export interface AnalyticsResponse {
    total: number;
    tools: ToolStats[];
}

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    /**
     * Track tool usage - call this when a tool completes successfully
     */
    trackToolUsage(toolId: string, toolName: string, category: string = 'other'): void {
        this.http.post(`${this.apiUrl}/tool-stats/track`, {
            toolId,
            toolName,
            category
        }).subscribe({
            error: (err) => console.error('Failed to track tool usage:', err)
        });
    }

    /**
     * Get all tool usage statistics
     */
    getStats(): Observable<AnalyticsResponse> {
        return this.http.get<AnalyticsResponse>(`${this.apiUrl}/tool-stats/stats`);
    }
}
