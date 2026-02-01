import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      
      <!-- Search and Filters -->
      <div class="bg-white rounded-xl shadow-md p-4 mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <!-- Search -->
          <div class="flex-1 min-w-[200px]">
            <div class="relative">
              <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                [(ngModel)]="search" 
                (input)="onSearchChange()"
                placeholder="Search by username or email..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500">
            </div>
          </div>

          <!-- Status Filter -->
          <select [(ngModel)]="statusFilter" (change)="loadUsers()" class="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>

          <!-- Role Filter -->
          <select [(ngModel)]="roleFilter" (change)="loadUsers()" class="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500">
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <!-- Sort -->
          <button (click)="toggleSort()" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <i class="fa-solid" [class]="sortOrder === 'asc' ? 'fa-arrow-up-a-z' : 'fa-arrow-down-z-a'"></i>
            {{ sortOrder === 'asc' ? 'A-Z' : 'Z-A' }}
          </button>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">#</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Avatar</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" (click)="setSortBy('username')">
                Username <i class="fa-solid fa-sort ml-1 text-xs"></i>
              </th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Role</th>
              <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th class="px-6 py-3 text-center text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            @if (loading()) {
              <tr>
                <td colspan="7" class="py-12 text-center text-gray-500">
                  <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
                  <p class="mt-2">Loading users...</p>
                </td>
              </tr>
            } @else if (users().length === 0) {
              <tr>
                <td colspan="7" class="py-12 text-center text-gray-500">
                  <p>No users found.</p>
                </td>
              </tr>
            } @else {
              @for (user of users(); track user._id; let i = $index) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ (pagination().page - 1) * pagination().limit + i + 1 }}</td>
                  <td class="px-6 py-4">
                    <div class="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {{ user.username.charAt(0).toUpperCase() }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ user.username }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                  <td class="px-6 py-4">
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      [class]="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      [class]="getStatusClass(user.status)">
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    @if (user._id !== currentUserId()) {
                      <button 
                        (click)="openEditModal(user)"
                        class="text-gray-500 hover:text-blue-600 mr-2"
                        title="Edit User">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button 
                        (click)="toggleStatus(user)"
                        class="mr-2"
                        [class]="user.status === 'active' ? 'text-yellow-500 hover:text-yellow-700' : 'text-green-500 hover:text-green-700'"
                        [title]="user.status === 'active' ? 'Suspend' : 'Activate'">
                        <i class="fa-solid" [class]="user.status === 'active' ? 'fa-user-slash' : 'fa-user-check'"></i>
                      </button>
                      <button 
                        (click)="deleteUser(user)"
                        class="text-red-500 hover:text-red-700"
                        title="Delete User">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    } @else {
                      <span class="text-gray-400 text-xs">Current User</span>
                    }
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
        
        <!-- Pagination -->
        @if (pagination().pages > 1) {
          <div class="px-6 py-4 border-t flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Showing {{ (pagination().page - 1) * pagination().limit + 1 }} to {{ Math.min(pagination().page * pagination().limit, pagination().total) }} of {{ pagination().total }} users
            </p>
            <div class="flex gap-2">
              <button 
                (click)="goToPage(pagination().page - 1)"
                [disabled]="pagination().page <= 1"
                class="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              @for (p of getPageNumbers(); track p) {
                <button 
                  (click)="goToPage(p)"
                  class="px-3 py-1 border rounded-lg"
                  [class]="p === pagination().page ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-gray-50'">
                  {{ p }}
                </button>
              }
              <button 
                (click)="goToPage(pagination().page + 1)"
                [disabled]="pagination().page >= pagination().pages"
                class="px-3 py-1 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Edit Modal -->
    @if (showEditModal()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" (click)="showEditModal.set(false)">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Edit User</h2>
          <form (ngSubmit)="saveUser()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input type="text" [(ngModel)]="editForm.username" name="username" class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" [(ngModel)]="editForm.email" name="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select [(ngModel)]="editForm.role" name="role" class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select [(ngModel)]="editForm.status" name="status" class="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500">
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div class="flex gap-3">
              <button type="button" (click)="showEditModal.set(false)" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);

  Math = Math;

  users = signal<User[]>([]);
  loading = signal(true);
  currentUserId = signal<string>('');
  pagination = signal<Pagination>({ page: 1, limit: 10, total: 0, pages: 0 });

  // Filters
  search = '';
  statusFilter = '';
  roleFilter = '';
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Edit modal
  showEditModal = signal(false);
  editingUser: User | null = null;
  editForm = { username: '', email: '', role: 'user', status: 'active' };

  private searchTimeout: any;

  ngOnInit(): void {
    this.currentUserId.set(this.authService.user()?._id || '');
    this.loadUsers();
  }

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadUsers(), 300);
  }

  loadUsers(page = 1): void {
    this.loading.set(true);
    const token = this.authService.getToken();

    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    });

    if (this.search) params.append('search', this.search);
    if (this.statusFilter) params.append('status', this.statusFilter);
    if (this.roleFilter) params.append('role', this.roleFilter);

    this.http.get<{ users: User[], pagination: Pagination }>(
      `${environment.apiUrl}/users?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (data) => {
        this.users.set(data.users);
        this.pagination.set(data.pagination);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.toastService.error('Failed to load users');
        this.loading.set(false);
      }
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-blue-100 text-blue-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }

  toggleSort(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.loadUsers();
  }

  setSortBy(field: string): void {
    if (this.sortBy === field) {
      this.toggleSort();
    } else {
      this.sortBy = field;
      this.loadUsers();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagination().pages) {
      this.loadUsers(page);
    }
  }

  getPageNumbers(): number[] {
    const pages = this.pagination().pages;
    const current = this.pagination().page;
    const range: number[] = [];

    for (let i = Math.max(1, current - 2); i <= Math.min(pages, current + 2); i++) {
      range.push(i);
    }
    return range;
  }

  openEditModal(user: User): void {
    this.editingUser = user;
    this.editForm = {
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status
    };
    this.showEditModal.set(true);
  }

  saveUser(): void {
    if (!this.editingUser) return;

    const token = this.authService.getToken();
    this.http.patch<User>(
      `${environment.apiUrl}/users/${this.editingUser._id}`,
      this.editForm,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (updatedUser) => {
        this.users.update(users =>
          users.map(u => u._id === updatedUser._id ? updatedUser : u)
        );
        this.toastService.success('User updated successfully');
        this.showEditModal.set(false);
      },
      error: (err) => {
        this.toastService.error(err.error?.error || 'Failed to update user');
      }
    });
  }

  toggleStatus(user: User): void {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const token = this.authService.getToken();

    this.http.patch<User>(
      `${environment.apiUrl}/users/${user._id}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: (updatedUser) => {
        this.users.update(users =>
          users.map(u => u._id === updatedUser._id ? updatedUser : u)
        );
        this.toastService.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
      },
      error: (err) => {
        this.toastService.error(err.error?.error || 'Failed to update status');
      }
    });
  }

  async deleteUser(user: User): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.username}? This will archive the user.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!confirmed) return;

    const token = this.authService.getToken();

    this.http.delete(`${environment.apiUrl}/users/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.users.update(users => users.filter(u => u._id !== user._id));
        this.pagination.update(p => ({ ...p, total: p.total - 1 }));
        this.toastService.success('User archived and deleted');
      },
      error: (err) => {
        this.toastService.error(err.error?.error || 'Failed to delete user');
      }
    });
  }
}
