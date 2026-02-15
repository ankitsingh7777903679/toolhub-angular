import { Routes } from '@angular/router';

export const WRITE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./ai-write.component').then(m => m.AiWriteComponent)
    },
    {
        path: 'cold-email',
        loadComponent: () => import('./cold-email/cold-email.component').then(m => m.ColdEmailComponent)
    },
    {
        path: 'essay',
        loadComponent: () => import('./essay/essay.component').then(m => m.EssayComponent)
    },
    {
        path: 'blog',
        loadComponent: () => import('./blog/blog.component').then(m => m.BlogComponent)
    },
    {
        path: 'summarizer',
        loadComponent: () => import('./summarizer/summarizer.component').then(m => m.SummarizerComponent)
    },
    {
        path: 'json-to-xml',
        loadComponent: () => import('./json-to-xml/json-to-xml.component').then(m => m.JsonToXmlComponent)
    },
    {
        path: 'paragraph',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Paragraph Writer',
            description: 'Generate coherent and engaging paragraphs on any topic.',
            promptType: 'paragraph',
            inputLabel: 'What should the paragraph be about?',
            inputPlaceholder: 'E.g., The benefits of daily exercise...',
            headerBgColor: '#DBEAFE',
            iconColor: '#3B82F6',
            iconClass: 'fa-solid fa-paragraph',
            seoTitle: 'AI Paragraph Writer — One Good Paragraph, Right Now',
            seoIntro: 'Sometimes you just need one solid paragraph — for an intro, a product page, a report section, or to break through writer\'s block. Describe your topic, and you\'ll get a well-structured paragraph in seconds. Not filler text. Actual, readable content.',
            keywords: 'free ai paragraph generator, ai paragraph writer free, online paragraph generator, ai text generator free, paragraph creator ai, ai writing assistant, free paragraph maker',
            features: [
                { icon: 'fa-solid fa-feather', title: 'Flows Naturally', description: 'Sentences connect logically, not like a random list.' },
                { icon: 'fa-solid fa-bullseye', title: 'Stays On Topic', description: 'Doesn\'t wander off into unrelated territory.' },
                { icon: 'fa-solid fa-text-height', title: 'Right Length', description: 'Not two sentences, not a wall of text — just right.' },
                { icon: 'fa-solid fa-language', title: 'Clean Grammar', description: 'No typos or awkward phrasing to fix afterward.' },
                { icon: 'fa-solid fa-bolt', title: 'Instant', description: 'Results in a few seconds, not a few minutes.' },
                { icon: 'fa-solid fa-infinity', title: 'No Limits', description: 'Generate as many paragraphs as you want.' }
            ],
            useCases: ['Essay introductions when you can\'t figure out how to start', 'Website copy for an About page or product section', 'Report paragraphs that need to sound professional', 'Filler-free body content for blog posts'],
            faqs: [
                { question: 'How long is a generated paragraph?', answer: 'Usually 4-8 sentences, around 100-200 words. If you want it shorter or longer, just mention that in your prompt — like "write a brief 3-sentence paragraph about X."' },
                { question: 'Can I ask for a specific writing style?', answer: 'Absolutely. Say "write a formal paragraph about..." or "make it casual and conversational" and the AI adjusts its tone.' },
                { question: 'Is each paragraph unique?', answer: 'Yes. The AI generates fresh content every time based on your specific prompt — no recycled templates.' }
            ]
        }
    },
    {
        path: 'rewriter',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Article Rewriter',
            description: 'Rewrite content to improve clarity and uniqueness.',
            promptType: 'rewriter',
            inputLabel: 'Paste the content you want to rewrite',
            inputPlaceholder: 'Paste article or text here...',
            headerBgColor: '#FFEDD5',
            iconColor: '#F97316',
            iconClass: 'fa-solid fa-rotate',
            seoTitle: 'AI Article Rewriter — Same Meaning, Fresh Words',
            seoIntro: 'You have a piece of content that says what you want, but you need a different version — maybe for a second platform, to avoid duplicate content issues, or because the original is someone else\'s work and you need to make it yours. Paste it in, and get a rewritten version that keeps the meaning but changes the wording.',
            keywords: 'paraphrasing tool, article rewriter, content rewriter, unique content generator, ai rewriter, sentence rewriter, text rewriter, free article spinner, avoid plagiarism tool',
            features: [
                { icon: 'fa-solid fa-shuffle', title: 'Real Paraphrasing', description: 'Actually restructures sentences, not just swaps synonyms.' },
                { icon: 'fa-solid fa-shield-check', title: 'Plagiarism-Safe', description: 'Output is different enough to pass originality checks.' },
                { icon: 'fa-solid fa-text-slash', title: 'Keeps the Meaning', description: 'Your core message stays intact — just the delivery changes.' },
                { icon: 'fa-solid fa-spell-check', title: 'Often Improves It', description: 'Sometimes the rewrite is actually better than the original.' },
                { icon: 'fa-solid fa-bolt', title: 'Works Fast', description: 'Full articles rewritten in seconds.' },
                { icon: 'fa-solid fa-file-lines', title: 'Any Length', description: 'From a single paragraph to multi-page articles.' }
            ],
            useCases: ['Repurposing blog posts for LinkedIn or Medium without duplicate content penalties', 'Making referenced content unique enough for your own article', 'Rewriting product descriptions for different marketplaces', 'Simplifying complex text for a broader audience'],
            faqs: [
                { question: 'Will the rewrite pass plagiarism checkers?', answer: 'The AI changes enough of the structure and wording that it typically does. But for anything important — academic papers, published articles — run it through a plagiarism checker yourself to be safe.' },
                { question: 'Does it change what the text is saying?', answer: 'Not the core ideas. It restructures how those ideas are expressed — different words, different sentence patterns, sometimes better flow.' },
                { question: 'Can I control the style of the rewrite?', answer: 'Yes. Add instructions like "make it simpler," "more formal," or "shorter" and the AI will adjust the rewrite accordingly.' }
            ]
        }
    },
    {
        path: 'grammar',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Grammar Checker',
            description: 'Fix grammar, punctuation, and spelling errors.',
            promptType: 'grammar',
            inputLabel: 'Paste text to check',
            inputPlaceholder: 'Type or paste text here...',
            headerBgColor: '#DCFCE7',
            iconColor: '#22C55E',
            iconClass: 'fa-solid fa-spell-check',
            seoTitle: 'AI Grammar Checker — Catch Mistakes Before Anyone Else Does',
            seoIntro: 'Typos in a client email. A comma splice in your resume. Subject-verb disagreement in a blog post. These things happen to everyone, and they\'re easy to miss when you\'ve been staring at your own writing. Paste your text in, and we\'ll flag what needs fixing.',
            keywords: 'grammar checker, online grammar checker, spell checker, punctuation checker, grammar fix, correct my grammar, free grammar check, writing assistant, proofreading tool',
            features: [
                { icon: 'fa-solid fa-spell-check', title: 'Grammar Fixes', description: 'Catches subject-verb issues, tense errors, and more.' },
                { icon: 'fa-solid fa-text-slash', title: 'Spelling', description: 'Finds typos your spell-checker missed.' },
                { icon: 'fa-solid fa-ellipsis', title: 'Punctuation', description: 'Commas, semicolons, apostrophes — all handled.' },
                { icon: 'fa-solid fa-align-left', title: 'Better Flow', description: 'Smooths out clunky sentences.' },
                { icon: 'fa-solid fa-bolt', title: 'Quick', description: 'Check a full page of text in seconds.' },
                { icon: 'fa-solid fa-copy', title: 'Copy Fixed Text', description: 'One click to grab the corrected version.' }
            ],
            useCases: ['Proofreading important emails before hitting send', 'Polishing academic papers and assignments', 'Cleaning up business documents and proposals', 'Final check on blog posts before publishing'],
            faqs: [
                { question: 'What kinds of errors does it catch?', answer: 'Grammar (subject-verb agreement, tense consistency), spelling mistakes, punctuation errors, capitalization issues, and awkward sentence structure.' },
                { question: 'Will it change my writing style?', answer: 'No — it focuses strictly on errors. Your voice and style stay the same. It fixes the mistakes, not your personality.' },
                { question: 'Does it work for languages other than English?', answer: 'It\'s optimized for English right now. It might catch some issues in other languages, but English is where it performs best.' }
            ]
        }
    },
    {
        path: 'tone',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Tone Changer',
            description: 'Adjust the tone of your writing (Professional, Friendly, etc).',
            promptType: 'tone',
            inputLabel: 'Original text and target tone',
            inputPlaceholder: 'E.g., "Make this sound more professional: Hey guys..."',
            headerBgColor: '#FEE2E2',
            iconColor: '#EF4444',
            iconClass: 'fa-solid fa-sliders',
            seoTitle: 'AI Tone Changer — Same Message, Different Delivery',
            seoIntro: 'You wrote a perfectly good message, but the tone is wrong. Maybe your email to a client sounds too casual. Maybe your LinkedIn post reads like a legal document. Paste your text in, tell the AI what tone you need, and get a rewritten version that says the same thing — just differently.',
            keywords: 'ai tone changer, change writing tone, rewrite text tone, formal to casual converter, professional tone rewriter, tone of voice ai, adjust writing style, emotional tone changer',
            features: [
                { icon: 'fa-solid fa-user-tie', title: 'Professional', description: 'Clean, business-appropriate language.' },
                { icon: 'fa-solid fa-smile', title: 'Friendly', description: 'Warm and approachable without being unprofessional.' },
                { icon: 'fa-solid fa-graduation-cap', title: 'Academic', description: 'Formal, scholarly, citation-ready.' },
                { icon: 'fa-solid fa-lightbulb', title: 'Persuasive', description: 'Compelling and action-oriented.' },
                { icon: 'fa-solid fa-child', title: 'Simplified', description: 'Easy to understand for any audience.' },
                { icon: 'fa-solid fa-bolt', title: 'Instant', description: 'Tone shift in a few seconds.' }
            ],
            useCases: ['Making a casual Slack message sound professional enough for email', 'Softening feedback so it doesn\'t come across as harsh', 'Adapting a blog post for LinkedIn vs Twitter', 'Matching your company\'s brand voice guidelines'],
            faqs: [
                { question: 'What tones can it handle?', answer: 'Professional, casual, friendly, formal, academic, persuasive, empathetic, humorous, authoritative — basically any tone you can describe. Just tell it what you want.' },
                { question: 'Does it keep the original meaning?', answer: 'Yes. The core message stays the same — only how it\'s delivered changes. Think of it as saying the same thing in a different outfit.' },
                { question: 'How do I tell it what tone I want?', answer: 'Just include it in your prompt: "make this more friendly," "rewrite in a formal academic tone," or "make this sound like a CEO wrote it." The more specific, the better.' }
            ]
        }
    },
    {
        path: 'product',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Product Description',
            description: 'Create compelling product descriptions that sell.',
            promptType: 'product',
            inputLabel: 'Product Name and Details',
            inputPlaceholder: 'E.g., Wireless Noise Cancelling Headphones, 30h battery life...',
            headerBgColor: '#E0F2FE',
            iconColor: '#0EA5E9',
            iconClass: 'fa-solid fa-box',
            seoTitle: 'AI Product Description Generator — Write Listings That Actually Sell',
            seoIntro: 'You\'ve got a great product but the description on your listing reads like a spec sheet. Customers don\'t buy features — they buy outcomes. Tell the AI what your product does, and get a description that highlights why someone should care.',
            keywords: 'ai product description generator, seo product descriptions, ecommerce content generator, amazon product description writer, shopify product descriptions, auto product description writer, free product description tool',
            features: [
                { icon: 'fa-solid fa-cart-shopping', title: 'Sells, Not Just Describes', description: 'Written to convert browsers into buyers.' },
                { icon: 'fa-solid fa-bullseye', title: 'Benefit-First', description: 'Leads with what the customer gets, not just what it is.' },
                { icon: 'fa-solid fa-magnifying-glass', title: 'Search-Friendly', description: 'Naturally includes keywords people search for.' },
                { icon: 'fa-solid fa-store', title: 'Any Platform', description: 'Works for Amazon, Shopify, Etsy, eBay, and your own site.' },
                { icon: 'fa-solid fa-bolt', title: 'Fast', description: 'Full descriptions in seconds — even for a catalog of 50 products.' },
                { icon: 'fa-solid fa-pen', title: 'Easy to Edit', description: 'Grab the draft and tweak it to match your brand voice.' }
            ],
            useCases: ['Amazon sellers writing listings for new products', 'Shopify store owners who need descriptions for dozens of items', 'eBay sellers who want to stand out from copy-paste listings', 'Marketing teams writing catalog or website product copy'],
            faqs: [
                { question: 'What should I include in my prompt?', answer: 'Product name, key features, who it\'s for, what problem it solves, and anything that makes it different. The more context you give, the better the description.' },
                { question: 'Will the descriptions help with SEO?', answer: 'Yes — the AI naturally weaves in relevant terms that shoppers search for. You don\'t need to keyword-stuff; it reads naturally and ranks.' },
                { question: 'Can I get descriptions formatted for specific platforms?', answer: 'Sure — say "write an Amazon product description" or "create a Shopify listing" in your prompt and the AI will format it accordingly.' }
            ]
        }
    },
    {
        path: 'social',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Social Media Post',
            description: 'Generate engaging posts for Twitter, LinkedIn, etc.',
            promptType: 'social',
            inputLabel: 'Topic or Link',
            inputPlaceholder: 'E.g., New feature launch for our app...',
            headerBgColor: '#EDE9FE',
            iconColor: '#7C3AED',
            iconClass: 'fa-solid fa-hashtag',
            seoTitle: 'AI Social Media Post Generator — Stop Overthinking Your Captions',
            seoIntro: 'You know you need to post. You\'ve been staring at the text box for 10 minutes. Describe what you want to talk about, pick your platform, and get a post that\'s ready to publish — complete with hooks, hashtags, and the right tone for each network.',
            keywords: 'ai social media post generator, social media content creator, ai caption generator, instagram post generator, linkedin post writer, twitter post generator, social media automation, ai content marketing',
            features: [
                { icon: 'fa-brands fa-twitter', title: 'Twitter/X', description: 'Punchy hooks that fit the character limit.' },
                { icon: 'fa-brands fa-linkedin', title: 'LinkedIn', description: 'Thought leadership that doesn\'t sound like a press release.' },
                { icon: 'fa-brands fa-instagram', title: 'Instagram', description: 'Engaging captions with emojis and relevant hashtags.' },
                { icon: 'fa-solid fa-hashtag', title: 'Hashtag Suggestions', description: 'Relevant tags to boost your reach.' },
                { icon: 'fa-solid fa-fire', title: 'Scroll-Stopping Hooks', description: 'Opening lines that make people stop and read.' },
                { icon: 'fa-solid fa-bolt', title: 'Multiple Angles', description: 'Try different approaches quickly.' }
            ],
            useCases: ['Launching a product and needing announcement posts for every platform', 'Building a personal brand with consistent LinkedIn content', 'E-commerce brands posting daily on Instagram', 'Community managers who need engaging content on a schedule'],
            faqs: [
                { question: 'Which platforms does this work for?', answer: 'All of them — Twitter/X, LinkedIn, Instagram, Facebook, TikTok. Just mention which platform in your prompt and the AI adjusts the format, length, and tone.' },
                { question: 'Does it add hashtags?', answer: 'For platforms where hashtags matter (Instagram, Twitter), yes — it suggests relevant ones. For LinkedIn, it uses them sparingly since that\'s the norm there.' },
                { question: 'Can I get multiple versions of the same post?', answer: 'Yes — ask for "3 different angles on this topic" or just run the prompt multiple times. Each generation is unique.' }
            ]
        }
    },
    {
        path: 'story',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Story Generator',
            description: 'Write creative stories based on your prompt.',
            promptType: 'story',
            inputLabel: 'Story Prompt or Idea',
            inputPlaceholder: 'E.g., A robot who discovers emotions...',
            headerBgColor: '#FAE8FF',
            iconColor: '#D946EF',
            iconClass: 'fa-solid fa-book',
            seoTitle: 'AI Story Generator — From Idea to Complete Story in Seconds',
            seoIntro: 'You have a story idea but can\'t seem to write it. Maybe you need a bedtime story for your kid, a creative writing exercise, or inspiration for a larger project. Give the AI a premise — "a detective in a city where it never stops raining" — and get back a complete short story with characters, conflict, and a resolution.',
            keywords: 'ai story generator, ai story writer, story generator ai, ai plot generator, creative writing ai, short story generator, free ai story generator, ai novel writer',
            features: [
                { icon: 'fa-solid fa-wand-magic-sparkles', title: 'Surprising Plots', description: 'Twists and turns you didn\'t see coming.' },
                { icon: 'fa-solid fa-users', title: 'Real Characters', description: 'People with motivations, not just names.' },
                { icon: 'fa-solid fa-masks-theater', title: 'Any Genre', description: 'Fantasy, sci-fi, romance, horror, mystery — your call.' },
                { icon: 'fa-solid fa-pen-fancy', title: 'Descriptive Writing', description: 'Shows, doesn\'t just tell.' },
                { icon: 'fa-solid fa-book-open', title: 'Full Story Arc', description: 'Beginning, middle, and end — not just a setup.' },
                { icon: 'fa-solid fa-bolt', title: 'Instant', description: 'A complete short story in under a minute.' }
            ],
            useCases: ['Parents who need a fresh bedtime story and are tired of the same five books', 'Writers looking for a starting point they can develop into something bigger', 'Teachers who need writing prompts and example stories for students', 'Content creators who want short fiction for podcasts or YouTube'],
            faqs: [
                { question: 'What genres can it write?', answer: 'Fantasy, sci-fi, romance, mystery, horror, comedy, adventure, drama, literary fiction — basically anything. Tell it the genre in your prompt and it sets the right mood.' },
                { question: 'How long are the stories?', answer: 'Usually 500-1,000 words — enough for a complete short story with setup, conflict, and resolution. Want longer? Say "write a detailed 2,000-word story" in your prompt.' },
                { question: 'Can I continue a story or write a sequel?', answer: 'Yes. Paste your existing story and say "continue this" or "write a sequel where the main character discovers..." — the AI picks up where you left off.' }
            ]
        }
    }
];
