import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { routes } from './admin.routing';

import { AdminComponent } from './admin.component';
import { ServicesService } from '../../services/services.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastyModule } from 'ng2-toasty';


@NgModule({
  imports: [
    CommonModule,
    // BrowserModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    ToastyModule
  ],
  declarations: [
    AdminComponent
  ],
  providers: [
    ServicesService
  ]
})

export class AdminModule { }

