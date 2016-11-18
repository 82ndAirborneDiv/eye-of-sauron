import { DashboardComponent } from './features/dashboard.component';
import { WeatherComponent } from './features/weather/weather.component';
import { ServerMonitorComponent } from './features/server-monitor/server-monitor.component';
import { SiteMonitorComponent } from './features/site-monitor/site-monitor.component';
import { NotFound404Component } from './not-found404.component';
import { JiraReservationComponent } from './features/jira/reservations/reservations.component';
import { OpenIssuesComponent } from './features/jira/open-issues/open-issues.component';


export const APP_DECLARATIONS = [
    DashboardComponent,
    WeatherComponent,
    ServerMonitorComponent,
    SiteMonitorComponent,
    NotFound404Component,
    JiraReservationComponent,
    OpenIssuesComponent
];
