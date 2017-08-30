import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './details.routing';
import { FormsModule } from '@angular/forms';

import { DetailsComponent } from './details.component';
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
    DetailsComponent
  ],
  providers: [
    ServicesService
  ]
})

export class DetailsModule { }

