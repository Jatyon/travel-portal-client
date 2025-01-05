import { Route } from '@angular/router';

export interface AppRouteData extends Record<string, any> {
  title?: string;
}

export declare interface AppRoute extends Route {
  data?: AppRouteData;
}
