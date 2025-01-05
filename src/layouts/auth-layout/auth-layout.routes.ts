import { AppRoutes } from '@shared/layout/types/app-routes.type';
import { AuthLayoutComponent } from './auth-layout.component';

export const authLayoutRoutes: AppRoutes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        loadComponent: (): Promise<any> => import('@modules/auth/components/login/login.component').then((c) => c.LoginComponent),
      },
    ],
  },
];
