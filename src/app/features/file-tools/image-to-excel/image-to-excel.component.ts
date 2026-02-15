import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import * as XLSX from 'xlsx';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';
import { WorkspaceService } from '../../../shared/services/workspace.service';

interface FilePreview {
    file: File;
    preview: string;
    type: 'image' | 'pdf';
}

@Component({
    selector: 'app-image-to-excel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './image-to-excel.component.html',
    styleUrls: ['./image-to-excel.component.scss']
})
export class ImageToExcelComponent implements OnInit {
    private http = inject(HttpClient);
    private cdr = inject(ChangeDetectorRef);
    private analyticsService = inject(AnalyticsService);
    private seoService = inject(SeoService);

    selectedFiles: FilePreview[] = [];
    previewData: string[][] = [];
    isDragging = false;
    isProcessing = false;
    error: string | null = null;
    rowCount = 0;
    columnCount = 0;
    currentProcessingIndex = 0;
    private workbook: XLSX.WorkBook | null = null;

    private workspaceService = inject(WorkspaceService); // Inject WorkspaceService

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: 'Image to Excel — Get an Editable Spreadsheet from Any Photo or Scan',
            description: 'Take a photo of a printed table or upload a scanned PDF and get a real Excel file with rows, columns, and data in the right cells. AI does the heavy lifting.',
            keywords: 'image to excel, photo to spreadsheet, scan to excel, pdf table to excel, ocr to xlsx, picture to excel',
            url: 'https://2olhub.netlify.app/file/image-to-excel'
        });
        this.seoService.setFaqJsonLd([
            { question: 'What image types can I upload?', answer: 'JPG, PNG, WebP, BMP, TIFF, and even PDFs. Basically anything you\'d get from a phone camera, scanner, or screenshot tool. Higher resolution = better results, so don\'t crop too aggressively.' },
            { question: 'What if my image has more than one table?', answer: 'The AI can detect multiple tables in a single image. They\'ll be placed on separate sheets or sections in the output. Works best when the tables are clearly separate from each other.' },
            { question: 'How good is the accuracy?', answer: 'For well-lit photos of clean, printed tables, it\'s very accurate. Handwritten content or blurry photos may need a quick review. Tip: make sure the whole table is visible and the text isn\'t too small in the image.' },
            { question: 'Why Excel instead of CSV?', answer: 'Excel gives you way more to work with. You can add formulas, formatting, charts, and pivot tables immediately. CSV is just raw data — Excel is a ready-to-use spreadsheet. If you\'d prefer CSV, check out our Image to CSV tool.' }
        ]);

        // Tool Chaining - Handle incoming files
        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file) {
                this.loadImageFromWorkspace(file.data, file.fileName, file.fileType);
            }
        }
    }

    private async loadImageFromWorkspace(data: string, fileName: string, fileType: 'image' | 'pdf'): Promise<void> {
        try {
            // Convert base64 to Blob/File
            const response = await fetch(data);
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: blob.type });

            // Add to selected files
            this.handleFiles([file]);
        } catch (error) {
            console.error('Failed to load file from workspace:', error);
        }
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
        this.previewData = [];
        this.error = null;
        this.selectedFiles = [];
        this.workbook = null;

        for (const file of files) {
            if (file.type.startsWith('image/')) {
                const preview = await this.readFileAsDataURL(file);
                this.selectedFiles.push({ file, preview, type: 'image' });
            } else if (file.type === 'application/pdf') {
                this.selectedFiles.push({
                    file,
                    preview: '',
                    type: 'pdf'
                });
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
        this.previewData = [];

        try {
            const allData: any[] = [];

            for (let i = 0; i < this.selectedFiles.length; i++) {
                this.currentProcessingIndex = i;
                this.cdr.detectChanges();

                const filePreview = this.selectedFiles[i];
                let base64: string;
                let mimeType: string;

                if (filePreview.type === 'image') {
                    base64 = filePreview.preview.split(',')[1];
                    mimeType = filePreview.file.type;
                } else {
                    const pdfBase64 = await this.readFileAsBase64(filePreview.file);
                    base64 = pdfBase64;
                    mimeType = 'application/pdf';
                }

                // Call the new 2-step image-to-excel API
                const response = await this.http.post<{
                    success: boolean;
                    data: any[];
                    rowCount: number;
                    ocrLength?: number;
                }>(`${environment.apiUrl}/file/image-to-excel`, {
                    base64,
                    mimeType
                }).toPromise();

                if (response?.success && response.data && response.data.length > 0) {
                    allData.push(...response.data);
                }
            }

            if (allData.length > 0) {
                // Convert JSON data to array of arrays for preview
                const headers = Object.keys(allData[0]);
                const rows = allData.map(row => headers.map(h => String(row[h] ?? '')));
                this.previewData = [headers, ...rows];
                this.rowCount = allData.length;
                this.columnCount = headers.length;

                // Create Excel workbook from JSON data
                const sheet = XLSX.utils.json_to_sheet(allData);
                this.workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(this.workbook, sheet, 'Sheet1');
                this.analyticsService.trackToolUsage('image-to-excel', 'Image to Excel', 'file');
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
        if (!this.workbook) return;

        const excelBuffer = XLSX.write(this.workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted_data.xlsx';
        a.click();
        URL.revokeObjectURL(url);
    }

    reset(): void {
        this.selectedFiles = [];
        this.previewData = [];
        this.error = null;
        this.rowCount = 0;
        this.columnCount = 0;
        this.workbook = null;
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
