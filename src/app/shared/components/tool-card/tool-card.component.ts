import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Tool {
    _id: string;
    name: string;
    description: string;
    iconClass: string;
    iconColor: string;
    bgIconColor: string;
    link: string;
    category: string;
}

@Component({
    selector: 'app-tool-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './tool-card.component.html',
    styleUrl: './tool-card.component.scss'
})
export class ToolCardComponent {
    @Input() tool!: Tool;
}
