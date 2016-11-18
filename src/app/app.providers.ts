import { UserActions } from './user/user.actions';
import { UserService } from './user/user.service';
import { WeatherService } from './services/weather.service';
import { ServerMonitorService } from './services/server-monitor.service';
import { SiteMonitorService } from './services/sitemonitor.service';
import { JiraService } from './services/jira.service';

export const APP_PROVIDERS = [
    UserActions,
    UserService,
    WeatherService,
    ServerMonitorService,
    SiteMonitorService,
    JiraService
];
