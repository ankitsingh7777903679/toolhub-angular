import { Component } from '@angular/core';
import { AiWriterComponent } from '../shared/ai-writer/ai-writer.component';

@Component({
    selector: 'app-cold-email',
    standalone: true,
    imports: [AiWriterComponent],
    template: `
        <app-ai-writer [config]="config"></app-ai-writer>
    `
})
export class ColdEmailComponent {
    config = {
        promptType: 'coldEmail',
        title: 'AI Cold Email Generator',
        subtitle: 'Let AI generate professional cold emails for outreach',
        placeholder: 'Describe the cold email you need... e.g., "Write a cold email to a tech company introducing myself as a frontend developer looking for opportunities"',
        showParagraphs: false,
        iconClass: 'fa-solid fa-envelope',
        iconColor: '#EC4899',
        bgColor: '#FDF2F8'
    };
}
