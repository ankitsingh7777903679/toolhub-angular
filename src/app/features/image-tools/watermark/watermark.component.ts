import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';

declare const saveAs: any;

@Component({
    selector: 'app-watermark',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    templateUrl: './watermark.component.html',
    styleUrl: './watermark.component.scss'
})
export class WatermarkComponent implements OnInit {
    private cdr: ChangeDetectorRef;
    private workspaceService: WorkspaceService;
    currentRoute = '/image/watermark';

    // Input image
    originalImage: string | null = null;
    originalFileName = '';

    // Watermark settings
    watermarkType: 'text' | 'image' = 'text';

    // Text watermark options
    watermarkText = 'Watermark';
    textColor = '#ffffff';
    textOpacity = 50;
    fontSize = 48;
    fontFamily = 'Arial';
    textPosition: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile' = 'bottom-right';

    // Image watermark
    watermarkImage: string | null = null;
    imageOpacity = 50;
    imageScale = 30;
    imagePosition: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile' = 'bottom-right';

    // Result
    resultImage: string | null = null;
    isProcessing = false;

    constructor(cdr: ChangeDetectorRef, workspaceService: WorkspaceService) {
        this.cdr = cdr;
        this.workspaceService = workspaceService;
    }

    ngOnInit(): void {
        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'image') {
                this.originalImage = file.data;
                this.originalFileName = file.fileName;
                this.cdr.detectChanges();
            }
        }
    }

    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            this.loadImage(input.files[0]);
        }
        input.value = '';
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer?.files?.[0]) {
            this.loadImage(event.dataTransfer.files[0]);
        }
    }

    private loadImage(file: File): void {
        if (!file.type.startsWith('image/')) return;
        this.originalFileName = file.name;
        this.resultImage = null;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.originalImage = e.target.result;
            this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
    }

    onWatermarkImageSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.watermarkImage = e.target.result;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(input.files[0]);
        }
        input.value = '';
    }

    async applyWatermark(): Promise<void> {
        if (!this.originalImage) return;
        this.isProcessing = true;

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // Load main image
            const img = await this.loadImageElement(this.originalImage);
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            if (this.watermarkType === 'text') {
                await this.applyTextWatermark(ctx, canvas.width, canvas.height);
            } else if (this.watermarkImage) {
                await this.applyImageWatermark(ctx, canvas.width, canvas.height);
            }

            this.resultImage = canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Error applying watermark:', error);
            alert('Failed to apply watermark');
        } finally {
            this.isProcessing = false;
            this.cdr.detectChanges();
        }
    }

    private async applyTextWatermark(ctx: CanvasRenderingContext2D, w: number, h: number): Promise<void> {
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.fillStyle = this.hexToRgba(this.textColor, this.textOpacity / 100);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (this.textPosition === 'tile') {
            // Tile pattern
            const metrics = ctx.measureText(this.watermarkText);
            const textWidth = metrics.width + 50;
            const textHeight = this.fontSize + 30;

            ctx.save();
            ctx.rotate(-Math.PI / 6);
            for (let y = -h; y < h * 2; y += textHeight) {
                for (let x = -w; x < w * 2; x += textWidth) {
                    ctx.fillText(this.watermarkText, x, y);
                }
            }
            ctx.restore();
        } else {
            const pos = this.getPosition(this.textPosition, w, h, 50);
            ctx.fillText(this.watermarkText, pos.x, pos.y);
        }
    }

    private async applyImageWatermark(ctx: CanvasRenderingContext2D, w: number, h: number): Promise<void> {
        if (!this.watermarkImage) return;

        const wmImg = await this.loadImageElement(this.watermarkImage);
        const scale = this.imageScale / 100;
        const wmWidth = wmImg.width * scale;
        const wmHeight = wmImg.height * scale;

        ctx.globalAlpha = this.imageOpacity / 100;

        if (this.imagePosition === 'tile') {
            for (let y = 0; y < h; y += wmHeight + 20) {
                for (let x = 0; x < w; x += wmWidth + 20) {
                    ctx.drawImage(wmImg, x, y, wmWidth, wmHeight);
                }
            }
        } else {
            const pos = this.getPosition(this.imagePosition, w, h, Math.max(wmWidth, wmHeight) / 2);
            ctx.drawImage(wmImg, pos.x - wmWidth / 2, pos.y - wmHeight / 2, wmWidth, wmHeight);
        }

        ctx.globalAlpha = 1;
    }

    private getPosition(position: string, w: number, h: number, margin: number): { x: number, y: number } {
        switch (position) {
            case 'top-left': return { x: margin, y: margin };
            case 'top-right': return { x: w - margin, y: margin };
            case 'bottom-left': return { x: margin, y: h - margin };
            case 'bottom-right': return { x: w - margin, y: h - margin };
            default: return { x: w / 2, y: h / 2 };
        }
    }

    private loadImageElement(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    private hexToRgba(hex: string, alpha: number): string {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    getOutputFileName(): string {
        return this.originalFileName.replace(/\.[^/.]+$/, '') + '_watermarked.png';
    }

    downloadResult(): void {
        if (!this.resultImage) return;

        const link = document.createElement('a');
        link.href = this.resultImage;
        link.download = this.getOutputFileName();
        link.click();
    }

    reset(): void {
        this.originalImage = null;
        this.resultImage = null;
        this.originalFileName = '';
        this.watermarkImage = null;
    }
}
