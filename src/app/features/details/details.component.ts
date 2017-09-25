import { Component, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Service, ServicesService, ServiceDetail } from '../../services/services.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { BaseChartDirective } from 'ng2-charts';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'my-sync',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})


export class DetailsComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  errorMessage: string;
  serviceDetails = null;
  idParam: any;

  private hourActive;
  private twoFourHoursActive = 'active';
  private weekActive;

  private hour = 0;
  private twoFour = 1;
  private week = 2;

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

  private lastOutage;
  private lastOutageDuration;
  private hasOutage = false;

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
          fontColor: 'white',
          minRotation: 90,
          maxRotation: 90
        },
        type: 'time',
        distribution: 'series',
        time: {
          displayFormats: {
            minute: 'MM/DD, h:mm a',
            hour: 'MM/DD, h:mm a'
          }
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
    private _toastyConfig: ToastyConfig,
    private _route: ActivatedRoute
  ) {
    this._toastyConfig.theme = 'material';
  }

  ngOnInit() {
    this._route.params.subscribe(
      idParam => {
        this.idParam = idParam
      }
    )
    this.getServicesDetails(this.idParam.id);

  }


  getLatencyData(option): void {
    // console.log('serviceDetails: ', this.serviceDetails);
    console.log('Passed option: ', option);
    if (this.serviceDetails) {
      switch (option) {
        case 0:
          this.latencyData = this.parseArrayObjectsForCharting(this.serviceDetails.status.lastHour.latency.list, 't', 'l');
          this.twoFourHoursActive = '';
          this.hourActive = 'active';
          this.weekActive = '';
          break;
        case 2:
          this.latencyData = this.parseArrayObjectsForCharting(this.serviceDetails.status.lastWeek.latency.list, 't', 'l');
          this.twoFourHoursActive = '';
          this.hourActive = '';
          this.weekActive = 'active';
          break;
        default:
          this.latencyData = this.parseArrayObjectsForCharting(this.serviceDetails.status.last24Hours.latency.list, 't', 'l');
          this.twoFourHoursActive = 'active';
          this.hourActive = '';
          this.weekActive = '';
      }

      this.latencySeries = this.latencyData.data;
      this.timeSeries = this.latencyData.time;

      this.labels = this.timeSeries.reverse();

      this.datasets = [
        {
          label: "Latency in ms",
          data: this.latencySeries.reverse(),
          pointBorderColor: 'blue',
          borderColor: 'blue'
        }
      ];
      this.reloadChart();
    }
  }

  reloadChart() {
    // console.log('reloadChart fires');
    // console.log('chart: ', this.chart);
    if (this.chart !== undefined) {
      this.chart.chart.destroy();
      this.chart.chart = 0;

      this.chart.datasets = this.datasets;
      this.chart.labels = this.labels;
      this.chart.ngOnInit();
    }
  }

  getServicesDetails(id): void {
    let lastElement;

    this._serviceService.getServiceDetails(id)
      .subscribe(
      serviceDetails => {
        console.log('Service Details: ', serviceDetails);
        this.serviceDetails = serviceDetails;
        if (serviceDetails.status.latestOutages.length > 0) {
          this.hasOutage = true;
          this.lastOutage = serviceDetails.status.latestOutages[serviceDetails.status.latestOutages.length - 1];
          this.lastOutageDuration = this.millisToMinutesAndSeconds(serviceDetails.status.latestOutages[serviceDetails.status.latestOutages.length - 1].downtime);
        }
        this.getLatencyData(0);
      },
      error => this.errorMessage = <any>error
      );
  }

  millisToMinutesAndSeconds(millis) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + seconds;
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

