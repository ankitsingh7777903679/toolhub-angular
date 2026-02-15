import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-terms',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      <!-- Decorative Background Elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-cyan-100 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div class="max-w-4xl mx-auto relative z-10">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 mb-6 tracking-tight drop-shadow-sm">
            Terms & Conditions
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            We tried to keep this readable. No lawyer wrote this — just the people who built the site.
          </p>
          <div class="mt-4">
             <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800">
                <i class="fa-regular fa-clock mr-1.5"></i>
                Last Updated: February 2026
             </span>
          </div>
        </div>

        <div class="space-y-6">

            <!-- Section 1 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mt-1">
                        <i class="fa-solid fa-handshake"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">1. The Basics</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            If you're using 2olhub, you're agreeing to these terms. Pretty standard stuff. If something here doesn't sit right with you, that's totally okay — but in that case, this probably isn't the right site for you. And if we ever update these terms, the new version applies the moment you keep using the site after we post it.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 2 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-1">
                        <i class="fa-solid fa-gift"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">2. Yes, It's Really Free</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            Over 90% of the tools on 2olhub cost nothing. No registration wall, no "free trial that expires," no sneaky watermarks. You just open a tool and use it. We've been on the other side of those bait-and-switch sites, and it's annoying — so we don't do that.
                        </p>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            That said, we can't promise the site will be up every single second of every day. Sometimes things break, servers need updates, or the internet just decides to have a bad afternoon. We do our best to keep everything running, but "100% uptime" isn't a guarantee anyone can honestly make.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 3 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400 mt-1">
                        <i class="fa-solid fa-gavel"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">3. Don't Be That Person</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            Use the tools for legal stuff. That's really the main rule. More specifically, please don't:
                        </p>
                        <ul class="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1.5 ml-1">
                            <li>Upload anything illegal, harmful, or that violates someone else's rights</li>
                            <li>Try to hack into our servers or mess with other people's sessions</li>
                            <li>Run scripts or bots that hammer our infrastructure and ruin it for everyone else</li>
                            <li>Use our tools to spread malware or viruses</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Section 4 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mt-1">
                        <i class="fa-solid fa-file-shield"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">4. Your Stuff Is Your Stuff</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            Whatever you upload — PDFs, images, spreadsheets — that's yours. We don't claim ownership, we don't make copies, and we don't peek at your files. Most of the processing happens right in your browser anyway, so your data never even touches our servers.
                        </p>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            For AI tools like the blog writer or essay writer, your text gets sent to an AI service to generate the output. Once it's done, we don't keep your input or the result. But heads up — AI can sometimes write things that are wrong or a bit off, so give the output a quick read-through before you publish it anywhere important.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 5 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mt-1">
                        <i class="fa-solid fa-robot"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">5. AI Tools Have Limits</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            The AI features — blog writer, summarizer, image enhancer, background remover, and others — run on third-party models. They're powerful, but they're not magic. A few things to keep in mind:
                        </p>
                        <ul class="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1.5 ml-1 mb-3">
                            <li>They might slow down or become temporarily unavailable when lots of people are using them at once</li>
                            <li>The quality of the output depends pretty heavily on what you put in</li>
                            <li>Longer or more complex tasks naturally take more time to process</li>
                        </ul>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Bottom line: AI output is a starting point, not a finished product. Always double-check before using it for anything that matters. We can't be held responsible if the AI writes something that turns out to be factually wrong or inappropriate.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 6 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 mt-1">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">6. The "No Guarantees" Part</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            Look, we put a lot of work into making these tools reliable. But we're a small team, and stuff happens. The site is provided "as is" — meaning we can't guarantee everything will always work perfectly 100% of the time. Specifically, we're not on the hook for:
                        </p>
                        <ul class="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1.5 ml-1">
                            <li>A tool being temporarily unavailable or acting weird during an update</li>
                            <li>Files that get corrupted during processing (always keep your originals!)</li>
                            <li>AI-generated text that contains mistakes or says something odd</li>
                            <li>Random downtime because a server decided it needed a nap</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Section 7 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mt-1">
                        <i class="fa-solid fa-message"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">7. Feedback & Playing Nice</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            We genuinely love hearing from people who use the site. Got an idea? Found a bug? Want a new tool? Head over to our <a routerLink="/feedback" class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline">feedback page</a> and let us know. Just keep it respectful — our moderation will filter out anything abusive or spammy, because nobody wants to wade through that. Constructive criticism? Always welcome. Telling us our PDF merger saved your deadline? That honestly makes our day.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Section 8 -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/20 dark:border-slate-800 p-8 transition-all duration-300 hover:shadow-md">
                <div class="flex items-start space-x-4">
                     <div class="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mt-1">
                        <i class="fa-solid fa-rotate"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">8. Updates to These Terms</h3>
                        <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                            We might tweak these terms every once in a while. When that happens, we'll update the date at the top of this page. Nothing sneaky — if you keep using the site after a change, that means you're cool with the new version. Check back occasionally if you're curious.
                        </p>
                    </div>
                </div>
            </div>

        </div>

        <!-- Footer Note -->
        <div class="text-center mt-12 mb-8">
             <p class="text-sm text-slate-400 dark:text-slate-500">
                Questions about any of this? Hit us up on the
                <a href="/feedback" class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">feedback page</a>.
             </p>
        </div>

      </div>
    </div>
  `
})
export class TermsComponent { }
