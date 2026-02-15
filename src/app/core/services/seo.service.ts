import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
    title: string;
    description: string;
    image?: string;
    url?: string;
    keywords?: string;
    type?: 'website' | 'article';
}

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private readonly defaultImage = 'https://2olhub.netlify.app/assets/og-image.jpg';
    private readonly siteName = '2olhub';

    constructor(
        private titleService: Title,
        private metaService: Meta,
        @Inject(DOCUMENT) private doc: Document
    ) { }

    updateSeo(config: SeoConfig): void {
        // 1. Set Title
        const fullTitle = `${config.title} | ${this.siteName}`;
        this.titleService.setTitle(fullTitle);

        // 2. Set Meta Description
        this.setMeta('description', config.description);

        // 3. Set Keywords (Optional but good)
        if (config.keywords) {
            this.setMeta('keywords', config.keywords);
        }

        // 4. Open Graph (Facebook/LinkedIn)
        this.setMeta('og:title', config.title, 'property');
        this.setMeta('og:description', config.description, 'property');
        this.setMeta('og:image', config.image || this.defaultImage, 'property');
        this.setMeta('og:url', config.url || this.doc.URL, 'property');
        this.setMeta('og:type', config.type || 'website', 'property');
        this.setMeta('og:site_name', this.siteName, 'property');

        // 5. Twitter Card
        this.setMeta('twitter:card', 'summary_large_image', 'property');
        this.setMeta('twitter:title', config.title, 'property');
        this.setMeta('twitter:description', config.description, 'property');
        this.setMeta('twitter:image', config.image || this.defaultImage, 'property');

        // 6. Canonical URL
        this.setCanonicalUrl(config.url || this.doc.URL);
    }

    private setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
        // Remove old tag if exists to prevent duplicates
        this.metaService.removeTag(`${attribute}="${name}"`);
        // Add new tag
        this.metaService.addTag({ [attribute]: name, content });
    }

    private setCanonicalUrl(url: string): void {
        let link: HTMLLinkElement | null = this.doc.querySelector("link[rel='canonical']");
        if (!link) {
            link = this.doc.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.doc.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }

    setJsonLd(data: object): void {
        // Remove existing JSON-LD script if any
        const existing = this.doc.querySelector('script[type="application/ld+json"]');
        if (existing) {
            existing.remove();
        }

        const script = this.doc.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data);
        this.doc.head.appendChild(script);
    }

    setFaqJsonLd(faqs: { question: string; answer: string }[]): void {
        this.setJsonLd({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                }
            }))
        });
    }
}
