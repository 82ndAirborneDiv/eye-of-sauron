import { UserActions } from './user/user.actions';
import { UserService } from './user/user.service';
import { WeatherService } from './services/weather.service';

export const APP_PROVIDERS = [
  UserActions,
  UserService,
  WeatherService
];
