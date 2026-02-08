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
    seoTitle: 'Free JSON to XML Converter - Online Data Transformation',
    seoIntro: 'Effortlessly convert JSON objects to XML format. Our AI-powered tool ensures valid schema generation and accurate data transformation for your development needs.',
    features: [
      { icon: 'fa-solid fa-code', title: 'Valid XML', description: 'Generates properly formatted XML syntax.' },
      { icon: 'fa-solid fa-bolt', title: 'Instant', description: 'Convert large JSON objects in seconds.' },
      { icon: 'fa-solid fa-check-double', title: 'Accurate', description: 'Preserves data structure and types.' },
      { icon: 'fa-solid fa-copy', title: 'Easy Copy', description: 'One-click copy to clipboard.' },
      { icon: 'fa-solid fa-shield-halved', title: 'Secure', description: 'Data processing happens securely.' },
      { icon: 'fa-solid fa-laptop-code', title: 'Dev Friendly', description: 'Perfect for API integrations.' }
    ],
    useCases: [
      'Converting API responses for legacy systems',
      'Data format transformation for integration',
      'Debugging and testing XML services',
      'Quick data structure conversion'
    ],
    faqs: [
      { question: 'Is the XML valid?', answer: 'Yes, the tool generates syntacticly correct XML based on your JSON input.' },
      { question: 'Does it support nested JSON?', answer: 'Absolutely. It recursively processes nested objects and arrays into appropriate XML tags.' },
      { question: 'Is my data saved?', answer: 'No, validation and conversion happen in real-time and we do not store your data.' }
    ]
  };
}
