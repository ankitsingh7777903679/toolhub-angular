import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

interface FilePreview {
    file: File;
    preview: string;
    type: 'image' | 'pdf';
}

@Component({
    selector: 'app-image-to-csv',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './image-to-csv.component.html',
    styleUrls: ['./image-to-csv.component.scss']
})
export class ImageToCsvComponent implements OnInit {
    private http = inject(HttpClient);
    private cdr = inject(ChangeDetectorRef);
    private analyticsService = inject(AnalyticsService);
    private seoService = inject(SeoService);

    selectedFiles: FilePreview[] = [];
    csvData: string | null = null;
    previewData: string[][] = [];
    isDragging = false;
    isProcessing = false;
    error: string | null = null;
    rowCount = 0;
    columnCount = 0;
    currentProcessingIndex = 0;

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: 'Image to CSV — Pull Table Data Out of Photos and Screenshots',
            description: 'Upload a photo of a table, receipt, or register and the AI extracts the data into a CSV. Beats retyping everything by hand.',
            keywords: 'image to csv, photo to csv, extract table from image, screenshot to spreadsheet, ocr table data',
            url: 'https://2olhub.netlify.app/file/image-to-csv'
        });
        this.seoService.setFaqJsonLd([
            { question: 'What kind of images work best?', answer: 'Clear, well-lit photos with visible table lines work great. JPG, PNG, WebP, and BMP are all supported. The sharper the image, the better the results — blurry photos from across the room won\'t cut it.' },
            { question: 'Will it read my handwriting?', answer: 'If the handwriting is reasonably neat and the photo is clear, yes. Think printed-style handwriting, not cursive notes. The AI does its best, but you\'ll want to double-check the output for handwritten content.' },
            { question: 'How accurate is it really?', answer: 'For clear, printed tables it\'s very accurate — you usually won\'t need to fix anything. Handwritten content or low-quality scans might need some cleanup. It\'s always worth a quick review before importing the data anywhere important.' },
            { question: 'What about my privacy?', answer: 'The image gets sent to the AI for processing (that part does require a server), but it\'s not stored after extraction. Once you\'ve got your CSV, the image data is discarded.' }
        ]);
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        this.isDragging = false;
        const files = event.dataTransfer?.files;
        if (files) {
            this.handleFiles(Array.from(files));
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.handleFiles(Array.from(input.files));
        }
    }

    async handleFiles(files: File[]): Promise<void> {
        this.csvData = null;
        this.previewData = [];
        this.error = null;
        this.selectedFiles = [];

        for (const file of files) {
            if (file.type.startsWith('image/')) {
                const preview = await this.readFileAsDataURL(file);
                this.selectedFiles.push({ file, preview, type: 'image' });
            }
        }

        if (this.selectedFiles.length === 0) {
            this.error = 'Please upload images or a PDF file';
        }

        this.cdr.detectChanges();
    }

    private readFileAsDataURL(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async extractData(): Promise<void> {
        if (this.selectedFiles.length === 0) return;

        this.isProcessing = true;
        this.error = null;
        this.csvData = '';
        this.previewData = [];

        try {
            const allRows: string[][] = [];
            let headers: string[] = [];

            for (let i = 0; i < this.selectedFiles.length; i++) {
                this.currentProcessingIndex = i;
                this.cdr.detectChanges();

                const filePreview = this.selectedFiles[i];
                if (filePreview.type !== 'image') continue;

                const base64 = filePreview.preview.split(',')[1];
                const mimeType = filePreview.file.type;

                const response = await this.http.post<{
                    success: boolean;
                    csv: string;
                    preview: string[][];
                    rowCount: number;
                    columnCount: number;
                }>(`${environment.apiUrl}/file/image-to-csv`, {
                    base64,
                    mimeType
                }).toPromise();

                if (response?.success && response.preview.length > 0) {
                    // For first file, include headers
                    if (i === 0) {
                        headers = response.preview[0];
                        allRows.push(...response.preview);
                    } else {
                        // Skip header row for subsequent files
                        allRows.push(...response.preview.slice(1));
                    }
                }
            }

            if (allRows.length > 0) {
                this.previewData = allRows;
                this.csvData = allRows.map(row => row.map(cell =>
                    cell.includes(',') ? `"${cell}"` : cell
                ).join(',')).join('\n');
                this.rowCount = allRows.length;
                this.columnCount = Math.max(...allRows.map(r => r.length));
                this.analyticsService.trackToolUsage('image-to-csv', 'Image to CSV', 'file');
            } else {
                this.error = 'No table data found in the uploaded files';
            }
        } catch (err: any) {
            this.error = err?.error?.message || 'Failed to extract data';
            console.error(err);
        } finally {
            this.isProcessing = false;
            this.cdr.detectChanges();
        }
    }

    private readFileAsBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    removeFile(index: number): void {
        this.selectedFiles.splice(index, 1);
        this.cdr.detectChanges();
    }

    download(): void {
        if (!this.csvData) return;

        const blob = new Blob([this.csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted_data.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    copyToClipboard(): void {
        if (this.csvData) {
            navigator.clipboard.writeText(this.csvData);
        }
    }

    reset(): void {
        this.selectedFiles = [];
        this.csvData = null;
        this.previewData = [];
        this.error = null;
        this.rowCount = 0;
        this.columnCount = 0;
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getTotalSize(): number {
        return this.selectedFiles.reduce((total, f) => total + f.file.size, 0);
    }
}
