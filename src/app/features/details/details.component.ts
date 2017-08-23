import { Component } from '@angular/core';
import { Service, ServicesService, ServiceDetail } from '../../services/services.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'details',
  templateUrl: './details.component.html'
  // styleUrls: ['./details.component.css']
})

export class DetailsComponent {
  errorMessage: string;
  serviceDetails = null;
  serviceId = 'S1qkzYV_b';

  private latencyData;

  private latencySeries;
  private timeSeries;

  private finalTimeSeries;
  private finalLatencySeries;

  // private labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
  private labels;

  private datasets;

  private options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  constructor(
    private _serviceService: ServicesService,
    private _toastyService: ToastyService,
    private _toastyConfig: ToastyConfig
  ) {
    this._toastyConfig.theme = 'material';
  }

  ngOnInit() {
    this.getServicesDetails(this.serviceId);
  }

  getServicesDetails(id): void {
    let status;
    let last24Hours;
    this._serviceService.getServiceDetails(id)
      .subscribe(
      serviceDetails => {
        this.serviceDetails = serviceDetails
        this.latencyData = this.parseArrayObjectsForCharting(this.serviceDetails.status.lastHour.latency.list, 't', 'l');
        this.latencySeries = this.latencyData.data;
        this.timeSeries = this.latencyData.time;

        this.labels = this.timeSeries;

        this.datasets = [
          {
            label: "Latency(ms) Last Hour",
            data: this.latencySeries
          }
        ];
        console.log('datasets: ', this.datasets);
      },
      error => this.errorMessage = <any>error
      );
  }


  parseArrayObjectsForCharting(arr, fieldTime, fieldData) {
    var time = [];
    var latency = [];
    for (var i = 0; i < arr.length; i++) {
      time.push(new Date(arr[i][fieldTime]));
      latency.push(Math.round(arr[i][fieldData]));
    }
    return { time: time, data: latency };
  }
}
