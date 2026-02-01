import { Component, ElementRef, ViewChild, signal, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';

declare const pdfjsLib: any;
declare const PDFLib: any;
declare const JSZip: any;
declare const saveAs: any;

type SplitMode = 'individual' | 'ranges' | 'equalParts' | 'extractSingle';

@Component({
    selector: 'app-split',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    templateUrl: './split.component.html',
    styleUrl: './split.component.scss'
})
export class SplitComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    // State
    pdfDoc: any = null;
    pdfjsDoc: any = null;
    fileName = '';
    totalPages = signal(0);
    selectedPages = signal<Set<number>>(new Set());
    previews = signal<string[]>([]);
    status = signal('');
    isLoading = signal(false);
    isProcessing = signal(false);
    isDragOver = signal(false);

    // Split Mode
    splitMode = signal<SplitMode>('extractSingle');
    showAdvanced = signal(false);

    // Range Mode Settings
    rangeInput = signal('');

    // Equal Parts Mode Settings
    equalParts = signal(2);

    // Download Options
    downloadAsZip = signal(false);
    customPrefix = signal('split');

    // Range selector
    rangeStart = signal(1);
    rangeEnd = signal(1);

    // Tool chaining output state
    splitCompleted = signal(false);
    lastOutputData = signal('');
    lastOutputFileName = signal('');

    // Pending files for download (after split, before download)
    pendingFiles = signal<{ name: string; bytes: Uint8Array }[]>([]);

    constructor(
        private workspaceService: WorkspaceService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private scriptLoader: ScriptLoaderService
    ) { }

    async ngOnInit(): Promise<void> { // Changed to async
        // Load required scripts dynamically
        await this.scriptLoader.load(['pdf-lib', 'pdf-js', 'jszip', 'file-saver']);

        // Check for PDF from tool chain
        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'pdf') {
                this.loadPdfFromWorkspace(file.data, file.fileName);
            }
        }
    }

    private async loadPdfFromWorkspace(dataUrl: string, fileName: string): Promise<void> {
        try {
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const file = new File([blob], fileName, { type: 'application/pdf' });
            await this.loadPdfFile(file);
        } catch (error) {
            console.error('Error loading PDF from workspace:', error);
        }
    }

    async onFileSelect(event: Event): Promise<void> {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        await this.loadPdfFile(file);
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(true);
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(false);
    }

    async onDrop(event: DragEvent): Promise<void> {
        event.preventDefault();
        event.stopPropagation();
        this.isDragOver.set(false);

        const file = event.dataTransfer?.files?.[0];
        if (file && file.type === 'application/pdf') {
            await this.loadPdfFile(file);
        } else {
            this.status.set('Please drop a valid PDF file.');
        }
    }

    async loadPdfFile(file: File): Promise<void> {
        this.isLoading.set(true);
        this.status.set('Loading PDF...');
        this.selectedPages.set(new Set());
        this.previews.set([]);
        this.fileName = file.name.replace('.pdf', '');

        try {
            const arrayBuffer = await file.arrayBuffer();

            // Load with PDF-lib for manipulation
            this.pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const pageCount = this.pdfDoc.getPageCount();
            this.totalPages.set(pageCount);
            this.rangeEnd.set(pageCount);

            // Load with pdf.js for previews
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file));
            this.pdfjsDoc = await loadingTask.promise;

            // Generate previews
            await this.generatePreviews();

            this.status.set(`PDF loaded successfully. ${pageCount} pages found.`);
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.status.set('Error loading PDF. Please try again.');
        } finally {
            this.isLoading.set(false);
        }
    }

    async generatePreviews(): Promise<void> {
        const numPages = this.pdfjsDoc.numPages;
        const previews: string[] = new Array(numPages).fill('');

        // Process pages in parallel batches for faster loading
        const batchSize = 5;
        for (let batch = 0; batch < numPages; batch += batchSize) {
            const promises: Promise<void>[] = [];

            for (let i = batch; i < Math.min(batch + batchSize, numPages); i++) {
                const pageNum = i + 1;
                promises.push(
                    this.renderPagePreview(pageNum).then(dataUrl => {
                        previews[i] = dataUrl;
                        // Update previews progressively for better UX
                        this.previews.set([...previews]);
                    })
                );
            }

            await Promise.all(promises);
        }
    }

    private async renderPagePreview(pageNum: number): Promise<string> {
        try {
            const page = await this.pdfjsDoc.getPage(pageNum);
            // Reduced scale for faster rendering (0.2 instead of 0.3)
            const viewport = page.getViewport({ scale: 0.2 });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            // Use lower quality JPEG for faster encoding
            return canvas.toDataURL('image/jpeg', 0.6);
        } catch (error) {
            console.error(`Error rendering page ${pageNum}:`, error);
            return '';
        }
    }

    togglePage(pageIndex: number): void {
        const pages = new Set(this.selectedPages());
        if (pages.has(pageIndex)) {
            pages.delete(pageIndex);
        } else {
            pages.add(pageIndex);
        }
        this.selectedPages.set(pages);
    }

    isPageSelected(pageIndex: number): boolean {
        return this.selectedPages().has(pageIndex);
    }

    selectAll(): void {
        const allPages = new Set<number>();
        for (let i = 0; i < this.totalPages(); i++) {
            allPages.add(i);
        }
        this.selectedPages.set(allPages);
    }

    deselectAll(): void {
        this.selectedPages.set(new Set());
    }

    selectOdd(): void {
        // Select ONLY odd pages (1, 3, 5... which are indices 0, 2, 4...)
        const pages = new Set<number>();
        for (let i = 0; i < this.totalPages(); i += 2) {
            pages.add(i);
        }
        this.selectedPages.set(pages);
    }

    selectEven(): void {
        // Select ONLY even pages (2, 4, 6... which are indices 1, 3, 5...)
        const pages = new Set<number>();
        for (let i = 1; i < this.totalPages(); i += 2) {
            pages.add(i);
        }
        this.selectedPages.set(pages);
    }

    invertSelection(): void {
        const current = this.selectedPages();
        const inverted = new Set<number>();
        for (let i = 0; i < this.totalPages(); i++) {
            if (!current.has(i)) {
                inverted.add(i);
            }
        }
        this.selectedPages.set(inverted);
    }

    // Selection state detection for button highlighting
    isAllSelected(): boolean {
        return this.selectedPages().size === this.totalPages() && this.totalPages() > 0;
    }

    isNoneSelected(): boolean {
        return this.selectedPages().size === 0;
    }

    isOddSelected(): boolean {
        const selected = this.selectedPages();
        if (selected.size === 0) return false;

        // Check if exactly odd pages are selected
        const expectedOddCount = Math.ceil(this.totalPages() / 2);
        if (selected.size !== expectedOddCount) return false;

        for (let i = 0; i < this.totalPages(); i += 2) {
            if (!selected.has(i)) return false;
        }
        return true;
    }

    isEvenSelected(): boolean {
        const selected = this.selectedPages();
        if (selected.size === 0) return false;

        // Check if exactly even pages are selected
        const expectedEvenCount = Math.floor(this.totalPages() / 2);
        if (selected.size !== expectedEvenCount) return false;

        for (let i = 1; i < this.totalPages(); i += 2) {
            if (!selected.has(i)) return false;
        }
        return true;
    }

    applyRange(): void {
        const start = this.rangeStart();
        const end = this.rangeEnd();

        if (start >= 1 && end <= this.totalPages() && start <= end) {
            const pages = new Set(this.selectedPages());
            for (let i = start - 1; i < end; i++) {
                pages.add(i);
            }
            this.selectedPages.set(pages);
            this.status.set(`Added pages ${start} to ${end} to selection.`);
        } else {
            this.status.set('Invalid range. Please check your input.');
        }
    }

    setSplitMode(mode: SplitMode): void {
        this.splitMode.set(mode);
    }

    getModeName(mode: SplitMode): string {
        switch (mode) {
            case 'individual': return 'Individual Pages';
            case 'ranges': return 'Page Ranges';
            case 'equalParts': return 'Equal Parts';
            case 'extractSingle': return 'Extract to Single PDF';
        }
    }

    parseRanges(): number[][] {
        const input = this.rangeInput().trim();
        if (!input) return [];

        const ranges: number[][] = [];
        const parts = input.split(',').map(p => p.trim());

        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n.trim()));
                if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= this.totalPages() && start <= end) {
                    const range: number[] = [];
                    for (let i = start - 1; i < end; i++) {
                        range.push(i);
                    }
                    ranges.push(range);
                }
            } else {
                const page = parseInt(part);
                if (!isNaN(page) && page >= 1 && page <= this.totalPages()) {
                    ranges.push([page - 1]);
                }
            }
        }
        return ranges;
    }

    getEstimatedOutput(): string {
        const mode = this.splitMode();
        const selected = this.selectedPages().size;

        switch (mode) {
            case 'individual':
                return selected > 0 ? `${selected} PDF files` : 'Select pages first';
            case 'ranges':
                const ranges = this.parseRanges();
                return ranges.length > 0 ? `${ranges.length} PDF files` : 'Enter valid ranges';
            case 'equalParts':
                const parts = this.equalParts();
                return parts > 0 ? `${parts} PDF files` : 'Set number of parts';
            case 'extractSingle':
                return selected > 0 ? `1 PDF file with ${selected} pages` : 'Select pages first';
        }
    }

    canSplit(): boolean {
        const mode = this.splitMode();

        if (!this.pdfDoc) return false;

        switch (mode) {
            case 'individual':
            case 'extractSingle':
                return this.selectedPages().size > 0;
            case 'ranges':
                return this.parseRanges().length > 0;
            case 'equalParts':
                return this.equalParts() > 0 && this.equalParts() <= this.totalPages();
        }
    }

    async splitPdf(): Promise<void> {
        if (!this.canSplit()) {
            this.status.set('Cannot split. Check your settings.');
            return;
        }

        this.isProcessing.set(true);
        this.status.set('Splitting PDF...');
        this.splitCompleted.set(false);

        try {
            const mode = this.splitMode();
            const prefix = this.customPrefix() || 'split';
            const pdfFiles: { name: string; bytes: Uint8Array }[] = [];

            switch (mode) {
                case 'individual':
                    await this.splitIndividual(pdfFiles, prefix);
                    break;
                case 'ranges':
                    await this.splitByRanges(pdfFiles, prefix);
                    break;
                case 'equalParts':
                    await this.splitEqualParts(pdfFiles, prefix);
                    break;
                case 'extractSingle':
                    await this.extractToSingle(pdfFiles, prefix);
                    break;
            }

            // Store files for later download (don't auto-download)
            this.pendingFiles.set(pdfFiles);

            // Prepare for tool chaining
            await this.prepareToolChaining(pdfFiles);

            this.status.set(`Success! ${pdfFiles.length} PDF(s) ready.`);
        } catch (error) {
            console.error('Error splitting PDF:', error);
            this.status.set('Error splitting PDF. Please try again.');
        } finally {
            this.isProcessing.set(false);
        }
    }

    private async prepareToolChaining(pdfFiles: { name: string; bytes: Uint8Array }[]): Promise<void> {
        if (pdfFiles.length > 0) {
            const firstFile = pdfFiles[0];
            const blob = new Blob([firstFile.bytes as BlobPart], { type: 'application/pdf' });

            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.lastOutputData.set(reader.result as string);
                    this.lastOutputFileName.set(firstFile.name);
                    this.splitCompleted.set(true);
                    resolve();
                };
                reader.readAsDataURL(blob);
            });
        }
    }

    downloadOutput(): void {
        const pdfFiles = this.pendingFiles();
        if (pdfFiles.length === 0) return;

        if (pdfFiles.length === 1 && !this.downloadAsZip()) {
            const file = pdfFiles[0];
            const blob = new Blob([file.bytes as BlobPart], { type: 'application/pdf' });
            saveAs(blob, file.name);
        } else {
            const zip = new JSZip();
            for (const file of pdfFiles) {
                zip.file(file.name, file.bytes);
            }
            zip.generateAsync({ type: 'blob' }).then((zipBlob: Blob) => {
                saveAs(zipBlob, `${this.customPrefix() || 'split'}_pdfs.zip`);
            });
        }
    }

    private async splitIndividual(pdfFiles: { name: string; bytes: Uint8Array }[], prefix: string): Promise<void> {
        const pageArray = Array.from(this.selectedPages()).sort((a, b) => a - b);

        for (const pageIndex of pageArray) {
            const newPdfDoc = await PDFLib.PDFDocument.create();
            const [copiedPage] = await newPdfDoc.copyPages(this.pdfDoc, [pageIndex]);
            newPdfDoc.addPage(copiedPage);

            const pdfBytes = await newPdfDoc.save();
            pdfFiles.push({
                name: `${prefix}_page_${pageIndex + 1}.pdf`,
                bytes: pdfBytes
            });
        }
    }

    private async splitByRanges(pdfFiles: { name: string; bytes: Uint8Array }[], prefix: string): Promise<void> {
        const ranges = this.parseRanges();

        for (let i = 0; i < ranges.length; i++) {
            const range = ranges[i];
            const newPdfDoc = await PDFLib.PDFDocument.create();
            const copiedPages = await newPdfDoc.copyPages(this.pdfDoc, range);

            for (const page of copiedPages) {
                newPdfDoc.addPage(page);
            }

            const pdfBytes = await newPdfDoc.save();
            const startPage = range[0] + 1;
            const endPage = range[range.length - 1] + 1;
            pdfFiles.push({
                name: `${prefix}_pages_${startPage}-${endPage}.pdf`,
                bytes: pdfBytes
            });
        }
    }

    private async splitEqualParts(pdfFiles: { name: string; bytes: Uint8Array }[], prefix: string): Promise<void> {
        const total = this.totalPages();
        const parts = this.equalParts();
        const pagesPerPart = Math.ceil(total / parts);

        for (let i = 0; i < parts; i++) {
            const start = i * pagesPerPart;
            const end = Math.min(start + pagesPerPart, total);

            if (start >= total) break;

            const pageIndices: number[] = [];
            for (let j = start; j < end; j++) {
                pageIndices.push(j);
            }

            const newPdfDoc = await PDFLib.PDFDocument.create();
            const copiedPages = await newPdfDoc.copyPages(this.pdfDoc, pageIndices);

            for (const page of copiedPages) {
                newPdfDoc.addPage(page);
            }

            const pdfBytes = await newPdfDoc.save();
            pdfFiles.push({
                name: `${prefix}_part_${i + 1}.pdf`,
                bytes: pdfBytes
            });
        }
    }

    private async extractToSingle(pdfFiles: { name: string; bytes: Uint8Array }[], prefix: string): Promise<void> {
        const pageArray = Array.from(this.selectedPages()).sort((a, b) => a - b);
        const newPdfDoc = await PDFLib.PDFDocument.create();
        const copiedPages = await newPdfDoc.copyPages(this.pdfDoc, pageArray);

        for (const page of copiedPages) {
            newPdfDoc.addPage(page);
        }

        const pdfBytes = await newPdfDoc.save();
        pdfFiles.push({
            name: `${prefix}_extracted.pdf`,
            bytes: pdfBytes
        });
    }

    private async downloadFiles(pdfFiles: { name: string; bytes: Uint8Array }[]): Promise<void> {
        // Store first PDF for tool chaining (especially useful for extractSingle mode)
        if (pdfFiles.length > 0) {
            const firstFile = pdfFiles[0];
            const blob = new Blob([firstFile.bytes as BlobPart], { type: 'application/pdf' });

            // Convert to base64 data URL for tool chaining
            const reader = new FileReader();
            reader.onloadend = () => {
                this.lastOutputData.set(reader.result as string);
                this.lastOutputFileName.set(firstFile.name);
                this.splitCompleted.set(true);
            };
            reader.readAsDataURL(blob);
        }

        // For single file output (like extractSingle mode), download directly without ZIP
        if (pdfFiles.length === 1 && !this.downloadAsZip()) {
            const file = pdfFiles[0];
            const blob = new Blob([file.bytes as BlobPart], { type: 'application/pdf' });
            saveAs(blob, file.name);
        } else {
            // Multiple files or ZIP explicitly requested - use ZIP
            const zip = new JSZip();
            for (const file of pdfFiles) {
                zip.file(file.name, file.bytes);
            }
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, `${this.customPrefix() || 'split'}_pdfs.zip`);
        }
    }

    triggerFileInput(): void {
        this.fileInput.nativeElement.click();
    }

    resetTool(): void {
        this.pdfDoc = null;
        this.pdfjsDoc = null;
        this.fileName = '';
        this.totalPages.set(0);
        this.selectedPages.set(new Set());
        this.previews.set([]);
        this.status.set('');
        this.rangeInput.set('');
        this.equalParts.set(2);
        if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
        }
    }
}
