import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

@Component({
  selector: 'app-ai-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-generator.component.html',
  styleUrl: './ai-generator.component.scss'
})
export class AiGeneratorComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private analyticsService = inject(AnalyticsService);
  private seoService = inject(SeoService);

  prompt = '';
  isGenerating = false;
  generatedImages: GeneratedImage[] = [];
  errorMessage = '';

  private readonly API_URL = environment.apiUrl.replace('/api', ''); // Remove /api since some endpoints might use base URL

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Free AI Image Generator - Text to Image Online',
      description: 'Generate unique images from text descriptions using AI. Create art, illustrations, and photos instantly with our free AI image generator.',
      keywords: 'ai image generator, text to image, free ai art generator, online image generator, create images with ai',
      url: 'https://2olhub.netlify.app/image/ai-generator'
    });
    this.seoService.setFaqJsonLd([
      { question: 'Is this actually free?', answer: 'Yes — no cost, no account required, no usage caps. Generate as many images as you want.' },
      { question: 'Can I use these images commercially?', answer: 'Yes, the images you generate are yours. Use them for marketing, merchandise, publications, social media — whatever you need.' },
      { question: 'Why does the same prompt give different results each time?', answer: 'The generation process includes a random seed, so every output is unique. If you don\'t love the first result, just run it again.' },
      { question: 'How long does it take?', answer: 'Usually 5 to 15 seconds, depending on how busy the server is.' },
      { question: 'What resolution do I get?', answer: 'High enough for social media, blog posts, and presentations. For most digital uses they\'re ready to go.' }
    ]);
  }

  async generateImages(): Promise<void> {
    if (!this.prompt.trim() || this.isGenerating) return;

    this.isGenerating = true;
    this.errorMessage = '';
    this.generatedImages = [];

    const currentPrompt = this.prompt;

    try {
      console.log('🎨 Calling API:', `${this.API_URL}/api/image/generate`);

      const response = await firstValueFrom(
        this.http.post<{ success: boolean, images: string[], prompt: string }>(
          `${this.API_URL}/api/image/generate`,
          {
            prompt: currentPrompt,
            count: 1
          }
        )
      );

      console.log('✅ Response received:', response);

      if (response && response.success && response.images) {
        this.generatedImages = response.images.map((url, index) => ({
          id: `${Date.now()}_${index}`,
          url: url,  // Use HuggingFace URL directly
          prompt: currentPrompt
        }));

        console.log('✅ Generated images:', this.generatedImages);
        this.analyticsService.trackToolUsage('ai-generator', 'AI Image Generator', 'image');
      } else {
        throw new Error('No images generated');
      }

    } catch (error: any) {
      console.error('❌ Generation error:', error);

      if (error.status === 0) {
        this.errorMessage = 'Cannot connect to server. Please make sure the API is running on http://localhost:3000';
      } else {
        this.errorMessage = error.error?.message || error.message || 'Failed to generate images. Please try again.';
      }
    } finally {
      this.isGenerating = false;
      this.cdr.detectChanges();
    }
  }

  async downloadImage(image: GeneratedImage): Promise<void> {
    try {
      // Fetch the image as a blob to handle cross-origin properly
      const response = await fetch(image.url);
      const blob = await response.blob();

      // Create a blob URL for download
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ai-generated-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(image.url, '_blank');
    }
  }
}
