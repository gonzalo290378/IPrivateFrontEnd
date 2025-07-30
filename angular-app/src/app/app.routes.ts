import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/pages/layout-home-page/layout-home-page.component').then(
        (m) => m.LayoutHomePageComponent
      ),
  },
  {
    path: 'edit/:username',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import(
        './users/pages/layout-users-page/layout-users-page.component'
      ).then((m) => m.LayoutUsersPageComponent),
  },
  {
    path: ':username/:id',
    loadComponent: () =>
      import(
        './users/pages/layout-users-page/layout-users-page.component'
      ).then((m) => m.LayoutUsersPageComponent),
  },
  {
    path: ':username/suscriptions',
    loadComponent: () =>
      import('./users/pages/suscription-page/suscription-page.component').then(
        (m) => m.SuscriptionPageComponent
      ),
  },
  {
    path: ':username/messages',
    loadComponent: () =>
      import('./users/pages/message-page/message-page.component').then(
        (m) => m.MessagePageComponent
      ),
  },
  {
    path: 'authorized',
    loadComponent: () =>
      import('./auth/pages/authorized-page/authorized-page.component').then(
        (m) => m.AuthorizedComponent
      ),
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./auth/pages/logout-page/logout-page.component').then(
        (m) => m.LogoutPageComponent
      ),
  },
  {
    path: 'new-account',
    loadComponent: () =>
      import('./auth/pages/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
