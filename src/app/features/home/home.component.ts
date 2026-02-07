import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToolCardComponent, Tool } from '../../shared/components/tool-card/tool-card.component';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';

interface Category {
    id: string;
    name: string;
    subtitle: string;
    color: string;
    bgColor: string;
    icon: string;
    toolCount: string;
    featuredTool: string;
    featuredTool2: string;
    link: string;
}

interface FaqItem {
    question: string;
    answer: string;
    isOpen: boolean;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, ToolCardComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    private apiService = inject(ApiService);
    private router = inject(Router);
    private seoService = inject(SeoService);

    searchQuery = '';
    activeCategory = 'all';
    tools: Tool[] = [];
    filteredTools: Tool[] = [];
    searchResults: Tool[] = [];


    displayedTools: Tool[] = [];
    showAll = false;

    // FAQ Data
    faqs: FaqItem[] = [
        {
            question: "Is 2olhub completely free to use?",
            answer: "Most of our tools are 100% free and unlimited for everyone. We also offer specific premium tools and features for power users who need advanced capabilities, higher limits, and priority processing.",
            isOpen: true
        },
        {
            question: "Do you store my uploaded files?",
            answer: "No, we prioritize your privacy. Most files are processed directly in your browser. For server-side tools, your files are deleted immediately after processing. We do not store or share your content.",
            isOpen: false
        },
        {
            question: "How can I suggest a new tool?",
            answer: "We love community feedback! You can visit our Feedback page to suggest new tools or vote on existing requests. We regularly build tools based on user demand.",
            isOpen: false
        },
        {
            question: "Is my data secure?",
            answer: "Yes. We use industry-standard encryption for data transfer. Since we don't store your files, the risk of data breach is minimized by design.",
            isOpen: false
        },
        {
            question: "What if I encounter a bug?",
            answer: "Please let us know immediately via the Feedback page. Our team monitors reports 24/7 and we usually fix critical bugs within hours.",
            isOpen: false
        }
    ];

    categories: Category[] = [
        {
            id: 'pdf',
            name: 'PDF Tools',
            subtitle: 'Solve Your PDF Problems',
            color: '#6f56ec',
            bgColor: '#6f56ec',
            icon: 'fa-solid fa-file-pdf',
            toolCount: '10+ tools',
            featuredTool: 'Featured Tool :',
            featuredTool2: 'PDF Creator',
            link: '/pdf'
        },
        {
            id: 'image',
            name: 'Image Tools',
            subtitle: 'Solve Your Image Problems',
            color: '#F66213',
            bgColor: '#F66213',
            icon: 'fa-solid fa-image',
            toolCount: '10+ tools',
            featuredTool: 'Featured Tool :',
            featuredTool2: 'Remove BG',
            link: '/image'
        },
        // {
        //     id: 'video',
        //     name: 'Video Tools',
        //     subtitle: 'Solve Your Video Problems',
        //     color: '#D61C4E',
        //     bgColor: '#D61C4E',
        //     icon: 'fa-solid fa-video',
        //     toolCount: '45+ tools',
        //     featuredTool: 'Featured Tool :',
        //     featuredTool2: 'Mute Video',
        //     link: '/video'
        // },
        {
            id: 'write',
            name: 'AI Write',
            subtitle: 'Solve Your Text Problems',
            color: '#1C67CA',
            bgColor: '#1C67CA',
            icon: 'fa-solid fa-pen-nib',
            toolCount: '10+ tools',
            featuredTool: 'Featured Tool :',
            featuredTool2: 'Paragraph Writer',
            link: '/write'
        },
        {
            id: 'file',
            name: 'File Tools',
            subtitle: 'Solve Your File Problems',
            color: '#10B981',
            bgColor: '#10B981',
            icon: 'fa-solid fa-folder',
            toolCount: '5+ tools',
            featuredTool: 'Featured Tool :',
            featuredTool2: 'Split Excel',
            link: '/file'
        }
    ];


