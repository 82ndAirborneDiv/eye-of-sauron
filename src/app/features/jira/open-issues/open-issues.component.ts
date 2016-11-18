import { Component } from '@angular/core';
import { JiraReservations, JiraService } from '../../../services/jira.service';

@Component({
  selector: 'open-issues',
  templateUrl: './open-issues.component.html',
  styleUrls: ['./open-issues.component.css']
})

export class OpenIssuesComponent {
  errorMessage: string;
  unresolvedList: JiraReservations[];

  constructor(
    private _jiraService: JiraService
  ) { }

  ngOnInit() {
    this.getUnresolvedList();
  }

  getUnresolvedList() {
    this._jiraService.getUnresolved()
      .subscribe(
      unresolvedList => this.unresolvedList = unresolvedList,
      error => this.errorMessage = <any>error
      );
  }
}