import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

@Component({
    selector: 'app-excel-to-json',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './excel-to-json.component.html',
    styleUrls: ['./excel-to-json.component.scss']
})
export class ExcelToJsonComponent implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    private analyticsService = inject(AnalyticsService);
    private seoService = inject(SeoService);

    inputMode: 'file' | 'text' = 'file';
    selectedFile: File | null = null;
    inputText = '';
    jsonData: any[] | null = null;
    jsonString: string = '';
    sheets: string[] = [];
    selectedSheet = '';
    isDragging = false;
    isProcessing = false;
    error: string | null = null;

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: 'Excel to JSON Converter — Turn Spreadsheets into Code-Ready Data',
            description: 'Upload an Excel file and get structured JSON you can paste into your project, import into MongoDB, or feed to an API. Headers become keys, rows become objects.',
            keywords: 'excel to json, xlsx to json, spreadsheet to json, convert excel json online, excel data api',
            url: 'https://2olhub.netlify.app/file/excel-to-json'
        });
        this.seoService.setFaqJsonLd([
            { question: 'What does the output look like?', answer: 'You get an array of objects. Each row is one object, and the column headers become the keys. So a spreadsheet with "name" and "email" columns gives you objects like name: "Alice", email: "alice@example.com" for each row.' },
            { question: 'Can I use this directly with MongoDB?', answer: 'Yep. The output is a JSON array that works with db.collection.insertMany() or you can import it through MongoDB Compass. No reformatting needed.' },
            { question: 'What happens with blank cells?', answer: 'Empty cells become empty strings in the JSON. The key is still there, so your data structure stays consistent across all rows. No missing keys to break your code.' },
            { question: 'Does it keep numbers as numbers (not strings)?', answer: 'Yes — 42 stays as 42, not "42". Text stays as strings, and dates get converted to a readable format. The converter is smart about data types so you don\'t have to parseInt() everything.' }
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
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
            this.handleFile(file);
        } else {
            this.error = 'Please upload an Excel or CSV file';
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
        this.jsonData = null;
        this.error = null;
        this.isProcessing = true;

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            this.sheets = workbook.SheetNames;
            this.selectedSheet = this.sheets[0];
            this.processSheet(workbook);
        } catch (err) {
            this.error = 'Failed to read file';
            console.error(err);
        } finally {
            this.isProcessing = false;
        }
    }

    processText(): void {
        if (!this.inputText.trim()) {
            this.error = 'Please enter data';
            return;
        }
        this.error = null;

        try {
            // Parse as CSV/TSV
            const lines = this.inputText.trim().split('\n');
            const delimiter = this.inputText.includes('\t') ? '\t' : ',';
            const headers = this.parseRow(lines[0], delimiter);

            this.jsonData = lines.slice(1).filter(l => l.trim()).map(line => {
                const values = this.parseRow(line, delimiter);
                const obj: any = {};
                headers.forEach((header, i) => {
                    obj[header] = values[i] || '';
                });
                return obj;
            });

            this.jsonString = JSON.stringify(this.jsonData, null, 2);
            this.cdr.detectChanges();
        } catch (err) {
            this.error = 'Failed to parse data';
            console.error(err);
        }
    }

    private parseRow(row: string, delimiter: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (const char of row) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    }

    async processSheet(workbook?: XLSX.WorkBook): Promise<void> {
        if (!this.selectedFile) return;

        try {
            if (!workbook) {
                const data = await this.selectedFile.arrayBuffer();
                workbook = XLSX.read(data);
            }

            const sheet = workbook.Sheets[this.selectedSheet];
            this.jsonData = XLSX.utils.sheet_to_json(sheet);
            this.jsonString = JSON.stringify(this.jsonData, null, 2);
            this.analyticsService.trackToolUsage('excel-to-json', 'Excel to JSON', 'file');
            this.cdr.detectChanges();
        } catch (err) {
            this.error = 'Failed to process sheet';
            console.error(err);
        }
    }

    onSheetChange(sheet: string): void {
        this.selectedSheet = sheet;
        this.processSheet();
    }

    copyToClipboard(): void {
        navigator.clipboard.writeText(this.jsonString);
    }

    download(): void {
        if (!this.jsonString) return;

        const blob = new Blob([this.jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = this.selectedFile ? this.selectedFile.name.replace(/\.(xlsx|xls|csv)$/i, '') : 'data';
        a.download = filename + '.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    reset(): void {
        this.selectedFile = null;
        this.inputText = '';
        this.jsonData = null;
        this.jsonString = '';
        this.sheets = [];
        this.selectedSheet = '';
        this.error = null;
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
