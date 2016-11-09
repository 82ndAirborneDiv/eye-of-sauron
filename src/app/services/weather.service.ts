import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RequestBase } from './request-base';

export class WeatherReport {
  constructor(
    public response: JSON,
    public current_observation: any
  ) { }
}

@Injectable()
export class WeatherService extends RequestBase {
  constructor(private _http: Http) {
    super(_http);
  }

  getCurrentConditions() {
    let state = 'GA';
    let city = 'Atlanta';
    let zip = 'zmw:30345.1.99999';
    let query = 'https://api.wunderground.com/api/ce3119b0728c4a4c/conditions/q/' + state + '/' + city + '/' + zip + '.json'
    return this._http.get(query)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    var body = res.json();
    body = <WeatherReport>body;
    // console.log(body);
    return body || {};
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}