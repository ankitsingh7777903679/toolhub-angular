import { Routes } from '@angular/router';

export const FILE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./file-tools.component').then(m => m.FileToolsComponent)
    },
    {
        path: 'excel-to-csv',
        loadComponent: () => import('./excel-to-csv/excel-to-csv.component').then(m => m.ExcelToCsvComponent)
    },
    {
        path: 'csv-to-excel',
        loadComponent: () => import('./csv-to-excel/csv-to-excel.component').then(m => m.CsvToExcelComponent)
    },
    {
        path: 'excel-to-json',
        loadComponent: () => import('./excel-to-json/excel-to-json.component').then(m => m.ExcelToJsonComponent)
    },
    {
        path: 'json-to-excel',
        loadComponent: () => import('./json-to-excel/json-to-excel.component').then(m => m.JsonToExcelComponent)
    },
    {
        path: 'image-to-csv',
        loadComponent: () => import('./image-to-csv/image-to-csv.component').then(m => m.ImageToCsvComponent)
    },
    {
        path: 'image-to-excel',
        loadComponent: () => import('./image-to-excel/image-to-excel.component').then(m => m.ImageToExcelComponent)
    }
];
