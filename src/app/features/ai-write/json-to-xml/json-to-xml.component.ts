import { Component, inject } from '@angular/core';
import { SeoService } from '../../../core/services/seo.service';
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
  private seoService = inject(SeoService);

  constructor() {
    this.seoService.updateSeo({
      title: 'Free JSON to XML Converter - Convert Data Instantly',
      description: 'Convert JSON data to valid XML format instantly with our free online tool. Perfect for developers, data analysts, and system integration.',
      keywords: 'json to xml converter, convert json to xml, json to xml tool, json xml conversion, free json to xml, online json to xml, developer tools, data format converter',
      url: 'https://2olhub.netlify.app/write/json-to-xml'
    });
    this.seoService.setFaqJsonLd([
      { question: 'Is the XML output actually valid?', answer: 'Yes — it generates syntactically correct, well-formed XML based on your JSON structure. You can paste it directly into your code or API testing tool.' },
      { question: 'Can it handle deeply nested JSON?', answer: 'Absolutely. It recursively processes nested objects and arrays, creating the corresponding XML hierarchy with proper parent-child tag relationships.' },
      { question: 'Does it store my data?', answer: 'No. The conversion happens in real-time and nothing is saved. We don\'t log your JSON or the resulting XML.' }
    ]);
  }

  config = {
    promptType: 'jsonToXml',
    title: 'JSON to XML Converter',
    subtitle: 'Convert JSON data to valid XML format using AI',
    placeholder: 'Paste your JSON data here... e.g., {"name": "John", "age": 30, "city": "New York"}',
    showParagraphs: false,
    iconClass: 'fa-solid fa-code',
    iconColor: '#64748B',
    bgColor: '#F8FAFC',
    // SEO Content
    seoTitle: 'JSON to XML Converter — Because Legacy Systems Still Exist',
    seoIntro: 'You have JSON. The API you\'re integrating with wants XML. It\'s 2024 and this is still a thing. Paste your JSON in, get properly formatted XML out. Handles nested objects, arrays, attributes — the works.',
    features: [
      { icon: 'fa-solid fa-code', title: 'Clean XML Output', description: 'Properly indented, valid syntax every time.' },
      { icon: 'fa-solid fa-bolt', title: 'Instant Conversion', description: 'Even large JSON objects convert in seconds.' },
      { icon: 'fa-solid fa-check-double', title: 'Preserves Structure', description: 'Nested objects and arrays map correctly to XML tags.' },
      { icon: 'fa-solid fa-copy', title: 'One-Click Copy', description: 'Grab the XML and paste it where you need it.' },
      { icon: 'fa-solid fa-shield-halved', title: 'Stays Private', description: 'Your data is processed securely — nothing stored.' },
      { icon: 'fa-solid fa-laptop-code', title: 'Dev Workflow Friendly', description: 'Perfect for quick API integration tasks.' }
    ],
    useCases: [
      'Integrating with SOAP APIs that require XML when your app uses JSON',
      'Converting API responses for systems that only read XML formats',
      'Testing and debugging XML-based web services during development',
      'Quick one-off format conversions without writing a script'
    ],
    faqs: [
      { question: 'Is the XML output actually valid?', answer: 'Yes — it generates syntactically correct, well-formed XML based on your JSON structure. You can paste it directly into your code or API testing tool.' },
      { question: 'Can it handle deeply nested JSON?', answer: 'Absolutely. It recursively processes nested objects and arrays, creating the corresponding XML hierarchy with proper parent-child tag relationships.' },
      { question: 'Does it store my data?', answer: 'No. The conversion happens in real-time and nothing is saved. We don\'t log your JSON or the resulting XML.' }
    ]
  };
}
