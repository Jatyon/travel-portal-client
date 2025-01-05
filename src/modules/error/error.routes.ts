import { AppRoutes } from '@shared/layout/types/app-routes.type';

export const errorRoutes: AppRoutes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '404',
  },
  {
    path: '401',
    loadComponent: (): Promise<any> => import('./components/error-401/error-401.component').then((c) => c.Error401Component),
    data: {
      title: 'Error 401 - SB Admin Angular',
    },
  },
  {
    path: '404',
    loadComponent: (): Promise<any> => import('./components/error-404/error-404.component').then((c) => c.Error404Component),
    data: {
      title: 'Error 404 - SB Admin Angular',
    },
  },
  {
    path: '500',
    loadComponent: (): Promise<any> => import('./components/error-500/error-500.component').then((c) => c.Error500Component),
    data: {
      title: 'Error 500 - SB Admin Angular',
    },
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
];
