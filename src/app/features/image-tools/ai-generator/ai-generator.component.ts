import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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

  private readonly API_URL = 'http://localhost:3000';

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
          url: `${this.API_URL}${url}`,
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

  downloadImage(image: GeneratedImage): void {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `generated-${image.id}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
