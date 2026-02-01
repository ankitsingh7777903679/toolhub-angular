import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Feedback {
    _id?: string;
    content: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    isAbusive: boolean;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/feedback`;

    submitFeedback(content: string): Observable<Feedback> {
        return this.http.post<Feedback>(this.apiUrl, { content });
    }

    getFeedbacks(): Observable<Feedback[]> {
        return this.http.get<Feedback[]>(this.apiUrl);
    }
}
