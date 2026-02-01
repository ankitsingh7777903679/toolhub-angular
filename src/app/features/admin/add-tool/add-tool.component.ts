import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-add-tool',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Add New Tool</h1>
      
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Form -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <form>
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2 md:col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Tool Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="tool.name"
                  name="name"
                  placeholder="Enter tool name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
              </div>

              <div class="col-span-2 md:col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Icon Class</label>
                <input 
                  type="text" 
                  [(ngModel)]="tool.iconClass"
                  name="iconClass"
                  placeholder="fa-solid fa-file"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Icon Color</label>
                <input 
                  type="color" 
                  [(ngModel)]="tool.iconColor"
                  name="iconColor"
                  class="w-full h-12 border border-gray-300 rounded-lg">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                <input 
                  type="color" 
                  [(ngModel)]="tool.bgIconColor"
                  name="bgIconColor"
                  class="w-full h-12 border border-gray-300 rounded-lg">
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  [(ngModel)]="tool.description"
                  name="description"
                  rows="3"
                  placeholder="Enter description"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none">
                </textarea>
              </div>

              <div class="col-span-2 md:col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  [(ngModel)]="tool.category"
                  name="category"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                  <option value="pdf">PDF Tools</option>
                  <option value="image">Image Tools</option>
                  <option value="write">AI Write</option>
                  <option value="video">Video Tools</option>
                  <option value="converter">Converter</option>
                </select>
              </div>

              <div class="col-span-2 md:col-span-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Tool Link</label>
                <input 
                  type="text" 
                  [(ngModel)]="tool.link"
                  name="link"
                  placeholder="/pdf/split"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
              </div>

              <div class="col-span-2">
                <button 
                  type="submit"
                  class="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  Add Tool
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Preview -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="font-bold text-lg text-gray-900 mb-4">Live Preview</h2>
          <div class="flex justify-center">
            <div class="bg-white rounded-xl p-5 shadow-md w-64">
              <div class="flex justify-between items-start mb-3">
                <div 
                  class="w-12 h-12 rounded-xl flex items-center justify-center"
                  [style.backgroundColor]="tool.bgIconColor">
                  <i [class]="tool.iconClass + ' text-xl'" [style.color]="tool.iconColor"></i>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="font-bold text-gray-900 mb-1">{{ tool.name || 'Tool Name' }}</h3>
                  <p class="text-gray-500 text-sm">{{ tool.description || 'Tool Description' }}</p>
                </div>
                <i class="fa-solid fa-arrow-right text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AddToolComponent {
    tool = {
        name: '',
        iconClass: 'fa-solid fa-file',
        iconColor: '#6366F1',
        bgIconColor: '#E0E7FF',
        description: '',
        category: 'pdf',
        link: ''
    };
}
