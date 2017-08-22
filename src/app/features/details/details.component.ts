import { Component } from '@angular/core';
import { Service, ServicesService, ServiceDetail } from '../../services/services.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent {
  errorMessage: string;
  serviceDetails: ServiceDetail;
  serviceId = 'HkZ9-FVOZ';

  private latencyArray = [
    { 'l': 6474.285714285715, 't': 1503349200000 },
    { 'l': 7284.811320754717, 't': 1503345600000 },
    { 'l': 3564.877551020408, 't': 1503342000000 },
    { 'l': 1705.7931034482758, 't': 1503338400000 },
    { 'l': 2754.703703703704, 't': 1503334800000 },
    { 'l': 2594.5, 't': 1503331200000 }
  ];

  private latencyData;

  private latencySeries;
  private timeSeries;

  private finalTimeSeries;
  private finalLatencySeries;


  // private labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
  private labels;

  private datasets = [];

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


    this.latencyData = this.parseArrayObjectsForCharting(this.latencyArray, 't', 'l');
    // console.log(this.serviceDetails);
    // status = this.serviceDetails.status;
    // console.log('status object: ', status);
    // last24Hours = status.last24Hours.latency.list;
    // console.log('last24Hours: ', last24Hours);
    // this.latencyData = this.parseArrayObjectsForCharting(last24Hours, 't', 'l');

    this.latencySeries = this.latencyData.data;
    this.timeSeries = this.latencyData.time;


    this.labels = this.timeSeries;

    this.datasets = [
      {
        label: "Latency Last 24 Hours",
        data: this.latencySeries
      }
    ];
  }

  getServicesDetails(id): void {
    let status;
    let last24Hours;
    this._serviceService.getServiceDetails(id)
      .subscribe(
      serviceDetails => {
        this.serviceDetails = serviceDetails

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