    // Complete list of tools (37 tools total)
    sampleTools: Tool[] = [
        // --- PDF Tools (12) ---
        {
            _id: 'pdf-1',
            name: 'Merge PDF',
            description: 'Combine multiple PDF files into one document',
            iconClass: 'fa-solid fa-object-group',
            iconColor: '#F97316',
            bgIconColor: '#FFEDD5',
            link: '/pdf/merge',
            category: 'pdf'
        },
        {
            _id: 'pdf-2',
            name: 'Split PDF',
            description: 'Split PDF into multiple files by selecting pages',
            iconClass: 'fa-solid fa-scissors',
            iconColor: '#7C3AED',
            bgIconColor: '#EDE9FE',
            link: '/pdf/split',
            category: 'pdf'
        },
        {
            _id: 'pdf-3',
            name: 'Image to PDF',
            description: 'Convert images to PDF document',
            iconClass: 'fa-solid fa-file-image',
            iconColor: '#EC4899',
            bgIconColor: '#FCE7F3',
            link: '/pdf/img-to-pdf',
            category: 'pdf'
        },
        {
            _id: 'pdf-4',
            name: 'HTML to PDF',
            description: 'Convert web pages or HTML to PDF documents',
            iconClass: 'fa-solid fa-code',
            iconColor: '#14B8A6',
            bgIconColor: '#CCFBF1',
            link: '/pdf/html-to-pdf',
            category: 'pdf'
        },
        {
            _id: 'pdf-5',
            name: 'Compress PDF',
            description: 'Reduce PDF file size while maintaining quality',
            iconClass: 'fa-solid fa-compress',
            iconColor: '#10B981',
            bgIconColor: '#D1FAE5',
            link: '/pdf/compress',
            category: 'pdf'
        },
        {
            _id: 'pdf-6',
            name: 'PDF to Image',
            description: 'Convert PDF pages to JPG or PNG images',
            iconClass: 'fa-solid fa-image',
            iconColor: '#3B82F6',
            bgIconColor: '#DBEAFE',
            link: '/pdf/to-image',
            category: 'pdf'
        },
        {
            _id: 'pdf-7',
            name: 'Rotate PDF',
            description: 'Rotate PDF pages to any angle',
            iconClass: 'fa-solid fa-rotate',
            iconColor: '#8B5CF6',
            bgIconColor: '#EDE9FE',
            link: '/pdf/rotate',
            category: 'pdf'
        },
        {
            _id: 'pdf-8',
            name: 'Add Watermark',
            description: 'Add text or image watermark to PDF',
            iconClass: 'fa-solid fa-droplet',
            iconColor: '#0EA5E9',
            bgIconColor: '#E0F2FE',
            link: '/pdf/watermark',
            category: 'pdf'
        },
        {
            _id: 'pdf-9',
            name: 'Unlock PDF',
            description: 'Remove password protection from PDF',
            iconClass: 'fa-solid fa-lock-open',
            iconColor: '#EF4444',
            bgIconColor: '#FEE2E2',
            link: '/pdf/unlock',
            category: 'pdf'
        },
        {
            _id: 'pdf-10',
            name: 'Protect PDF',
            description: 'Add password protection to PDF file',
            iconClass: 'fa-solid fa-lock',
            iconColor: '#22C55E',
            bgIconColor: '#DCFCE7',
            link: '/pdf/protect',
            category: 'pdf'
        },
        {
            _id: 'pdf-11',
            name: 'PDF OCR',
            description: 'Extract text from scanned PDF using OCR',
            iconClass: 'fa-solid fa-eye',
            iconColor: '#2563EB',
            bgIconColor: '#DBEAFE',
            link: '/pdf/ocr',
            category: 'pdf'
        },
        {
            _id: 'pdf-12',
            name: 'Word to PDF',
            description: 'Convert Word documents to PDF format',
            iconClass: 'fa-solid fa-file-pdf',
            iconColor: '#DC2626',
            bgIconColor: '#FEE2E2',
            link: '/pdf/word-to-pdf',
            category: 'pdf'
        },

        // --- Image Tools (13) ---
        {
            _id: 'img-1',
            name: 'AI Image Generator',
            description: 'Generate stunning images using AI from text prompts',
            iconClass: 'fa-solid fa-wand-magic-sparkles',
            iconColor: '#10B981',
            bgIconColor: '#D1FAE5',
            link: '/image/ai-generator',
            category: 'image'
        },
        {
            _id: 'img-2',
            name: 'Image Compressor',
            description: 'Compress images without losing quality',
            iconClass: 'fa-solid fa-compress',
            iconColor: '#3B82F6',
            bgIconColor: '#DBEAFE',
            link: '/image/compress',
            category: 'image'
        },
        {
            _id: 'img-3',
            name: 'AI Image Enhancer',
            description: 'Enhance and upscale blurry images with AI',
            iconClass: 'fa-solid fa-wand-magic-sparkles',
            iconColor: '#8B5CF6',
            bgIconColor: '#EDE9FE',
            link: '/image/enhance',
            category: 'image'
        },
        {
            _id: 'img-4',
            name: 'WebP to JPG',
            description: 'Convert WebP images to JPG format',
            iconClass: 'fa-solid fa-file-image',
            iconColor: '#0EA5E9',
            bgIconColor: '#E0F2FE',
            link: '/image/webp-to-jpg',
            category: 'image'
        },
        {
            _id: 'img-5',
            name: 'PNG to JPG',
            description: 'Convert PNG images to JPG format',
            iconClass: 'fa-solid fa-image',
            iconColor: '#14B8A6',
            bgIconColor: '#CCFBF1',
            link: '/image/png-to-jpg',
            category: 'image'
        },
        {
            _id: 'img-6',
            name: 'JPG to PNG',
            description: 'Convert JPG images to PNG format',
            iconClass: 'fa-solid fa-images',
            iconColor: '#7C3AED',
            bgIconColor: '#EDE9FE',
            link: '/image/jpg-to-png',
            category: 'image'
        },
        {
            _id: 'img-7',
            name: 'Image to Base64',
            description: 'Convert images to Base64 encoded string',
            iconClass: 'fa-solid fa-code',
            iconColor: '#6366F1',
            bgIconColor: '#E0E7FF',
            link: '/image/to-base64',
            category: 'image'
        },
        {
            _id: 'img-8',
            name: 'Remove Background',
            description: 'Automatically remove background from any image',
            iconClass: 'fa-solid fa-eraser',
            iconColor: '#06B6D4',
            bgIconColor: '#CFFAFE',
            link: '/image/remove-bg',
            category: 'image'
        },
        {
            _id: 'img-9',
            name: 'Resize Image',
            description: 'Resize images to any dimension',
            iconClass: 'fa-solid fa-expand',
            iconColor: '#8B5CF6',
            bgIconColor: '#EDE9FE',
            link: '/image/resize',
            category: 'image'
        },
        {
            _id: 'img-10',
            name: 'Crop Image',
            description: 'Crop images to remove unwanted parts',
            iconClass: 'fa-solid fa-crop',
            iconColor: '#F97316',
            bgIconColor: '#FFEDD5',
            link: '/image/crop',
            category: 'image'
        },
        {
            _id: 'img-11',
            name: 'Add Watermark',
            description: 'Add text or image watermark to pictures',
            iconClass: 'fa-solid fa-droplet',
            iconColor: '#06B6D4',
            bgIconColor: '#CFFAFE',
            link: '/image/watermark',
            category: 'image'
        },
        {
            _id: 'img-12',
            name: 'Rotate Image',
            description: 'Rotate images to any angle',
            iconClass: 'fa-solid fa-rotate',
            iconColor: '#22C55E',
            bgIconColor: '#DCFCE7',
            link: '/image/rotate',
            category: 'image'
        },
        {
            _id: 'img-13',
            name: 'Blur Image',
            description: 'Add blur effect to your images',
            iconClass: 'fa-solid fa-eye-low-vision',
            iconColor: '#8B5CF6',
            bgIconColor: '#EDE9FE',
            link: '/image/blur',
            category: 'image'
        },

        // --- AI Write Tools (12) ---
        {
            _id: 'write-1',
            name: 'Cold Email Generator',
            description: 'Generate professional cold emails for outreach',
            iconClass: 'fa-solid fa-envelope',
            iconColor: '#EC4899',
            bgIconColor: '#FCE7F3',
            link: '/write/cold-email',
            category: 'write'
        },
        {
            _id: 'write-2',
            name: 'Essay Writer',
            description: 'Write well-structured essays on any topic',
            iconClass: 'fa-solid fa-pen-nib',
            iconColor: '#6366F1',
            bgIconColor: '#E0E7FF',
            link: '/write/essay',
            category: 'write'
        },
        {
            _id: 'write-3',
            name: 'Blog Post Generator',
            description: 'Create engaging blog posts with AI',
            iconClass: 'fa-solid fa-blog',
            iconColor: '#14B8A6',
            bgIconColor: '#CCFBF1',
            link: '/write/blog',
            category: 'write'
        },
        {
            _id: 'write-4',
            name: 'Content Summarizer',
            description: 'Summarize long articles and documents',
            iconClass: 'fa-solid fa-compress',
            iconColor: '#8B5CF6',
            bgIconColor: '#EDE9FE',
            link: '/write/summarizer',
            category: 'write'
        },
        {
            _id: 'write-5',
            name: 'Paragraph Writer',
            description: 'Generate paragraphs on any topic',
            iconClass: 'fa-solid fa-paragraph',
            iconColor: '#3B82F6',
            bgIconColor: '#DBEAFE',
            link: '/write/paragraph',
            category: 'write'
        },
        {
            _id: 'write-6',
            name: 'Article Rewriter',
            description: 'Rewrite articles to make them unique',
            iconClass: 'fa-solid fa-rotate',
            iconColor: '#F97316',
            bgIconColor: '#FFEDD5',
            link: '/write/rewriter',
            category: 'write'
        },
        {
            _id: 'write-7',
            name: 'Grammar Checker',
            description: 'Check and fix grammar mistakes',
            iconClass: 'fa-solid fa-spell-check',
            iconColor: '#22C55E',
            bgIconColor: '#DCFCE7',
            link: '/write/grammar',
            category: 'write'
        },
        {
            _id: 'write-8',
            name: 'Tone Changer',
            description: 'Change the tone of your writing',
            iconClass: 'fa-solid fa-sliders',
            iconColor: '#EF4444',
            bgIconColor: '#FEE2E2',
            link: '/write/tone',
            category: 'write'
        },
        {
            _id: 'write-9',
            name: 'Product Description',
            description: 'Write compelling product descriptions',
            iconClass: 'fa-solid fa-box',
            iconColor: '#0EA5E9',
            bgIconColor: '#E0F2FE',
            link: '/write/product',
            category: 'write'
        },
        {
            _id: 'write-10',
            name: 'Social Media Post',
            description: 'Generate engaging social media content',
            iconClass: 'fa-solid fa-hashtag',
            iconColor: '#7C3AED',
            bgIconColor: '#EDE9FE',
            link: '/write/social',
            category: 'write'
        },
        {
            _id: 'write-11',
            name: 'Story Generator',
            description: 'Create creative stories with AI',
            iconClass: 'fa-solid fa-book',
            iconColor: '#D946EF',
            bgIconColor: '#FAE8FF',
            link: '/write/story',
            category: 'write'
        },
        {
            _id: 'write-12',
            name: 'JSON to XML',
            description: 'Convert JSON data to XML format',
            iconClass: 'fa-solid fa-code',
            iconColor: '#64748B',
            bgIconColor: '#F1F5F9',
            link: '/write/json-to-xml',
            category: 'write'
        }
    ];

