import { Component } from '@angular/core';
import { Report, SiteMonitorService } from '../../services/sitemonitor.service';


@Component({
  selector: 'site-monitor',
  templateUrl: './site-monitor.component.html',
  styleUrls: ['./site-monitor.component.css']
})

export class SiteMonitorComponent {
  errorMessage: string;
  reports: Report[];
  refreshedTimestamp: number;

  constructor(private _reportService: SiteMonitorService) { }

  ngOnInit() {
    this.getReports();
    this.refreshedTimestamp = +new Date();
  }

  ngAfterContentInit() {
    this.autoRefresh();
  }

  getReports() {
    this._reportService.getReports()
      .subscribe(
      reports => this.reports = reports,
      error => this.errorMessage = <any>error
      );
  }

  autoRefresh() {
    setInterval(() => {
      this.getReports();
      this.refreshedTimestamp = +new Date()
    }, 300000);
  }

}
