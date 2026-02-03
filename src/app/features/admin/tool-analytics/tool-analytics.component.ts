import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, ToolStats, AnalyticsResponse } from '../../../core/services/analytics.service';

@Component({
    selector: 'app-tool-analytics',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Tool Analytics</h1>
                    <p class="text-gray-500">Track tool usage across your platform</p>
                </div>
                <button (click)="loadStats()" 
                        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <i class="fa-solid fa-refresh mr-2"></i> Refresh
                </button>
            </div>

            <!-- Total Card -->
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6 shadow-lg">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                        <i class="fa-solid fa-chart-line text-3xl"></i>
                    </div>
                    <div>
                        <p class="text-blue-100 text-sm">Total Tool Uses</p>
                        <p class="text-4xl font-bold">{{ totalUses | number }}</p>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div *ngIf="isLoading" class="text-center py-12">
                <i class="fa-solid fa-spinner fa-spin text-4xl text-blue-500"></i>
                <p class="text-gray-500 mt-4">Loading analytics...</p>
            </div>

            <!-- Stats Table -->
            <div *ngIf="!isLoading" class="bg-white rounded-xl shadow-lg overflow-hidden">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">#</th>
                            <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tool Name</th>
                            <th class="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                            <th class="text-right px-6 py-4 text-sm font-semibold text-gray-600">Uses</th>
                            <th class="text-right px-6 py-4 text-sm font-semibold text-gray-600">Last Used</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let tool of tools; let i = index" 
                            class="border-b hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4 text-gray-500">{{ i + 1 }}</td>
                            <td class="px-6 py-4">
                                <span class="font-medium text-gray-800">{{ tool.toolName }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 text-xs font-medium rounded-full"
                                      [ngClass]="{
                                          'bg-blue-100 text-blue-700': tool.category === 'pdf',
                                          'bg-green-100 text-green-700': tool.category === 'image',
                                          'bg-purple-100 text-purple-700': tool.category === 'ai-write',
                                          'bg-yellow-100 text-yellow-700': tool.category === 'file',
                                          'bg-gray-100 text-gray-700': tool.category === 'other'
                                      }">
                                    {{ tool.category | uppercase }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <span class="font-bold text-gray-800">{{ tool.count | number }}</span>
                            </td>
                            <td class="px-6 py-4 text-right text-gray-500 text-sm">
                                {{ formatDate(tool.lastUsed) }}
                            </td>
                        </tr>
                        <tr *ngIf="tools.length === 0">
                            <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                                <i class="fa-solid fa-chart-simple text-4xl mb-4 opacity-50"></i>
                                <p>No usage data yet. Start using tools to see analytics!</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
})
export class ToolAnalyticsComponent implements OnInit {
    private analyticsService = inject(AnalyticsService);
    private cdr = inject(ChangeDetectorRef);

    tools: ToolStats[] = [];
    totalUses = 0;
    isLoading = true;

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        this.isLoading = true;
        this.analyticsService.getStats().subscribe({
            next: (res) => {
                this.tools = res.tools;
                this.totalUses = res.total;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to load stats:', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    formatDate(date: Date): string {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
