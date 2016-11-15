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
    public created: number
  ) { }
}

@Injectable()
export class ServicesService extends RequestBase {
  constructor(private _http: Http) {
    super(_http);
  }

  addService(hostBody) {
    let body = hostBody;

    return this._http.post('/api/services', body, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteService(serviceId) {
    //TODO
  }

  getServices() {
    return this._http.get('/api/sites/services')
      .map((response: Response) => <Service[]>response.json())
      // .do(Response => console.log(Response))
      .catch(this.handleError);
  }

  getServicesById(id) {
    return this._http.get('/api/services/:id', id)
      .map((response: Response) => <Service[]>response.json())
      // .do(Response => console.log(Response))
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body || {};
  }
  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
