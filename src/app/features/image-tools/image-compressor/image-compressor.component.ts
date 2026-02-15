import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

interface ProcessedFile {
    id: string;
    file: File;
    name: string;
    previewUrl: string;
    compressedUrl: string | null;
    originalSize: number;
    compressedSize: number;
    status: 'pending' | 'compressing' | 'done' | 'error';
    blob?: Blob;
}

@Component({
    selector: 'app-image-compressor',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    templateUrl: './image-compressor.component.html',
    styleUrl: './image-compressor.component.scss'
})
export class ImageCompressorComponent implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    private workspaceService = inject(WorkspaceService);
    private analyticsService = inject(AnalyticsService);
    private seoService = inject(SeoService);

    currentRoute = '/image/compress';

    files: ProcessedFile[] = [];
    isCompressing = false;
    progress = 0;

    // For tool chain - track the first compressed image
    get firstCompressedImage(): string | null {
        const done = this.files.find(f => f.status === 'done');
        return done?.compressedUrl || null;
    }

    get firstFileName(): string {
        const done = this.files.find(f => f.status === 'done');
        return done?.name.replace(/\.[^.]+$/, '_compressed.jpg') || 'compressed.jpg';
    }

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: 'Compress Image Online - Reduce Image Size Free',
            description: 'Compress JPG, PNG, and WebP images online for free. Reduce file size without losing quality. Optimize images for web and speed.',
            keywords: 'compress image, reduce image size, image optimizer, online image compressor, shrink image size, free photo compressor',
            url: 'https://2olhub.netlify.app/image/compress'
        });
        this.seoService.setFaqJsonLd([
            { question: 'Will I actually see a quality difference?', answer: 'At 60% quality and above, most people can\'t tell the difference. Start around 75% and see if it looks good to you.' },
            { question: 'How much smaller will my files get?', answer: 'Photos compress well — expect 60-80% reduction. Flat graphics compress less aggressively, more like 30-50%.' },
            { question: 'Does this change my image\'s resolution or dimensions?', answer: 'No. Compression only affects how pixel data is stored — it doesn\'t resize anything.' },
            { question: 'What formats are supported?', answer: 'JPG, PNG, and WebP. The output stays in whatever format the original was.' },
            { question: 'Is there a limit on how many images I can compress?', answer: 'No limits at all — no file count cap, no size restriction, no daily quota. Completely free and unlimited.' }
        ]);

        // Check if there's an image from another tool
        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'image') {
                this.loadImageFromWorkspace(file.data, file.fileName);
            }
        }
    }

    private loadImageFromWorkspace(dataUrl: string, fileName: string): void {
        // Convert data URL to File object
        fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                this.files.push({
                    id: Math.random().toString(36).substring(7),
                    file: new File([blob], fileName, { type: blob.type }),
                    name: fileName,
                    previewUrl: dataUrl,
                    compressedUrl: null,
                    originalSize: blob.size,
                    compressedSize: 0,
                    status: 'pending'
                });
                this.cdr.detectChanges();
            });
    }

    private _quality = 70;
    get quality(): number {
        return this._quality;
    }
    set quality(value: number) {
        if (this._quality !== value) {
            this._quality = value;
            // Reset all files to pending when quality changes so user can re-compress
            this.files.forEach(f => {
                if (f.status === 'done') {
                    f.status = 'pending';
                    f.compressedUrl = null;
                    f.compressedSize = 0;
                }
            });
            this.cdr.detectChanges();
        }
    }

    get allDone(): boolean {
        return this.files.length > 0 && this.files.every(f => f.status === 'done');
    }

    get totalSaved(): number {
        return this.files.reduce((sum, f) => sum + (f.originalSize - f.compressedSize), 0);
    }

    // Linear estimation: Quality % = Size %
    get estimatedTotalSize(): number {
        const totalOriginal = this.files.reduce((sum, f) => sum + f.originalSize, 0);
        return totalOriginal * (this.quality / 100);
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.handleFiles(Array.from(input.files));
        }
        input.value = '';
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer?.files) {
            const droppedFiles = Array.from(event.dataTransfer.files).filter(file =>
                file.type.startsWith('image/')
            );
            if (droppedFiles.length > 0) {
                this.handleFiles(droppedFiles);
            }
        }
    }

    private handleFiles(newFiles: File[]): void {
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.files.push({
                    id: Math.random().toString(36).substring(7),
                    file: file,
                    name: file.name,
                    previewUrl: e.target?.result as string,
                    compressedUrl: null,
                    originalSize: file.size,
                    compressedSize: 0,
                    status: 'pending'
                });
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        });
    }

    async compressAll(): Promise<void> {
        if (this.isCompressing) return;
        this.isCompressing = true;
        this.progress = 0;
        this.cdr.detectChanges();

        const total = this.files.length;
        let completed = 0;

        for (const fileItem of this.files) {
            if (fileItem.status === 'done') {
                completed++;
                continue;
            }

            fileItem.status = 'compressing';
            this.cdr.detectChanges();

            try {
                const result = await this.compressImage(fileItem.previewUrl, fileItem.file.type);
                fileItem.compressedUrl = result.dataUrl;
                fileItem.blob = result.blob;
                fileItem.compressedSize = result.blob.size;
                fileItem.status = 'done';
            } catch (error) {
                console.error('Compression failed for', fileItem.name, error);
                fileItem.status = 'error';
            }

            completed++;
            this.progress = Math.round((completed / total) * 100);
            this.cdr.detectChanges();
        }

        this.isCompressing = false;
        this.cdr.detectChanges();

        // Track tool usage (count once per batch)
        if (this.allDone) {
            this.analyticsService.trackToolUsage('image-compress', 'Compress Image', 'image');
        }
    }

    private compressImage(src: string, mimeType: string): Promise<{ dataUrl: string, blob: Blob }> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Canvas context not supported'));
                        return;
                    }

                    // Fill white background for PNG transparency
                    if (mimeType === 'image/png') {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }

                    ctx.drawImage(img, 0, 0);

                    const qualityValue = this.quality / 100;
                    // Always output as JPEG for better compression
                    const outputType = 'image/jpeg';
                    const dataUrl = canvas.toDataURL(outputType, qualityValue);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve({ dataUrl, blob });
                        } else {
                            reject(new Error('Blob creation failed'));
                        }
                    }, outputType, qualityValue);
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            if (src.startsWith('data:')) img.crossOrigin = '';
            img.src = src;
        });
    }

    formatSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    getSavingsPercent(file: ProcessedFile): number {
        if (file.originalSize === 0) return 0;
        return Math.round((1 - file.compressedSize / file.originalSize) * 100);
    }

    downloadOne(file: ProcessedFile): void {
        if (file.blob) {
            const url = URL.createObjectURL(file.blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name.replace(/\.[^.]+$/, '_compressed.jpg');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }

    downloadAll(): void {
        this.files.forEach(file => {
            if (file.status === 'done') this.downloadOne(file);
        });
    }

    removeFile(id: string): void {
        this.files = this.files.filter(f => f.id !== id);
    }

    clearAll(): void {
        this.files = [];
        this.progress = 0;
        this.isCompressing = false;
    }
}
