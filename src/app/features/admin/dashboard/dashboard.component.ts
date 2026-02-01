import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

interface DashboardStats {
  totalUsers: number;
  totalTools: number;
  totalCategories: number;
  pdfTools: number;
  aiTools: number;
  imageTools: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600 mb-8">Welcome to the admin dashboard</p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Total Users -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i class="fa-solid fa-users text-blue-600 text-xl"></i>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">{{ stats().totalUsers }}</p>
              <p class="text-gray-500 text-sm">Total Users</p>
            </div>
          </div>
        </div>

        <!-- Total Tools -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <i class="fa-solid fa-wrench text-purple-600 text-xl"></i>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">{{ stats().totalTools }}</p>
              <p class="text-gray-500 text-sm">Total Tools</p>
            </div>
          </div>
        </div>

        <!-- Total Categories -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i class="fa-solid fa-layer-group text-green-600 text-xl"></i>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">{{ stats().totalCategories }}</p>
              <p class="text-gray-500 text-sm">Categories</p>
            </div>
          </div>
        </div>

        <!-- PDF Tools -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <i class="fa-solid fa-file-pdf text-red-600 text-xl"></i>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">{{ stats().pdfTools }}</p>
              <p class="text-gray-500 text-sm">PDF Tools</p>
            </div>
          </div>
        </div>

        <!-- AI Tools -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <i class="fa-solid fa-pen-nib text-indigo-600 text-xl"></i>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">{{ stats().aiTools }}</p>
              <p class="text-gray-500 text-sm">AI Writing Tools</p>
            </div>
          </div>
        </div>

        <!-- Image Tools -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <i class="fa-solid fa-image text-orange-600 text-xl"></i>
            </div>
            <div>
              <p class="text-3xl font-bold text-gray-900">{{ stats().imageTools }}</p>
              <p class="text-gray-500 text-sm">Image Tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  stats = signal<DashboardStats>({
    totalUsers: 0,
    totalTools: 11,
    totalCategories: 3,
    pdfTools: 4,
    aiTools: 5,
    imageTools: 2
  });

  ngOnInit(): void {
    this.loadUserCount();
  }

  loadUserCount(): void {
    const token = this.authService.getToken();

    this.http.get<{ count: number }>(`${environment.apiUrl}/users/count`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.stats.update(s => ({ ...s, totalUsers: data.count }));
      },
      error: (err) => console.error('Failed to load user count:', err)
    });
  }
}

