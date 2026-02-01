import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';

interface ProcessedFile {
    id: string;
    file: File;
    name: string;
    previewUrl: string;
    convertedUrl: string | null;
    status: 'pending' | 'converting' | 'done' | 'error';
    blob?: Blob;
}

@Component({
    selector: 'app-png-to-jpg',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    templateUrl: './png-to-jpg.component.html',
    styleUrl: './png-to-jpg.component.scss'
})
export class PngToJpgComponent implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    private workspaceService = inject(WorkspaceService);

    currentRoute = '/image/png-to-jpg';

    files: ProcessedFile[] = [];
    isConverting = false;
    progress = 0;
    quality = 90;

    // For tool chain
    get firstConvertedImage(): string | null {
        const done = this.files.find(f => f.status === 'done');
        return done?.convertedUrl || null;
    }

    get firstFileName(): string {
        const done = this.files.find(f => f.status === 'done');
        return done?.name || 'converted.jpg';
    }

    ngOnInit(): void {
        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'image') {
                this.loadImageFromWorkspace(file.data, file.fileName);
            }
        }
    }

    private loadImageFromWorkspace(dataUrl: string, fileName: string): void {
        fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                this.files.push({
                    id: Math.random().toString(36).substring(7),
                    file: new File([blob], fileName, { type: blob.type }),
                    name: fileName.replace(/\.[^.]+$/i, '.jpg'),
                    previewUrl: dataUrl,
                    convertedUrl: null,
                    status: 'pending'
                });
                this.cdr.detectChanges();
            });
    }

    get allDone(): boolean {
        return this.files.length > 0 && this.files.every(f => f.status === 'done');
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
                file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')
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
                    name: file.name.replace(/\.png$/i, '.jpg'),
                    previewUrl: e.target?.result as string,
                    convertedUrl: null,
                    status: 'pending'
                });
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        });
    }

    async convertAll(): Promise<void> {
        if (this.isConverting) return;
        this.isConverting = true;
        this.progress = 0;
        this.cdr.detectChanges();

        const total = this.files.length;
        let completed = 0;

        for (const fileItem of this.files) {
            if (fileItem.status === 'done') {
                completed++;
                continue;
            }

            fileItem.status = 'converting';
            this.cdr.detectChanges();

            try {
                const result = await this.convertPngToJpg(fileItem.previewUrl);
                fileItem.convertedUrl = result.dataUrl;
                fileItem.blob = result.blob;
                fileItem.status = 'done';
            } catch (error) {
                console.error('Conversion failed for', fileItem.name, error);
                fileItem.status = 'error';
            }

            completed++;
            this.progress = Math.round((completed / total) * 100);
            this.cdr.detectChanges();
        }

        this.isConverting = false;
        this.cdr.detectChanges();
    }

    private convertPngToJpg(src: string): Promise<{ dataUrl: string, blob: Blob }> {
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
                    // Fill white background for transparency
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);

                    const qualityValue = this.quality / 100;
                    const dataUrl = canvas.toDataURL('image/jpeg', qualityValue);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve({ dataUrl, blob });
                        } else {
                            reject(new Error('Blob creation failed'));
                        }
                    }, 'image/jpeg', qualityValue);
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            if (src.startsWith('data:')) img.crossOrigin = '';
            img.src = src;
        });
    }

    downloadOne(file: ProcessedFile): void {
        if (file.blob) {
            const url = URL.createObjectURL(file.blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
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
        this.isConverting = false;
    }
}
