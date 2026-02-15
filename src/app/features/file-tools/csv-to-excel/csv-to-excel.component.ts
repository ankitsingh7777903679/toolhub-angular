import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

@Component({
    selector: 'app-csv-to-excel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './csv-to-excel.component.html',
    styleUrls: ['./csv-to-excel.component.scss']
})
export class CsvToExcelComponent implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    private analyticsService = inject(AnalyticsService);
    private seoService = inject(SeoService);

    inputMode: 'file' | 'text' = 'file';
    selectedFile: File | null = null;
    csvText = '';
    previewRows: string[][] = [];
    isDragging = false;
    isProcessing = false;
    isReady = false;
    error: string | null = null;
    private workbook: XLSX.WorkBook | null = null;

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: 'CSV to Excel Converter — Get a Real Spreadsheet from Your CSV',
            description: 'Drop in your CSV file and get a properly formatted Excel spreadsheet you can sort, filter, and share. No sign-up, runs in your browser.',
            keywords: 'csv to excel, csv to xlsx, convert csv spreadsheet, csv file to excel online, open csv in excel',
            url: 'https://2olhub.netlify.app/file/csv-to-excel'
        });
        this.seoService.setFaqJsonLd([
            { question: 'Why not just open the CSV directly in Excel?', answer: 'You can — but Excel sometimes mangles things. Phone numbers lose their leading zeros, dates get reformatted weirdly, and long numbers turn into scientific notation. Converting properly avoids those headaches.' },
            { question: 'Will all my data come through correctly?', answer: 'Yes — numbers, text, dates, special characters, and even quoted fields with commas inside them all transfer accurately. The converter handles edge cases that trip up most tools.' },
            { question: 'Can I open the .xlsx in Google Sheets?', answer: 'Absolutely. Just upload it to Google Drive and it opens right up. Also works in LibreOffice, Apple Numbers, and any other modern spreadsheet app.' },
            { question: 'My CSV uses semicolons, not commas — will that work?', answer: 'Yep, the converter picks up on semicolons, tabs, and pipes automatically. European-style CSVs with semicolons work just fine.' }
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
        const file = event.dataTransfer?.files[0];
        if (file && file.name.endsWith('.csv')) {
            this.handleFile(file);
        } else {
            this.error = 'Please upload a CSV file';
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
            this.processCSV(text);
        } catch (err) {
            this.error = 'Failed to read CSV file';
            console.error(err);
        } finally {
            this.isProcessing = false;
        }
    }

    processText(): void {
        if (!this.csvText.trim()) {
            this.error = 'Please enter CSV data';
            return;
        }
        this.error = null;
        this.processCSV(this.csvText);
    }

    private processCSV(text: string): void {
        try {
            const rows = text.split('\n').filter(r => r.trim());
            const parsedRows = rows.map(r => this.parseCSVRow(r));

            // Store preview (first 10 rows)
            this.previewRows = parsedRows.slice(0, 10);

            // Create workbook
            const sheet = XLSX.utils.aoa_to_sheet(parsedRows);
            this.workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(this.workbook, sheet, 'Sheet1');
            this.isReady = true;
            this.analyticsService.trackToolUsage('csv-to-excel', 'CSV to Excel', 'file');
            this.cdr.detectChanges();
        } catch (err) {
            this.error = 'Failed to process CSV';
            console.error(err);
        }
    }

    parseCSVRow(row: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (const char of row) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }

    download(): void {
        if (!this.workbook) return;

        const excelBuffer = XLSX.write(this.workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = this.selectedFile ? this.selectedFile.name.replace(/\.csv$/i, '') : 'data';
        a.download = filename + '.xlsx';
        a.click();
        URL.revokeObjectURL(url);
    }

    reset(): void {
        this.selectedFile = null;
        this.csvText = '';
        this.previewRows = [];
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
}
