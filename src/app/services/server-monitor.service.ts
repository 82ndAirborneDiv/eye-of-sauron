import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RequestBase } from './request-base';

export class SensorData {
  constructor(
    public errors: number,
    public isValid: boolean,
    public temperature: number,
    public humidity: number
  ) { }
}

@Injectable()
export class ServerMonitorService {
  constructor(private _http: Http) { }

  getSensorData() {
    let path = '/api/sensor/data'

    return this._http.get(path)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      console.log(res);
      throw new Error('Bad response status: ' + res.status);
    }
    var body = res.json();
    return body || {};
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}