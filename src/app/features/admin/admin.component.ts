import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-900">Admin Panel</h2>
        </div>
        <nav class="mt-6">
          <a 
            routerLink="dashboard" 
            routerLinkActive="bg-primary text-white"
            class="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
            <i class="fa-solid fa-gauge-high"></i>
            Dashboard
          </a>
          <a 
            routerLink="add-tool" 
            routerLinkActive="bg-primary text-white"
            class="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
            <i class="fa-solid fa-plus"></i>
            Add Tool
          </a>
          <a 
            routerLink="users" 
            routerLinkActive="bg-primary text-white"
            class="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
            <i class="fa-solid fa-users"></i>
            Users
          </a>
          <a 
            routerLink="deleted-users" 
            routerLinkActive="bg-primary text-white"
            class="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
            <i class="fa-solid fa-trash-can"></i>
            Deleted Users
          </a>
          <a 
            routerLink="analytics" 
            routerLinkActive="bg-primary text-white"
            class="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors">
            <i class="fa-solid fa-chart-simple"></i>
            Tool Analytics
          </a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminComponent { }
