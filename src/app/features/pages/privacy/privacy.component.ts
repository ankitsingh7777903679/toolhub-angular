import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div class="max-w-4xl mx-auto relative z-10">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-6 tracking-tight drop-shadow-sm">
            Privacy Policy
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Your privacy is our priority. Transparent, secure, and respectful of your data.
          </p>
          <div class="mt-4">
             <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                <i class="fa-regular fa-clock mr-1.5"></i>
                Last Updated: January 2026
             </span>
          </div>
        </div>

        <div class="space-y-6">
            
            <!-- Section 1 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mt-1">
                        <i class="fa-solid fa-server"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">1. No File Storage</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                             We <strong>do not store</strong> your files. Most tools process files entirely in your browser (client-side). If a tool requires server processing, your file is held only for the duration of the task and is <strong>immediately removed</strong>.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 2 -->
             <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mt-1">
                        <i class="fa-solid fa-cookie-bite"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">2. Cookies & Local Storage</h3>
                         <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            We use local storage strictly to save your <strong>user letter preferences</strong> (like dark mode or recent tools). We do not use third-party tracking cookies to sell your data.
                        </p>
                    </div>
                </div>
            </div>

             <!-- Section 3 -->
             <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mt-1">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">3. Security</h3>
                         <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            We implement standard security measures to protect your data during the file processing steps. Your uploaded files are processed securely and never shared with third parties.
                        </p>
                    </div>
                </div>
            </div>

             <!-- Section 4 -->
             <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 mt-1">
                        <i class="fa-solid fa-link"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">4. External Links</h3>
                         <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Our website may contain links to other sites. We are not responsible for the privacy practices of such external sites, though we try to link only to reputable sources.
                        </p>
                    </div>
                </div>
            </div>

        </div>

        <!-- Footer Note -->
        <div class="text-center mt-12 mb-8">
             <p class="text-sm text-slate-400 dark:text-slate-500">
                If you have any concerns about your privacy, please 
                <a href="/feedback" class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">contact us</a>.
             </p>
        </div>

      </div>
    </div>
  `
})
export class PrivacyComponent { }
