import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
        <h1 class="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Terms and Conditions</h1>
        
        <div class="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p><strong>Last Updated: January 2026</strong></p>

          <section>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h3>
            <p>By accessing and using 2olhub, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">2. Use of Services</h3>
            <p>You agree to use our services only for lawful purposes. You are prohibited from using our tools to upload, process, or generate content that is illegal, harmful, threatening, or violates the rights of others.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">3. User Content</h3>
            <p>We do not claim ownership of the content you process through our tools. You retain all rights to your original files. However, by using our AI generation tools, you agree that we may process your input to generate the requested output.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">4. Limitation of Liability</h3>
            <p>2olhub is provided "as is" without any warranties. We shall not be liable for any damages resulting from the use or inability to use our services.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold text-gray-800 mb-3">5. Feedback Policy</h3>
            <p>We welcome your feedback. Please note that our Feedback system uses AI moderation. We reserve the right to remove or block content that contains abusive language or violates our community standards.</p>
          </section>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent { }
