import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './sync.routing';
import { FormsModule } from '@angular/forms';

import { SyncComponent } from './sync.component';
import { ServicesService } from '../../services/services.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastyModule } from 'ng2-toasty';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    ToastyModule,
    ChartsModule
  ],
  declarations: [
    SyncComponent
  ],
  providers: [
    ServicesService
  ]
})

export class SyncModule { }

