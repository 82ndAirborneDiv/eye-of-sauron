import { Component } from '@angular/core';
import { Service, ServicesService } from '../../services/services.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html'
  // styleUrls: ['./admin.component.css']
})

export class AdminComponent {
  errorMessage: string;
  services: Service[];

  constructor(private _serviceService: ServicesService) { }

  ngOnInit() {
    this.getServices();
  }

  getServices() {
    this._serviceService.getServices()
      .subscribe(
      services => this.services = services,
      error => this.errorMessage = <any>error
      );
  }
}