/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';

import { DashboardComponent } from './features/dashboard.component';
import { NotFound404Component } from './not-found404.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'details/:id', loadChildren: './features/details/index#DetailsModule' },
  { path: 'admin', loadChildren: './features/admin/index#AdminModule' },
  { path: '**', component: NotFound404Component }
];
