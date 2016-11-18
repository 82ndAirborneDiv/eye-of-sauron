import { Component } from '@angular/core';
import { JiraReservations, JiraService } from '../../../services/jira.service';

@Component({
  selector: 'jira-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})

export class JiraReservationComponent {
  errorMessage: string;
  jiraReservations: JiraReservations[];

  constructor(
    private _jiraService: JiraService
  ) { }

  ngOnInit() {
    this.getJiraReservations();
  }

  getJiraReservations() {
    this._jiraService.getReservations()
      .subscribe(
      jiraReservations => {
        this.jiraReservations = jiraReservations
      },
      error => this.errorMessage = <any>error
      );
  }
}