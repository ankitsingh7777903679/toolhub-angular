import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../../../core/services/seo.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div class="max-w-4xl mx-auto relative z-10">
        <!-- Hero Section -->
        <div class="text-center mb-16">
          <h1 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-6 tracking-tight drop-shadow-sm">
            About 2olhub
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            A bunch of useful tools, all in one place. No signup, no tricks.
          </p>
        </div>

        <!-- Our Story -->
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-800 p-8 md:p-10 mb-8 transition-all duration-300 hover:shadow-2xl">
            <div class="flex items-start space-x-5">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <i class="fa-solid fa-rocket text-2xl"></i>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">The Short Version</h2>
                    <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-4">
                        You know the drill — you need to merge two PDFs, so you google it, click the first result, and suddenly there's a signup form, a file size limit, and a watermark unless you pay. We've been there. It's annoying. So we built 2olhub to be the opposite of that.
                    </p>
                    <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                        It's a collection of 40+ tools for PDFs, images, file conversions, and AI writing. Most of them run right in your browser, which means your files never even leave your computer. Open a tool, drop your file in, grab the result. That's it. No account needed.
                    </p>
                </div>
            </div>
        </div>

        <!-- What We Offer -->
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 md:p-10 mb-8 transition-all duration-300 hover:shadow-md">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">What's In The Toolbox?</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 mt-0.5">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-1">PDF Tools</h3>
                        <p class="text-slate-600 dark:text-slate-400 text-sm">Merge, split, compress, rotate, watermark, protect, unlock — basically anything you'd ever need to do with a PDF.</p>
                    </div>
                </div>
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <i class="fa-solid fa-image"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-1">Image Tools</h3>
                        <p class="text-slate-600 dark:text-slate-400 text-sm">Resize for social media, compress for email, remove backgrounds for product shots, convert between PNG/JPG/WebP, and more.</p>
                    </div>
                </div>
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400 mt-0.5">
                        <i class="fa-solid fa-pen-fancy"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-1">AI Writing</h3>
                        <p class="text-slate-600 dark:text-slate-400 text-sm">Need a first draft? Our AI can write blog posts, essays, cold emails, summaries, product descriptions — you name it.</p>
                    </div>
                </div>
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mt-0.5">
                        <i class="fa-solid fa-file-export"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-1">File Converters</h3>
                        <p class="text-slate-600 dark:text-slate-400 text-sm">CSV to Excel, Excel to JSON, image tables to spreadsheets — the kind of boring-but-essential conversions that save you an hour.</p>
                    </div>
                </div>
                <div class="flex items-start space-x-4 sm:col-span-2">
                    <div class="flex-shrink-0 w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 mt-0.5">
                        <i class="fa-solid fa-link"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 mb-1">Tool Chain</h3>
                        <p class="text-slate-600 dark:text-slate-400 text-sm">Done with one tool? Send the result straight to the next one. Merge PDFs, then compress, then add a watermark — no re-uploading between steps.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Key Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-3xl p-7 border border-white/10 dark:border-slate-800 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 text-center">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4 mx-auto">
                    <i class="fa-solid fa-gift text-xl"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">90%+ Free</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm">
                    No signup, no hidden limits, no watermarks. Most tools just work — open and use. We actually mean it when we say free.
                </p>
            </div>

            <div class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-3xl p-7 border border-white/10 dark:border-slate-800 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 text-center">
                <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 mx-auto">
                    <i class="fa-solid fa-shield-alt text-xl"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Your Files, Your Device</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm">
                    Most tools process everything in your browser. Your documents never touch our servers. We literally couldn't look at them even if we wanted to.
                </p>
            </div>

            <div class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-3xl p-7 border border-white/10 dark:border-slate-800 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 text-center">
                <div class="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 mx-auto">
                    <i class="fa-solid fa-link text-xl"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Tool Chain</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm">
                    Finished with one tool? Send the output straight to the next. Merge → Compress → Watermark, all in one flow — zero re-uploads.
                </p>
            </div>
        </div>

        <!-- Who Uses This -->
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 md:p-10 mb-8 transition-all duration-300 hover:shadow-md">
            <div class="flex items-start space-x-5">
                <div class="flex-shrink-0 w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <i class="fa-solid fa-users text-xl"></i>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Who Actually Uses This?</h2>
                    <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        Honestly? A bit of everyone. Students use the AI writer when they need a rough draft at 2 AM. Office workers merge contracts and compress reports ten minutes before a deadline. Freelancers batch-compress product photos for their Etsy shop or remove backgrounds for cleaner listings.
                    </p>
                    <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                        The common thread is that people come here when they've got a specific job to do and don't want to spend fifteen minutes signing up for yet another tool. We get it, because we've been there ourselves. That's literally why we built this thing.
                    </p>
                </div>
            </div>
        </div>

        <!-- Contact Section -->
        <div class="text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-10 border border-slate-200 dark:border-slate-700">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Want to Say Something?</h2>
            <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Found a bug? Have an idea for a tool we should build? Or just want to tell us the PDF merger saved your project? We read everything.
            </p>
            <a routerLink="/feedback" class="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-0.5">
                <i class="fa-regular fa-comments mr-2"></i>
                Drop Us Feedback
            </a>
        </div>

      </div>
    </div>
  `
})
export class AboutComponent implements OnInit {
    private seoService = inject(SeoService);

    ngOnInit() {
        this.seoService.updateSeo({
            title: 'About Us - 2olhub',
            description: 'Learn about 2olhub — free, fast, and private online tools for PDFs, images, file conversion, and AI writing. 40+ tools, no signup required.',
            url: 'https://2olhub.netlify.app/about'
        });
    }
}
