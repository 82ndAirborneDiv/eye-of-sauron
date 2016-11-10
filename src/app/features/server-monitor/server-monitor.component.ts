import { Component } from '@angular/core';
import { SensorData, ServerMonitorService } from '../../services/server-monitor.service';

@Component({
  selector: 'server-monitor',
  templateUrl: './server-monitor.component.html',
  styleUrls: ['./server-monitor.component.css']
})

export class ServerMonitorComponent {
  errorMessage: string;
  sensorData: SensorData;

  constructor(
    private _serverMonitorService: ServerMonitorService
  ) { }

  ngOnInit() {
    this.getServerSensorData();
  }

  ngAfterContentInit() {
    setInterval(() => {
      this.getServerSensorData();
    }, 300000);
  }

  getServerSensorData() {
    this._serverMonitorService.getSensorData()
      .subscribe(
      sensorData => this.sensorData = sensorData,
      error => this.errorMessage = <any>error);
  }

  setStyle() {
    if (this.sensorData.temperature < 89) {
      return '#009688';
    } else if (this.sensorData.temperature >= 89 && this.sensorData.temperature < 93) {
      return '#EF6C00';
    } else {
      return '#C62828';
    }
  }

}