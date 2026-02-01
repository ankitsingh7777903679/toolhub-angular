import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedbackService, Feedback } from '../../../core/services/feedback.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-feedback',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      
      <div class="max-w-3xl mx-auto relative z-10">
        <!-- Header -->
        <div class="text-center mb-10">
          <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4 tracking-tight drop-shadow-sm">
            Community Voices
          </h1>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Join the conversation. What are you building?
          </p>
        </div>

        <!-- Input Form (Top) -->
        <div class="mb-10">
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/20 dark:border-slate-800 p-6 transition-all duration-300">
              
              <!-- Smart Moderation Alert -->
              <div *ngIf="moderationError" class="mb-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-100 dark:border-red-800/30 p-3 rounded-xl animate-in slide-in-from-top-2 fade-in duration-300">
                <div class="flex items-start">
                  <div class="flex-shrink-0 mt-0.5">
                    <i class="fa-solid fa-robot text-red-500 dark:text-red-400 text-sm"></i>
                  </div>
                  <div class="ml-2.5">
                    <h3 class="text-xs font-semibold text-red-800 dark:text-red-200">Review Assistant</h3>
                    <p class="text-xs text-red-600 dark:text-red-300 mt-0.5 leading-relaxed">{{ moderationError }}</p>
                  </div>
                </div>
              </div>

              <!-- Success Toast -->
              <div *ngIf="successMessage" class="mb-4 bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm border border-green-100 dark:border-green-800/30 p-3 rounded-xl animate-in slide-in-from-top-2 fade-in duration-300">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-6 h-6 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
                      <i class="fa-solid fa-check text-green-600 dark:text-green-400 text-xs"></i>
                    </div>
                  </div>
                  <div class="ml-2.5">
                    <p class="text-xs font-medium text-green-800 dark:text-green-200">{{ successMessage }}</p>
                  </div>
                </div>
              </div>

              <form (ngSubmit)="submitFeedback()" class="space-y-4">
                <div class="relative group">
                  <textarea
                    id="feedback"
                    rows="3"
                    [(ngModel)]="newFeedbackContent"
                    name="feedback"
                    class="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border-0 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:bg-white dark:focus:bg-slate-950 transition-all duration-300 resize-none shadow-inner text-sm"
                    placeholder="Write a comment..."
                    required
                    [disabled]="isSubmitting"
                  ></textarea>
                </div>

                <div class="flex items-center justify-between">
                    <div class="text-xs font-medium transition-colors duration-300" 
                       [class.text-blue-500]="newFeedbackContent.length > 0"
                       [class.dark:text-blue-400]="newFeedbackContent.length > 0"
                       [class.text-slate-400]="newFeedbackContent.length === 0"
                       [class.dark:text-slate-600]="newFeedbackContent.length === 0">
                    {{ newFeedbackContent.length }}/500
                  </div>

                    <button
                    type="submit"
                    [disabled]="!newFeedbackContent.trim() || isSubmitting"
                    class="flex items-center justify-center py-2.5 px-6 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-400 dark:hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                    <ng-container *ngIf="isSubmitting">
                        <i class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                        Posting...
                    </ng-container>
                    <ng-container *ngIf="!isSubmitting">
                        Post Comment
                    </ng-container>
                    </button>
                </div>
              </form>
            </div>
        </div>

        <!-- Feed (Bottom) -->
        <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center mb-6 px-2">
                Discussion
                <span class="ml-3 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {{ feedbacks.length }}
                </span>
            </h3>
            
            <div class="space-y-4">
              <!-- Loading Skeleton -->
              <ng-container *ngIf="isLoading && feedbacks.length === 0">
                <div *ngFor="let i of [1,2,3]" class="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 animate-pulse">
                  <div class="flex space-x-3">
                    <div class="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div class="flex-1 py-1">
                      <div class="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-3"></div>
                      <div class="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </ng-container>

              <!-- Feedback Cards -->
              <div *ngFor="let feedback of visibleFeedbacks" 
                   class="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4">
                <div class="flex items-start space-x-3">
                  <!-- Avatar Placeholder -->
                  <div class="flex-shrink-0">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm font-bold shadow-inner">
                       {{ feedback.content.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                         <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
                            User • {{ feedback.createdAt | date:'MMM d' }}
                         </span>
                         
                          <!-- Sentiment Pill -->
                        <span [ngClass]="{
                            'text-emerald-600 dark:text-emerald-400': feedback.sentiment === 'Positive',
                            'text-rose-600 dark:text-rose-400': feedback.sentiment === 'Negative',
                            'text-slate-500 dark:text-slate-400': feedback.sentiment === 'Neutral'
                            }"
                            class="text-[10px] font-medium opacity-80">
                            {{ feedback.sentiment }}
                        </span>
                    </div>

                    <p class="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{{ feedback.content }}</p>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div *ngIf="!isLoading && feedbacks.length === 0" class="text-center py-10 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <div class="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i class="fa-regular fa-comments text-lg text-slate-400 dark:text-slate-500"></i>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400">No comments yet. Be the first!</p>
              </div>

              <!-- Pagination Controls -->
              <div *ngIf="feedbacks.length > 5" class="flex justify-center items-center space-x-4 pt-4 pb-8">
                <!-- Show More -->
                <button 
                  *ngIf="visibleFeedbacks.length < feedbacks.length"
                  (click)="loadMore()" 
                  class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center"
                >
                  <span>Show more comments</span>
                  <i class="fa-solid fa-chevron-down ml-1.5 text-xs"></i>
                </button>

                <!-- Show Less -->
                <button 
                  *ngIf="visibleFeedbacks.length > 5"
                  (click)="showLess()" 
                  class="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center"
                >
                  <span>Show fewer</span>
                  <i class="fa-solid fa-chevron-up ml-1.5 text-xs"></i>
                </button>
              </div>

            </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class FeedbackComponent implements OnInit, OnDestroy {
    feedbacks: Feedback[] = [];
    visibleFeedbacks: Feedback[] = [];
    visibleCount = 5;

    newFeedbackContent = '';
    isSubmitting = false;
    isLoading = true;
    moderationError: string | null = null;
    successMessage: string | null = null;

    private pollInterval: any;
    private feedbackService = inject(FeedbackService);
    private cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.loadFeedbacks();
        // Poll every 10 seconds
        this.pollInterval = setInterval(() => {
            this.loadFeedbacks(false);
        }, 10000);
    }

    ngOnDestroy(): void {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }

    loadMore(): void {
        this.visibleCount += 5;
        this.updateVisibleFeedbacks();
    }

    showLess(): void {
        this.visibleCount = 5;
        this.updateVisibleFeedbacks();
    }

    private updateVisibleFeedbacks(): void {
        this.visibleFeedbacks = this.feedbacks.slice(0, this.visibleCount);
        this.cdr.detectChanges();
    }

    loadFeedbacks(showLoading = true): void {
        if (showLoading) this.isLoading = true;

        this.feedbackService.getFeedbacks().subscribe({
            next: (data: Feedback[]) => {
                this.feedbacks = data;
                this.updateVisibleFeedbacks();
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading feedbacks', err);
                if (showLoading) this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    submitFeedback(): void {
        if (!this.newFeedbackContent.trim()) return;

        this.isSubmitting = true;
        this.moderationError = null;
        this.successMessage = null;

        this.feedbackService.submitFeedback(this.newFeedbackContent).subscribe({
            next: (res: Feedback) => {
                this.newFeedbackContent = '';
                this.isSubmitting = false;
                this.successMessage = 'Posted!';
                this.loadFeedbacks(false);

                // Clear success message after 3s
                setTimeout(() => {
                    this.successMessage = null;
                    this.cdr.detectChanges();
                }, 3000);

                this.cdr.detectChanges();
            },
            error: (err: HttpErrorResponse) => {
                this.isSubmitting = false;

                // Handle Moderation or Validation Errors
                if (err.status === 400 && err.error) {
                    this.moderationError = err.error.message || err.error.error || 'Content flagged as inappropriate.';
                } else {
                    this.moderationError = 'Something went wrong. Please try again.';
                }

                this.cdr.detectChanges();
            }
        });
    }
}
