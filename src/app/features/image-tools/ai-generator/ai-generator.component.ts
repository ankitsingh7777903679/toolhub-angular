import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

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
export class AiGeneratorComponent {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  prompt = '';
  isGenerating = false;
  generatedImages: GeneratedImage[] = [];
  errorMessage = '';

  private readonly API_URL = environment.apiUrl.replace('/api', ''); // Remove /api since some endpoints might use base URL

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
