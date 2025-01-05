import { AppRoutes } from '@shared/layout/types/app-routes.type';
import { MainLayoutComponent } from './main-layout.component';

export const mainLayoutRoutes: AppRoutes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '',
      },
      {
        path: '',
        data: {
          title: '',
        },
        loadComponent: (): Promise<any> => import('@modules/dashboard/dashboard.component').then((c) => c.DashboardComponent),
      },
    ],
  },
];
