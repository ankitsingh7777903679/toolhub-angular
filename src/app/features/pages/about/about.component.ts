import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
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
            Empowering your digital workflow with powerful, free, and secure online tools.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <!-- Mission Card -->
            <div class="md:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-800 p-8 hover:shadow-2xl transition-all duration-300">
                <div class="flex items-start space-x-6">
                    <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <i class="fa-solid fa-rocket text-2xl"></i>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Our Mission</h2>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            We believe that powerful digital tools should be accessible to everyone. Our mission is to provide a comprehensive suite of high-quality, free online tools to simplify your daily tasks—whether you're working with PDFs, images, videos, or AI-generated content.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Feature 1 -->
            <div class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-3xl p-8 border border-white/10 dark:border-slate-800 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300">
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6">
                    <i class="fa-solid fa-gem text-xl"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Free & Premium</h3>
                <p class="text-slate-600 dark:text-slate-400">
                    Get started with our core tools for free. Upgrade anytime to unlock higher limits and advanced features.
                </p>
            </div>

             <!-- Feature 2 -->
             <div class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-3xl p-8 border border-white/10 dark:border-slate-800 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300">
                <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                    <i class="fa-solid fa-shield-alt text-xl"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Secure & Private</h3>
                <p class="text-slate-600 dark:text-slate-400">
                    Your files are processed securely and generally client-side. We prioritize your data privacy.
                </p>
            </div>

             <!-- Feature 3 -->
             <div class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-3xl p-8 border border-white/10 dark:border-slate-800 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300">
                <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
                    <i class="fa-solid fa-bolt text-xl"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Fast & Efficient</h3>
                <p class="text-slate-600 dark:text-slate-400">
                    Optimized algorithms for lightning-fast processing, saving you valuable time on every task.
                </p>
            </div>

             <!-- Feature 4 -->
             <div class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg rounded-3xl p-8 border border-white/10 dark:border-slate-800 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300">
                <div class="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6">
                    <i class="fa-solid fa-heart text-xl"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">Open Feedback</h3>
                <p class="text-slate-600 dark:text-slate-400">
                    Built for the community. We listen to your requests and continuously add new tools.
                </p>
            </div>
        </div>

        <!-- Contact Section -->
        <div class="text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-3xl p-10 border border-slate-200 dark:border-slate-700">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Got Questions or Suggestions?</h2>
            <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                We'd love to hear from you. Visit our feedback page to share your thoughts publicly or reach out to us directly.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/feedback" class="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200">
                    <i class="fa-regular fa-comments mr-2"></i>
                    Visit Feedback Page
                </a>
               <!-- <a href="mailto:support@toolhub.com" class="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm text-base font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200">
                    <i class="fa-regular fa-envelope mr-2"></i>
                    Contact Support
                </a> -->
            </div>
        </div>

      </div>
    </div>
  `
})
export class AboutComponent { }
