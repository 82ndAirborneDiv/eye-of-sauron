import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RequestBase } from './request-base';

export class Report {
  constructor(
    public service: JSON,
    public report: JSON
  ) { }
}

@Injectable()
export class SiteMonitorService extends RequestBase {
  constructor(private _http: Http) {
    super(_http);
  }

  getReports() {
    return this._http.get('/api/report/services')
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    body = <Report[]>body;
    let newBody = [];
    console.log(body[1].status.currentOutage);

    //get all down status
    for (let i = 0; i < body.length; i++) {
      if (body[i].status.currentOutage !== null) {
        newBody.push(body[i]);
      }
    }
    for (let i = 0; i < body.length; i++) {
      if (body[i].status.currentOutage === null) {
        newBody.push(body[i]);
      }
    }

    // console.log(newBody);
    return newBody || [];
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}