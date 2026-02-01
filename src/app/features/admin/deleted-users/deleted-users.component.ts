import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';

interface DeletedUser {
  _id: string;
  originalId: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  status: string;
  originalCreatedAt: string;
  deletedAt: string;
  reason: string;
}

@Component({
  selector: 'app-deleted-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Deleted Users Archive</h1>
        <span class="text-gray-500 text-sm">{{ deletedUsers().length }} archived users</span>
      </div>
      
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">#</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Avatar</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Username</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Deleted At</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Reason</th>
              <th class="px-6 py-3 text-center text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            @if (loading()) {
              <tr>
                <td colspan="7" class="py-12 text-center text-gray-500">
                  <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
                  <p class="mt-2">Loading deleted users...</p>
                </td>
              </tr>
            } @else if (deletedUsers().length === 0) {
              <tr>
                <td colspan="7" class="py-12 text-center text-gray-500">
                  <i class="fa-solid fa-trash-can text-4xl mb-3 text-gray-300"></i>
                  <p>No deleted users in archive.</p>
                </td>
              </tr>
            } @else {
              @for (user of deletedUsers(); track user._id; let i = $index) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ i + 1 }}</td>
                  <td class="px-6 py-4">
                    <div class="w-10 h-10 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ user.username }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(user.deletedAt) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ user.reason }}</td>
                  <td class="px-6 py-4 text-center">
                    <button 
                      (click)="restoreUser(user)"
                      class="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors">
                      <i class="fa-solid fa-rotate-left mr-1"></i> Restore
                    </button>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
      
      <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p class="text-yellow-800 text-sm">
          <i class="fa-solid fa-circle-info mr-2"></i>
          <strong>Note:</strong> Restored users will need to reset their password to login again.
        </p>
      </div>
    </div>
  `
})
export class DeletedUsersComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);

  deletedUsers = signal<DeletedUser[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadDeletedUsers();
  }

  loadDeletedUsers(): void {
    this.loading.set(true);
    const token = this.authService.getToken();

    this.http.get<DeletedUser[]>(`${environment.apiUrl}/users/deleted`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (users) => {
        this.deletedUsers.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading deleted users:', err);
        this.toastService.error('Failed to load deleted users');
        this.loading.set(false);
      }
    });
  }

  async restoreUser(user: DeletedUser): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Restore User',
      message: `Restore ${user.username}? They will need to reset their password.`,
      confirmText: 'Restore',
      cancelText: 'Cancel',
      type: 'info'
    });

    if (!confirmed) return;

    const token = this.authService.getToken();

    this.http.post(`${environment.apiUrl}/users/restore/${user._id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.deletedUsers.update(users => users.filter(u => u._id !== user._id));
        this.toastService.success(`${user.username} restored successfully!`);
      },
      error: (err) => {
        this.toastService.error(err.error?.error || 'Failed to restore user');
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
