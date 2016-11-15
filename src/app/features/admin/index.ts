import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './admin.routing';

import { AdminComponent } from './admin.component';
import { ServicesService } from '../../services/services.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    AdminComponent
  ],
  providers: [
    ServicesService
  ]
})

export class AdminModule { }

