import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { WeatherReport, WeatherService } from '../../services/weather.service';

@Component({
  selector: 'weather-widget',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})


export class WeatherComponent {
  errorMessage: string;
  weatherReport: WeatherReport;

  constructor(
    private _weatherService: WeatherService
  ) { }

  ngOnInit() {
    // this.getCurrentWeather(); temporarily deactivate to not use up all the hits whiles testing
  }

  ngAfterContentInit() {
    setInterval(() => {
      this.getCurrentWeather();
    }, 900000);
  }

  getCurrentWeather() {
    this._weatherService.getCurrentConditions()
      .subscribe(
      weather => this.weatherReport = weather,
      error => this.errorMessage = <any>error
      );
  }

  setStyle() {
    if (this.weatherReport.current_observation.temp_f <= 72) {
      return '#00BCD4';
    } else if (this.weatherReport.current_observation.temp_f >= 72 && this.weatherReport.current_observation.temp_f < 85) {
      return '#EF6C00';
    } else {
      return '#C62828';
    }
  }

}