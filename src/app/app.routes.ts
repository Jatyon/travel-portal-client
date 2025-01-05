import { UserResolver } from '@core/resolvers/user.resolver';
import { AppRoutes } from '@shared/layout/types/app-routes.type';

export const routes: AppRoutes = [
  {
    resolve: { user: UserResolver },
    path: '',
    loadChildren: (): Promise<any> => import('@layouts/main-layout/main-layout.routes').then((c) => c.mainLayoutRoutes),
  },
  {
    path: 'auth',
    loadChildren: (): Promise<any> => import('@layouts/auth-layout/auth-layout.routes').then((c) => c.authLayoutRoutes),
  },
  {
    path: 'error',
    loadChildren: (): Promise<any> => import('@layouts/error-layout/error-layout.routes').then((c) => c.errorLayoutRoutes),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'error',
  },
];
