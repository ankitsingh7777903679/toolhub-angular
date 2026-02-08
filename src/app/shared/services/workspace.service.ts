import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

export interface WorkspaceFile {
    data: string;          // Base64 data URL
    fileName: string;
    fileType: 'image' | 'pdf';
    mimeType: string;
    source: string;        // Which tool created this
    timestamp: number;
}

export interface ToolInfo {
    name: string;
    route: string;
    icon: string;
    category: 'image' | 'pdf';
    acceptsType: 'image' | 'pdf' | 'both';
    outputType: 'image' | 'pdf' | 'text';
}

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
    private currentFile$ = new BehaviorSubject<WorkspaceFile | null>(null);
    private history: WorkspaceFile[] = [];

    // All available tools
    readonly allTools: ToolInfo[] = [
        // Image Tools
        { name: 'Resize Image', route: '/image/resize', icon: 'fa-solid fa-expand', category: 'image', acceptsType: 'image', outputType: 'image' },
        { name: 'Crop Image', route: '/image/crop', icon: 'fa-solid fa-crop', category: 'image', acceptsType: 'image', outputType: 'image' },
        { name: 'Compress Image', route: '/image/compress', icon: 'fa-solid fa-compress', category: 'image', acceptsType: 'image', outputType: 'image' },
        { name: 'PNG to JPG', route: '/image/png-to-jpg', icon: 'fa-solid fa-file-image', category: 'image', acceptsType: 'image', outputType: 'image' },
        { name: 'JPG to PNG', route: '/image/jpg-to-png', icon: 'fa-solid fa-file-image', category: 'image', acceptsType: 'image', outputType: 'image' },
        { name: 'WebP to JPG', route: '/image/webp-to-jpg', icon: 'fa-solid fa-file-image', category: 'image', acceptsType: 'image', outputType: 'image' },
        { name: 'Remove Background', route: '/image/remove-bg', icon: 'fa-solid fa-eraser', category: 'image', acceptsType: 'image', outputType: 'image' },
        { name: 'Enhance Image', route: '/image/enhance', icon: 'fa-solid fa-wand-magic-sparkles', category: 'image', acceptsType: 'image', outputType: 'image' },
        { name: 'Add Watermark', route: '/image/watermark', icon: 'fa-solid fa-droplet', category: 'image', acceptsType: 'image', outputType: 'image' },
        { name: 'Blur Image', route: '/image/blur', icon: 'fa-solid fa-eye-low-vision', category: 'image', acceptsType: 'image', outputType: 'image' },
        { name: 'Image to Base64', route: '/image/to-base64', icon: 'fa-solid fa-code', category: 'image', acceptsType: 'image', outputType: 'text' },

        // PDF Tools

        { name: 'Merge PDF', route: '/pdf/merge', icon: 'fa-solid fa-object-group', category: 'pdf', acceptsType: 'pdf', outputType: 'pdf' },
        { name: 'Split PDF', route: '/pdf/split', icon: 'fa-solid fa-scissors', category: 'pdf', acceptsType: 'pdf', outputType: 'pdf' },
        { name: 'Compress PDF', route: '/pdf/compress', icon: 'fa-solid fa-compress', category: 'pdf', acceptsType: 'pdf', outputType: 'pdf' },
        { name: 'Rotate PDF', route: '/pdf/rotate', icon: 'fa-solid fa-rotate', category: 'pdf', acceptsType: 'pdf', outputType: 'pdf' },
        { name: 'Watermark PDF', route: '/pdf/watermark', icon: 'fa-solid fa-droplet', category: 'pdf', acceptsType: 'pdf', outputType: 'pdf' },
        { name: 'Protect PDF', route: '/pdf/protect', icon: 'fa-solid fa-lock', category: 'pdf', acceptsType: 'pdf', outputType: 'pdf' },
        { name: 'Unlock PDF', route: '/pdf/unlock', icon: 'fa-solid fa-lock-open', category: 'pdf', acceptsType: 'pdf', outputType: 'pdf' },

        // Cross-category bridges
        { name: 'Image to PDF', route: '/pdf/img-to-pdf', icon: 'fa-solid fa-file-pdf', category: 'pdf', acceptsType: 'image', outputType: 'pdf' },
        { name: 'PDF to Image', route: '/pdf/to-image', icon: 'fa-solid fa-image', category: 'pdf', acceptsType: 'pdf', outputType: 'image' },
        { name: 'Word to PDF', route: '/pdf/word-to-pdf', icon: 'fa-solid fa-file-word', category: 'pdf', acceptsType: 'both', outputType: 'pdf' },
        { name: 'Image to Excel', route: '/file/image-to-excel', icon: 'fa-solid fa-file-excel', category: 'image', acceptsType: 'both', outputType: 'text' },
    ];

    constructor(private router: Router) { }

    // Set current working file
    setFile(data: string, fileName: string, source: string, fileType: 'image' | 'pdf' = 'image'): void {
        const mimeType = this.detectMimeType(data);
        const file: WorkspaceFile = {
            data,
            fileName,
            fileType,
            mimeType,
            source,
            timestamp: Date.now()
        };

        this.currentFile$.next(file);
        this.history.push(file);
    }

    // Get current file
    getFile(): WorkspaceFile | null {
        return this.currentFile$.value;
    }

    // Get file observable for reactive updates
    getFileObservable() {
        return this.currentFile$.asObservable();
    }

    // Check if workspace has a file
    hasFile(): boolean {
        return this.currentFile$.value !== null;
    }

    // Get available tools based on current file type
    getAvailableTools(currentRoute: string): ToolInfo[] {
        const file = this.currentFile$.value;
        if (!file) return [];

        return this.allTools.filter(tool => {
            // Don't show current tool
            if (tool.route === currentRoute) return false;

            // Match file type to tool's accepted type
            if (tool.acceptsType === 'both') return true;
            return tool.acceptsType === file.fileType;
        });
    }

    // Navigate to another tool
    sendToTool(toolRoute: string): void {
        this.router.navigate([toolRoute]);
    }

    // Clear workspace
    clear(): void {
        this.currentFile$.next(null);
        this.history = [];
    }

    // Clear just the current file (keep history)
    clearCurrent(): void {
        this.currentFile$.next(null);
    }

    // Get history
    getHistory(): WorkspaceFile[] {
        return [...this.history];
    }

    // Detect MIME type from data URL
    private detectMimeType(dataUrl: string): string {
        const match = dataUrl.match(/^data:([^;]+);/);
        return match ? match[1] : 'application/octet-stream';
    }
}
