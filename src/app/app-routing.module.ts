import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'categories', loadChildren: () => import('./pages/categories/categories.module').then(mod => mod.CategoriesModule) },
  { path: 'entries', loadChildren: () => import('./pages/entries/entries.module').then(mod => mod.EntriesModule) },
  { path: 'reports', loadChildren: () => import('./pages/reports/reports.module').then(mod => mod.ReportsModule) },
  { path: '', redirectTo: '/reports', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