    // --- File Tools (6) ---
    fileTools: Tool[] = [
        {
            _id: 'file-1',
            name: 'Excel to CSV',
            description: 'Convert Excel files to CSV format',
            iconClass: 'fa-solid fa-file-csv',
            iconColor: '#10B981',
            bgIconColor: '#D1FAE5',
            link: '/file/excel-to-csv',
            category: 'file'
        },
        {
            _id: 'file-2',
            name: 'CSV to Excel',
            description: 'Convert CSV files to Excel format',
            iconClass: 'fa-solid fa-file-excel',
            iconColor: '#22C55E',
            bgIconColor: '#DCFCE7',
            link: '/file/csv-to-excel',
            category: 'file'
        },
        {
            _id: 'file-3',
            name: 'Excel to JSON',
            description: 'Convert Excel spreadsheets to JSON data',
            iconClass: 'fa-solid fa-file-code',
            iconColor: '#F59E0B',
            bgIconColor: '#FEF3C7',
            link: '/file/excel-to-json',
            category: 'file'
        },
        {
            _id: 'file-4',
            name: 'JSON to Excel',
            description: 'Convert JSON data to Excel spreadsheet',
            iconClass: 'fa-solid fa-table',
            iconColor: '#0EA5E9',
            bgIconColor: '#E0F2FE',
            link: '/file/json-to-excel',
            category: 'file'
        },
        {
            _id: 'file-5',
            name: 'Image to CSV',
            description: 'Extract tables from images to CSV',
            iconClass: 'fa-solid fa-table-cells',
            iconColor: '#8B5CF6',
            bgIconColor: '#EDE9FE',
            link: '/file/image-to-csv',
            category: 'file'
        },
        {
            _id: 'file-6',
            name: 'Image to Excel',
            description: 'Extract tables from images to Excel',
            iconClass: 'fa-solid fa-file-invoice',
            iconColor: '#F97316',
            bgIconColor: '#FFEDD5',
            link: '/file/image-to-excel',
            category: 'file'
        }
    ];

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: '2olhub - Free Online Tools to Make Everything Simple',
            description: 'Free online tools for everyone. Merge PDF, Remove Background, AI Writing, and more. 100% free and unlimited options available.',
            keywords: 'free online tools, pdf tools, image editor, ai writer, 2olhub, student learning platform'
        });

        // For now, use sample tools. Later, fetch from API
        this.tools = [...this.sampleTools, ...this.fileTools];
        this.filterTools(); // Initial filter

        // Uncomment when API is ready
        // this.loadTools();
    }

    loadTools(): void {
        this.apiService.getTools().subscribe({
            next: (tools) => {
                this.tools = tools;
                this.filterTools();
            },
            error: (err) => console.error('Failed to load tools:', err)
        });
    }

    filterTools(): void {
        let filtered = this.tools;

        if (this.activeCategory !== 'all') {
            filtered = filtered.filter(tool => tool.category === this.activeCategory);
        }

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(tool =>
                tool.name.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query)
            );
        }

        this.filteredTools = filtered;

        // Update displayed tools
        if (!this.showAll && !this.searchQuery && this.activeCategory === 'all') {
            this.displayedTools = this.filteredTools.slice(0, 8);
        } else {
            this.displayedTools = this.filteredTools;
        }
    }

    setCategory(categoryId: string): void {
        this.activeCategory = categoryId;
        this.showAll = false; // Reset show all when changing category
        this.filterTools();
    }

    onSearch(): void {
        this.filterTools();

        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase().trim();
            this.searchResults = this.tools.filter(tool =>
                tool.name.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query)
            ).slice(0, 50); // Limit to 50 results, scrollable
        } else {
            this.searchResults = [];
        }
    }

    navigateToTool(tool: Tool): void {
        this.router.navigate([tool.link]);
        this.searchQuery = ''; // Clear search after navigation
        this.searchResults = []; // Close dropdown
    }

    toggleShowAll(): void {
        this.showAll = !this.showAll;
        this.filterTools();
    }

    scrollToTools(): void {
        const toolsSection = document.getElementById('all-tools');
        if (toolsSection) {
            toolsSection.scrollIntoView({ behavior: 'smooth' });
        }
        // Also ensure we are showing all results or current search
        this.filterTools();
    }

    clearSearch(): void {
        this.searchQuery = '';
        this.onSearch(); // Reset results
    }

    toggleFaq(index: number): void {
        const currentState = this.faqs[index].isOpen;
        // Close all first
        this.faqs.forEach(f => f.isOpen = false);
        // Toggle the clicked one based on its previous state
        this.faqs[index].isOpen = !currentState;
    }
}
