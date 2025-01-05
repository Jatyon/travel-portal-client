import { AppRoutes } from '@shared/layout/types/app-routes.type';

export const authRoutes: AppRoutes = [
  {
    path: '',
    loadComponent: (): Promise<any> => import('./components/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];
