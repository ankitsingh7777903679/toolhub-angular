import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService, ToolInfo } from '../../services/workspace.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-send-to-tool',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="send-to-tool-wrapper" *ngIf="hasOutput">
            <button 
                class="send-btn"
                [class.open]="isOpen"
                [class.btn-small]="size === 'small'"
                (click)="toggleDropdown($event)">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Send to Tool</span>
                <i class="fa-solid fa-chevron-down chevron" [class.rotated]="isOpen"></i>
            </button>

            <div class="dropdown-menu" *ngIf="isOpen">
                <!-- Image Tools Section -->
                <div class="section" *ngIf="imageTools.length > 0">
                    <div class="section-header">
                        <i class="fa-solid fa-image"></i>
                        Image Tools
                    </div>
                    <button 
                        *ngFor="let tool of imageTools"
                        class="tool-item"
                        (click)="selectTool(tool)">
                        <i [class]="tool.icon"></i>
                        <span>{{ tool.name }}</span>
                    </button>
                </div>

                <!-- PDF Tools Section -->
                <div class="section" *ngIf="pdfTools.length > 0">
                    <div class="section-header">
                        <i class="fa-solid fa-file-pdf"></i>
                        PDF Tools
                    </div>
                    <button 
                        *ngFor="let tool of pdfTools"
                        class="tool-item"
                        (click)="selectTool(tool)">
                        <i [class]="tool.icon"></i>
                        <span>{{ tool.name }}</span>
                    </button>
                </div>

                <!-- Cross-category bridges -->
                <div class="section" *ngIf="bridgeTools.length > 0">
                    <div class="section-header">
                        <i class="fa-solid fa-arrow-right-arrow-left"></i>
                        Convert
                    </div>
                    <button 
                        *ngFor="let tool of bridgeTools"
                        class="tool-item"
                        (click)="selectTool(tool)">
                        <i [class]="tool.icon"></i>
                        <span>{{ tool.name }}</span>
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: contents;
        }
        .send-to-tool-wrapper {
            position: relative;
            flex: 1;
        }

        .send-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 12px 20px;
            background: linear-gradient(135deg, #F97316, #FB923C);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);

            &:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
            }

            &.open {
                background: linear-gradient(135deg, #EA580C, #F97316);
            }

            &.btn-small {
                padding: 6px 12px;
                font-size: 12px;
                border-radius: 8px;
                background: linear-gradient(135deg, #F97316, #FB923C); /* Keep gradient or adjust */
                box-shadow: 0 2px 6px rgba(249, 115, 22, 0.2);
            }

            .chevron {
                font-size: 12px;
                transition: transform 0.2s ease;
                
                &.rotated {
                    transform: rotate(180deg);
                }
            }
        }

        .dropdown-menu {
            position: absolute;
            bottom: calc(100% + 8px);
            right: 0;
            width: 260px;
            max-height: 350px;
            overflow-y: auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
            border: 1px solid #E5E7EB;
            z-index: 9999;
            padding: 8px;

            .section {
                &:not(:last-child) {
                    border-bottom: 1px solid #F3F4F6;
                    padding-bottom: 8px;
                    margin-bottom: 8px;
                }
            }

            .section-header {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                font-size: 11px;
                font-weight: 700;
                color: #6B7280;
                text-transform: uppercase;
                letter-spacing: 0.5px;

                i {
                    font-size: 12px;
                }
            }

            .tool-item {
                display: flex;
                align-items: center;
                gap: 12px;
                width: 100%;
                padding: 10px 12px;
                background: none;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 14px;
                color: #374151;
                text-align: left;
                transition: all 0.15s ease;

                &:hover {
                    background: #FFF7ED;
                    color: #F97316;
                }

                i {
                    width: 20px;
                    text-align: center;
                    font-size: 14px;
                }
            }
        }
    `]
})
export class SendToToolComponent {
    @Input() hasOutput: boolean = false;
    @Input() currentRoute: string = '';
    @Input() outputData: string = '';
    @Input() fileName: string = '';
    @Input() fileType: 'image' | 'pdf' = 'image';
    @Input() size: 'normal' | 'small' = 'normal';

    isOpen = false;
    imageTools: ToolInfo[] = [];
    pdfTools: ToolInfo[] = [];
    bridgeTools: ToolInfo[] = [];

    constructor(
        private workspaceService: WorkspaceService,
        private router: Router,
        private elementRef: ElementRef
    ) { }

    ngOnChanges() {
        this.updateAvailableTools();
    }

    toggleDropdown(event: Event) {
        event.stopPropagation();
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.updateAvailableTools();
        }
    }

    updateAvailableTools() {
        // Save current output to workspace first
        if (this.outputData && this.fileName) {
            this.workspaceService.setFile(this.outputData, this.fileName, this.currentRoute, this.fileType);
        }

        // Get all tools from the service
        const allTools = this.workspaceService.allTools;

        // Filter based on current file type and exclude current route
        const availableTools = allTools.filter(tool => {
            // Don't show current tool
            if (tool.route === this.currentRoute) return false;
            // Match file type to tool's accepted type
            if (tool.acceptsType === 'both') return true;
            return tool.acceptsType === this.fileType;
        });

        // Separate by category
        this.imageTools = availableTools.filter(t => t.category === 'image');
        this.pdfTools = availableTools.filter(t => t.category === 'pdf' && t.acceptsType === 'pdf');
        this.bridgeTools = availableTools.filter(t =>
            (t.name === 'Image to PDF' && this.fileType === 'image') ||
            (t.name === 'PDF to Image' && this.fileType === 'pdf')
        );

        // Remove bridge tools from PDF tools list
        this.pdfTools = this.pdfTools.filter(t =>
            t.name !== 'Image to PDF' && t.name !== 'PDF to Image'
        );
    }

    selectTool(tool: ToolInfo) {
        // Save to workspace
        if (this.outputData && this.fileName) {
            this.workspaceService.setFile(this.outputData, this.fileName, this.currentRoute, this.fileType);
        }

        // Navigate to selected tool
        this.isOpen = false;
        this.workspaceService.sendToTool(tool.route);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }
}
