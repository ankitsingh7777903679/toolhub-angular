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
            Short version: we don't want your data. Seriously. Here's the full explanation.
          </p>
          <div class="mt-4">
             <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                <i class="fa-regular fa-clock mr-1.5"></i>
                Last Updated: February 2026
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
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">1. Your Files Stay With You</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            Here's something most people don't realize about 2olhub — over 90% of our tools run completely inside your browser. That means when you upload a PDF to merge or an image to compress, the file literally never leaves your computer. We couldn't peek at it even if we tried, because the work happens on your machine, not ours.
                        </p>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Now, a handful of tools do need a server — things like AI background removal and image enhancement require heavy models that browsers can't handle yet. For those, your file travels over an encrypted connection, gets processed in memory, and poof — it's gone the moment your result is ready. Nothing gets saved on our end. Zero. Zilch.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 2 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400 mt-1">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">2. About the AI Tools</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            Some of our tools — like the blog writer, image enhancer, and background remover — talk to AI services behind the scenes. When you use them, your input gets sent to those AI providers for processing. We don't hang onto your input or the output after the job is done.
                        </p>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            One heads up: AI tools can sometimes get busy or hit their limits, especially during peak hours. That's just the reality of running free AI services — the servers have a ceiling, and sometimes everybody's knocking at once. We do our best to keep things running smoothly, though.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 3 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-1">
                        <i class="fa-solid fa-gift"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">3. It's Actually Free</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            We know everyone says "free" these days and then hits you with a paywall on step three. That's not us. Over 90% of the tools here work without an account, without limits, and without watermarks slapped on your output. We're not going to suddenly lock features behind a subscription or sell your data to make money. That's a promise.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 4 -->
             <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mt-1">
                        <i class="fa-solid fa-cookie-bite"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">4. Cookies & Preferences</h3>
                         <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            We use your browser's local storage to remember small things — like whether you prefer dark mode or which tools you used recently. That's it. We're not dropping third-party tracking cookies to follow you around the internet or building some secret profile about you. Your browsing habits are your business, not ours.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 5 -->
             <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400 mt-1">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">5. Keeping Things Secure</h3>
                         <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            For the few tools that do talk to our servers, everything goes through HTTPS — that's the encrypted padlock thing you see in your browser's address bar. Your files get processed and then immediately discarded. We don't share them with anyone, period. We built 2olhub the way we'd want it if we were the ones uploading personal documents, and that means treating your stuff with respect.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 6 -->
             <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 mt-1">
                        <i class="fa-solid fa-link"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">6. Links to Other Websites</h3>
                         <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            You might come across links to other websites while using 2olhub. Once you click one of those and leave our site, we can't control what they do with your data. We try to link to trustworthy places, but it's always a good idea to check their privacy policies yourself before handing over anything personal.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 7 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mt-1">
                        <i class="fa-solid fa-rotate"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">7. If We Update This Page</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            If anything changes about how we handle privacy, we'll update this page and bump the date at the top. We're not going to bury changes in legal jargon — if something important shifts, you'll be able to tell. Swing by every now and then to stay in the loop.
                        </p>
                    </div>
                </div>
            </div>

        </div>

        <!-- Footer Note -->
        <div class="text-center mt-12 mb-8">
             <p class="text-sm text-slate-400 dark:text-slate-500">
                Questions about your privacy? Drop us a note on the
                <a href="/feedback" class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">feedback page</a>.
             </p>
        </div>

      </div>
    </div>
  `
})
export class PrivacyComponent { }
