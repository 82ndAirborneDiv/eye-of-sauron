import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RequestBase } from './request-base';

export class Service {
  constructor(
    public name: string,
    public interval: number,
    public failureInterval: number,
    public url: string,
    public port: number,
    public timeout: number,
    public warningThreshold: number,
    public id: string,
    public host: string,
    public pingServiceName: string,
    public startMonitorTime: number
  ) { }
}

export class ServiceDetail {
  constructor(
    public service: Object,
    public status: Object
  ) { }
}

@Injectable()
export class ServicesService extends RequestBase {
  constructor(private _http: Http) {
    super(_http);
  }

  addService(hostBody) {
    let body = hostBody;

    return this._http.post('/api/sites/services', body, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  delete(id) {
    let url = '/api/sites/services/' + id;
    return this._http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  reset(id) {
    let url = '/api/sites/services/' + id + '/reset';
    return this._http.post(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  update(id, body) {
    let url = '/api/sites/services/' + id;
    return this._http.post(url, body, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getServices() {
    return this._http.get('/api/sites/services')
      .map((response: Response) => <Service[]>response.json())
      .catch(this.handleError);
  }

  getServicesById(id) {
    let url = '/api/services/' + id;
    return this._http.get(url, this.options)
      .map((response: Response) => <Service[]>response.json())
      .catch(this.handleError);
  }

  getServiceDetails(id) {
    // console.log(id);
    let url = '/api/report/services/' + id;
    return this._http.get(url, this.options)
      .map((response: Response) => <Service[]>response.json())
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    // console.log(body);
    return body || {};
  }
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
