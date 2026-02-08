import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

declare const saveAs: any;

@Component({
    selector: 'app-rotate-image',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    templateUrl: './rotate-image.component.html'
})
export class RotateImageComponent implements OnInit {
    originalImage: string | null = null;
    rotatedImage: string | null = null;
    originalFileName = '';
    currentRoute = '/image/rotate';

    // Rotation settings
    rotationAngle = 0;
    flipHorizontal = false;
    flipVertical = false;

    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private originalImg: HTMLImageElement | null = null;

    constructor(
        private cdr: ChangeDetectorRef,
        private workspaceService: WorkspaceService,
        private scriptLoader: ScriptLoaderService,
        private analyticsService: AnalyticsService,
        private seoService: SeoService
    ) { }

    async ngOnInit(): Promise<void> {
        this.seoService.updateSeo({
            title: 'Rotate Image Online - Free Photo Rotator',
            description: 'Rotate images online for free. Rotate JPG, PNG, and WebP images 90 degrees left or right. Fix image orientation instantly.',
            keywords: 'rotate image, online photo rotator, rotate picture, change image orientation, free image rotator, flip image',
            url: 'https://2olhub.netlify.app/image/rotate'
        });

        await this.scriptLoader.load(['file-saver']);

        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'image') {
                this.loadImageFromData(file.data, file.fileName);
            }
        }
    }

    getOutputFileName(): string {
        return this.originalFileName.replace(/\.[^/.]+$/, '') + '_rotated.png';
    }

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.handleFile(input.files[0]);
        }
        input.value = '';
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer?.files[0]) {
            this.handleFile(event.dataTransfer.files[0]);
        }
    }

    handleFile(file: File) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        this.originalFileName = file.name;
        this.rotationAngle = 0;
        this.flipHorizontal = false;
        this.flipVertical = false;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.loadImageFromData(e.target.result, file.name);
        };
        reader.readAsDataURL(file);
    }

    private loadImageFromData(data: string, fileName: string) {
        this.originalImage = data;
        this.originalFileName = fileName;

        // Load image for canvas manipulation
        this.originalImg = new Image();
        this.originalImg.onload = () => {
            this.applyTransform();
            this.cdr.detectChanges();
        };
        this.originalImg.src = data;
    }

    rotate(degrees: number) {
        this.rotationAngle = (this.rotationAngle + degrees) % 360;
        if (this.rotationAngle < 0) this.rotationAngle += 360;
        this.applyTransform();
    }

    setRotation(angle: number) {
        this.rotationAngle = angle;
        this.applyTransform();
    }

    toggleFlipHorizontal() {
        this.flipHorizontal = !this.flipHorizontal;
        this.applyTransform();
    }

    toggleFlipVertical() {
        this.flipVertical = !this.flipVertical;
        this.applyTransform();
    }

    private applyTransform() {
        if (!this.originalImg) return;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        const img = this.originalImg;
        const radians = (this.rotationAngle * Math.PI) / 180;

        // Calculate new dimensions for rotated image
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));
        const newWidth = Math.floor(img.width * cos + img.height * sin);
        const newHeight = Math.floor(img.width * sin + img.height * cos);

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        // Move to center
        this.ctx.translate(newWidth / 2, newHeight / 2);

        // Apply rotation
        this.ctx.rotate(radians);

        // Apply flips
        const scaleX = this.flipHorizontal ? -1 : 1;
        const scaleY = this.flipVertical ? -1 : 1;
        this.ctx.scale(scaleX, scaleY);

        // Draw image centered
        this.ctx.drawImage(img, -img.width / 2, -img.height / 2);

        // Convert to data URL
        this.rotatedImage = this.canvas.toDataURL('image/png');
        this.cdr.detectChanges();
    }

    resetTransform() {
        this.rotationAngle = 0;
        this.flipHorizontal = false;
        this.flipVertical = false;
        this.applyTransform();
    }

    downloadRotated() {
        if (!this.rotatedImage) return;

        const base64Data = this.rotatedImage.replace(/^data:image\/\w+;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        const fileName = this.getOutputFileName();
        saveAs(blob, fileName);
        this.analyticsService.trackToolUsage('rotate-image', 'Rotate Image', 'image');
    }

    reset() {
        this.originalImage = null;
        this.rotatedImage = null;
        this.originalFileName = '';
        this.rotationAngle = 0;
        this.flipHorizontal = false;
        this.flipVertical = false;
        this.originalImg = null;
    }
}
