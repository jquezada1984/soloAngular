import { Routes, PreloadAllModules } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    loadChildren: () => import('./features/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/product/product.module').then(m => m.ProductModule)
  },
  {
    path: '**',
    redirectTo: '/users'
  }
];

export const appRouterConfig = {
  preloadingStrategy: PreloadAllModules
};
