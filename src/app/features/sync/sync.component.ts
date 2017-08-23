import { Component } from '@angular/core';
import { Service, ServicesService, ServiceDetail } from '../../services/services.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'my-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.css']
})

export class SyncComponent {
  errorMessage: string;
  serviceDetails = null;
  serviceId = 'HkZ9-FVOZ';

  public checkModel: any = 1;

  private latencyData;

  private latencySeries;
  private timeSeries;

  private finalTimeSeries;
  private finalLatencySeries;

  // private labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
  private labels;

  private datasets;

  private lineChartColors: Array<any> = [{ // grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }];

  private options = {
    scales: {
      yAxes: [{
        scaleLabel: {
          labelString: 'Latency in ms'
        },
        ticks: {
          fontColor: 'white',
          beginAtZero: true
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: 'white'
        }
      }]
    },
    legend: {
      labels: {
        fontColor: 'white'
      }
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
        this.latencyData = this.parseArrayObjectsForCharting(this.serviceDetails.status.lastHour.latency.list.reverse(), 't', 'l');
        this.latencySeries = this.latencyData.data;
        this.timeSeries = this.latencyData.time;

        this.labels = this.timeSeries;

        this.datasets = [
          {
            label: "Latency in milliseconds",
            data: this.latencySeries,
            pointBorderColor: 'blue',
            borderColor: 'blue'
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

