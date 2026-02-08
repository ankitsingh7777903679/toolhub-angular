import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

@Component({
    selector: 'app-json-to-excel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './json-to-excel.component.html',
    styleUrls: ['./json-to-excel.component.scss']
})
export class JsonToExcelComponent implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    private analyticsService = inject(AnalyticsService);
    private seoService = inject(SeoService);

    inputMode: 'file' | 'text' = 'file';
    selectedFile: File | null = null;
    jsonText = '';
    jsonData: any[] | null = null;
    previewRows: any[] = [];
    headers: string[] = [];
    isDragging = false;
    isProcessing = false;
    isReady = false;
    error: string | null = null;
    private workbook: XLSX.WorkBook | null = null;

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: 'Convert JSON to Excel Online - Free Data Converter',
            description: 'Convert JSON data to Excel (XLSX) format online. Transform structured JSON into spreadsheets. Free and fast JSON to Excel converter.',
            keywords: 'json to excel, convert json to xlsx, json converter, online excel converter, data transformation, json to xls',
            url: 'https://2olhub.netlify.app/file/json-to-excel'
        });
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
        const file = event.dataTransfer?.files[0];
        if (file && file.name.endsWith('.json')) {
            this.handleFile(file);
        } else {
            this.error = 'Please upload a JSON file';
        }
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            this.handleFile(input.files[0]);
        }
    }

    async handleFile(file: File): Promise<void> {
        this.selectedFile = file;
        this.error = null;
        this.isProcessing = true;

        try {
            const text = await file.text();
            this.processJSON(text);
        } catch (err) {
            this.error = 'Failed to read JSON file';
            console.error(err);
        } finally {
            this.isProcessing = false;
        }
    }

    processText(): void {
        if (!this.jsonText.trim()) {
            this.error = 'Please enter JSON data';
            return;
        }
        this.error = null;
        this.processJSON(this.jsonText);
    }

    private processJSON(text: string): void {
        try {
            let data = JSON.parse(text);

            // Handle nested structures like {"table": [...]} or {"data": [...]}
            if (!Array.isArray(data) && typeof data === 'object' && data !== null) {
                // Check if object has a single property that is an array
                const keys = Object.keys(data);
                const arrayKey = keys.find(key => Array.isArray(data[key]));
                if (arrayKey) {
                    data = data[arrayKey];
                } else {
                    // If no array property found, wrap the object in an array
                    data = [data];
                }
            }

            this.jsonData = data;
            this.previewRows = data.slice(0, 10);

            // Get all unique headers
            const headerSet = new Set<string>();
            data.forEach((row: any) => {
                Object.keys(row).forEach(key => headerSet.add(key));
            });
            this.headers = Array.from(headerSet);

            // Create workbook
            const sheet = XLSX.utils.json_to_sheet(data);
            this.workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(this.workbook, sheet, 'Sheet1');
            this.isReady = true;
            this.analyticsService.trackToolUsage('json-to-excel', 'JSON to Excel', 'file');
            this.cdr.detectChanges();
        } catch (err) {
            this.error = 'Invalid JSON format. Please check your input.';
            console.error(err);
        }
    }

    download(): void {
        if (!this.workbook) return;

        const excelBuffer = XLSX.write(this.workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = this.selectedFile ? this.selectedFile.name.replace(/\.json$/i, '') : 'data';
        a.download = filename + '.xlsx';
        a.click();
        URL.revokeObjectURL(url);
    }

    reset(): void {
        this.selectedFile = null;
        this.jsonText = '';
        this.jsonData = null;
        this.previewRows = [];
        this.headers = [];
        this.workbook = null;
        this.error = null;
        this.isReady = false;
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getCellValue(row: any, header: string): string {
        const val = row[header];
        if (val === null || val === undefined) return '-';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
    }
}
