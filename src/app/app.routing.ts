/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard.component';
import { NotFound404Component } from './not-found404.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'details', loadChildren: './features/details/index#DetailsModule' },
  { path: 'sync', loadChildren: './features/sync/index#SyncModule?sync=true' },
  { path: 'admin', loadChildren: './features/admin/index#AdminModule' },
  { path: '**', component: NotFound404Component }
];
