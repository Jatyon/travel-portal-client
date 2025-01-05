import { AppRoutes } from '@shared/layout/types/app-routes.type';
import { ErrorLayoutComponent } from './error-layout.component';

export const errorLayoutRoutes: AppRoutes = [
  {
    path: '',
    component: ErrorLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '',
      },
      {
        path: '',
        loadChildren: (): Promise<any> => import('@modules/error/error.routes').then((c) => c.errorRoutes),
      },
    ],
  },
];
