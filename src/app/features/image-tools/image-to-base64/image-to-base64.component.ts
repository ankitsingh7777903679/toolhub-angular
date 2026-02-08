import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SeoService } from '../../../core/services/seo.service';

interface ProcessedFile {
    id: string;
    file: File;
    name: string;
    previewUrl: string;
    base64: string | null;
    status: 'pending' | 'converting' | 'done' | 'error';
}

@Component({
    selector: 'app-image-to-base64',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './image-to-base64.component.html',
    styleUrl: './image-to-base64.component.scss'
})
export class ImageToBase64Component implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    private workspaceService = inject(WorkspaceService);
    private seoService = inject(SeoService);

    files: ProcessedFile[] = [];
    isConverting = false;
    progress = 0;
    includeDataUri = true;

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: 'Image to Base64 Converter - Online Encoding Tool',
            description: 'Convert images to Base64 strings online. Encode JPG, PNG, GIF files to Base64 format for HTML and CSS use.',
            keywords: 'image to base64, base64 encoder, convert image to text, online base64 converter, data uri generator',
            url: 'https://2olhub.netlify.app/image/to-base64'
        });
        this.checkWorkspace();
    }

    private checkWorkspace(): void {
        const file = this.workspaceService.getFile();
        if (file && file.fileType === 'image') {
            // Convert base64/dataURL to File object
            fetch(file.data)
                .then(res => res.blob())
                .then(blob => {
                    const newFile = new File([blob], file.fileName, { type: file.mimeType });
                    this.files.push({
                        id: Math.random().toString(36).substring(7),
                        file: newFile,
                        name: file.fileName,
                        previewUrl: file.data, // Already have the data URL
                        base64: null,
                        status: 'pending'
                    });
                    this.cdr.detectChanges();
                    // Optional: Clear workspace after consuming, or leave it. 
                    // Usually better to leave it until user explicitly clears or navigates away? 
                    // But other tools don't auto-clear? Actually 'Enhance' etc probably just use it.
                    // Since we copied it into our local state, safe to leave workspace alone.
                });
        }
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
                const base64Full = e.target?.result as string;
                this.files.push({
                    id: Math.random().toString(36).substring(7),
                    file: file,
                    name: file.name,
                    previewUrl: base64Full,
                    base64: null,
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
                if (this.includeDataUri) {
                    fileItem.base64 = fileItem.previewUrl;
                } else {
                    // Remove data:image/xxx;base64, prefix
                    fileItem.base64 = fileItem.previewUrl.split(',')[1];
                }
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

    copyToClipboard(file: ProcessedFile): void {
        if (file.base64) {
            navigator.clipboard.writeText(file.base64).then(() => {
                alert('Copied to clipboard!');
            });
        }
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
