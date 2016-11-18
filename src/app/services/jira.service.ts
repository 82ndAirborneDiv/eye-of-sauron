import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { RequestBase } from './request-base';

export class JiraReservations {  //Maybe not needed
  constructor(
    public report: JSON
  ) { }
}

@Injectable()
export class JiraService extends RequestBase {
  constructor(private _http: Http) {
    super(_http);
  }

  getReservations() {
    return this._http.get('/api/jira/reservations', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getIssues() {
    return this._http.get('/api/jira/issues', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUnresolved() {
    return this._http.get('/api/jira/unresolved', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    console.log(res);
    var body = res.json();
    // console.log(body);
    return body || {};
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
} 