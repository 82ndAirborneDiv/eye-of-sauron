import { Component } from '@angular/core';
import { Service, ServicesService } from '../../services/services.service';

// const SERVICES: Service[] = [
//   { id: '11', name: 'IIU', url: 'http://www.phiresearchlab.org', timeout: 10000, port: 80, interval: 60000, failureInterval: 30000, warningThreshold: 30000, host: 'IIU', pingServiceName: 'http-head' },
//   { id: '12', name: 'Anubis', url: 'http://www.anubis.phiresearchlab.org', timeout: 10000, port: 80, interval: 60000, failureInterval: 30000, warningThreshold: 30000, host: 'IIU', pingServiceName: 'http-head' },
//   { id: '13', name: 'Commsphere', url: 'http://www.commsphere.phiresearchlab.org', timeout: 10000, port: 80, interval: 60000, failureInterval: 30000, warningThreshold: 30000, host: 'IIU', pingServiceName: 'http-head' },
//   { id: '14', name: 'Jupiter', url: 'http://www.jupiter.phiresearchlab.org', timeout: 10000, port: 80, interval: 60000, failureInterval: 30000, warningThreshold: 30000, host: 'IIU', pingServiceName: 'http-head' },
//   { id: '15', name: 'Apollo', url: 'http://www.apollo.phiresearchlab.org', timeout: 10000, port: 80, interval: 60000, failureInterval: 30000, warningThreshold: 30000, host: 'IIU', pingServiceName: 'http-head' },
//   { id: '16', name: 'Edemo', url: 'http://www.edemo.phiresearchlab.org', timeout: 10000, port: 80, interval: 60000, failureInterval: 30000, warningThreshold: 30000, host: 'IIU', pingServiceName: 'http-head' },
//   { id: '17', name: 'MMWR Case', url: 'http://www.mmwrcase.phiresearchlab.org', timeout: 10000, port: 80, interval: 60000, failureInterval: 30000, warningThreshold: 30000, host: 'IIU', pingServiceName: 'http-head' },
//   { id: '18', name: 'View', url: 'http://www.view.phiresearchlab.org', timeout: 10000, port: 80, interval: 60000, failureInterval: 30000, warningThreshold: 30000, host: 'IIU', pingServiceName: 'http-head' },
//   { id: '19', name: 'App lab', url: 'http://www.applab.phiresearchlab.org', timeout: 10000, port: 80, interval: 60000, failureInterval: 30000, warningThreshold: 30000, host: 'IIU', pingServiceName: 'http-head' }
// ];

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent {
  errorMessage: string;
  services: Service[];
  isNew = false;

  // services = SERVICES;
  selectedService: Service = null;

  constructor(private _serviceService: ServicesService) { }

  ngOnInit() {
    this.getServices();
  }

  onSelect(service: Service): void {
    this.selectedService = service;
  }

  toggleAdd(): void {
    this.isNew = true;
    this.selectedService = { id: '', name: '', url: '', timeout: 10000, port: 80, interval: 60000, failureInterval: 30000, warningThreshold: 30000, host: '', pingServiceName: 'http-head' };
  }

  reset(id): void {
    this._serviceService.reset(id)
      .subscribe(
      service => {

      },
      error => this.errorMessage = <any>error
      )
  }

  save(service): void {
    if (this.isNew) {
      this._serviceService.addService(service)
        .subscribe(
        service => {
          this.getServices();
          this.selectedService = null;
          this.isNew = false;
        },
        error => this.errorMessage = <any>error
        )
    } else {
      this._serviceService.update(service.id, service)
        .subscribe(
        service => {
          this.getServices();
          this.selectedService = null;
          this.isNew = false;
        },
        error => this.errorMessage = <any>error
        )
    }

  }

  delete(id): void {
    this._serviceService.delete(id)
      .subscribe(
      service => {
        this.services = this.services.filter(s => s.id !== service.id);
        if (this.selectedService.id === service.id) {
          this.selectedService = null;
        }
      },
      error => this.errorMessage = <any>error
      );
  }

  getServices(): void {
    this._serviceService.getServices()
      .subscribe(
      services => this.services = services,
      error => this.errorMessage = <any>error
      );
  }
}