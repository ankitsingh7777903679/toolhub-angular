import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

@Component({
    selector: 'app-excel-to-csv',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './excel-to-csv.component.html',
    styleUrls: ['./excel-to-csv.component.scss']
})
export class ExcelToCsvComponent implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    private analyticsService = inject(AnalyticsService);
    private seoService = inject(SeoService);

    inputMode: 'file' | 'text' = 'file';
    selectedFile: File | null = null;
    inputText = '';
    csvData: string | null = null;
    sheets: string[] = [];
    selectedSheet = '';
    previewRows: string[][] = [];
    isDragging = false;
    isProcessing = false;
    error: string | null = null;

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: 'Excel to CSV Converter — Plain Text Data from Any Spreadsheet',
            description: 'Need your Excel data in CSV format? Upload your .xlsx or .xls file and get a clean CSV you can import into databases, scripts, or other tools.',
            keywords: 'excel to csv, xlsx to csv, convert excel to csv online, export spreadsheet csv, excel csv converter',
            url: 'https://2olhub.netlify.app/file/excel-to-csv'
        });
        this.seoService.setFaqJsonLd([
            { question: 'Wait — will I lose my formatting and formulas?', answer: 'Yes, and that\'s the point. CSV is pure data — no colors, no fonts, no formulas. You\'ll keep the calculated values (so a SUM cell becomes the number itself), but the styling is gone. That\'s exactly what databases and import tools want.' },
            { question: 'What about special characters and non-English text?', answer: 'The output uses UTF-8 encoding, so Hindi, Chinese, Arabic, emojis, accented characters — they all come through fine. No garbled text.' },
            { question: 'How big a file can I convert?', answer: 'Since it\'s all browser-based, there\'s no upload limit. Files under 20MB convert almost instantly. Really big files (50MB+) might slow down depending on your computer, but they\'ll still work.' },
            { question: 'Do I need Excel installed on my computer?', answer: 'Nope. This runs entirely in your browser. You don\'t need Excel, LibreOffice, or any other software. If you can read this page, you can convert files.' },
            { question: 'What\'s the difference between XLS and XLSX anyway?', answer: 'XLS is the old Excel format from the \'97-2003 era. XLSX is the modern one — smaller files, better features. Both convert to CSV the same way here, so it doesn\'t matter which one you have.' }
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
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            this.handleFile(file);
        } else {
            this.error = 'Please upload an Excel file (.xlsx or .xls)';
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
        this.csvData = null;
        this.error = null;
        this.isProcessing = true;

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            this.sheets = workbook.SheetNames;
            this.selectedSheet = this.sheets[0];
            this.processSheet(workbook);
        } catch (err) {
            this.error = 'Failed to read Excel file';
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
            // Convert tab-separated to CSV
            const lines = this.inputText.trim().split('\n');
            const csvLines = lines.map(line => {
                // If it's tab-separated, convert to CSV
                if (line.includes('\t')) {
                    return line.split('\t').map(cell => {
                        // Quote cells that contain commas or quotes
                        if (cell.includes(',') || cell.includes('"')) {
                            return '"' + cell.replace(/"/g, '""') + '"';
                        }
                        return cell;
                    }).join(',');
                }
                return line;
            });

            this.csvData = csvLines.join('\n');
            this.previewRows = csvLines.slice(0, 10).map(row => this.parseCSVRow(row));
            this.cdr.detectChanges();
        } catch (err) {
            this.error = 'Failed to process data';
            console.error(err);
        }
    }

    async processSheet(workbook?: XLSX.WorkBook): Promise<void> {
        if (!this.selectedFile) return;

        try {
            if (!workbook) {
                const data = await this.selectedFile.arrayBuffer();
                workbook = XLSX.read(data);
            }

            const sheet = workbook.Sheets[this.selectedSheet];
            this.csvData = XLSX.utils.sheet_to_csv(sheet);

            // Parse for preview (first 10 rows)
            const rows = this.csvData.split('\n').slice(0, 10);
            this.previewRows = rows.map(row => this.parseCSVRow(row));
            this.analyticsService.trackToolUsage('excel-to-csv', 'Excel to CSV', 'file');
            this.cdr.detectChanges();
        } catch (err) {
            this.error = 'Failed to process sheet';
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

    onSheetChange(sheet: string): void {
        this.selectedSheet = sheet;
        this.processSheet();
    }

    copyToClipboard(): void {
        if (this.csvData) {
            navigator.clipboard.writeText(this.csvData);
        }
    }

    download(): void {
        if (!this.csvData) return;

        const blob = new Blob([this.csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = this.selectedFile ? this.selectedFile.name.replace(/\.(xlsx|xls)$/i, '') : 'data';
        a.download = filename + '.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    reset(): void {
        this.selectedFile = null;
        this.inputText = '';
        this.csvData = null;
        this.sheets = [];
        this.selectedSheet = '';
        this.previewRows = [];
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
