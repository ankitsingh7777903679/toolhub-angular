import { Component } from '@angular/core';
import { AiWriterComponent } from '../shared/ai-writer/ai-writer.component';

@Component({
  selector: 'app-json-to-xml',
  standalone: true,
  imports: [AiWriterComponent],
  template: `
        <app-ai-writer [config]="config"></app-ai-writer>
    `
})
export class JsonToXmlComponent {
  config = {
    promptType: 'jsonToXml',
    title: 'JSON to XML Converter',
    subtitle: 'Convert JSON data to valid XML format using AI',
    placeholder: 'Paste your JSON data here... e.g., {"name": "John", "age": 30, "city": "New York"}',
    showParagraphs: false,
    iconClass: 'fa-solid fa-code',
    iconColor: '#64748B',
    bgColor: '#F8FAFC'
  };
}
