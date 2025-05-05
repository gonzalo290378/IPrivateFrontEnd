import { Routes } from '@angular/router';
//import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/pages/layout-home-page/layout-home-page.component').then(
        (m) => m.LayoutHomePageComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./shared/pages/navbar-page/navbar-page.component').then(
            (m) => m.NavbarPageComponent
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import(
            './shared/pages/post-content-page/post-content-page.component'
          ).then((m) => m.PostContentPageComponent),
      },
      {
        path: '',
        loadComponent: () =>
          import(
            './home/pages/meeting-room-page/meeting-room-page.component'
          ).then((m) => m.MeetingRoomPageComponent),
      },
      {
        path: '',
        loadComponent: () =>
          import(
            './home/pages/public-feed-page/public-feed-page.component'
          ).then((m) => m.PublicFeedPageComponent),
      },
    ],
  },

  {
    path: ':username/:id',
    loadComponent: () =>
      import(
        './users/pages/layout-users-page/layout-users-page.component'
      ).then((m) => m.LayoutUsersPageComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./shared/pages/navbar-page/navbar-page.component').then(
            (m) => m.NavbarPageComponent
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import(
            './shared/pages/free-content-page/free-content-page.component'
          ).then((m) => m.FreeContentPageComponent),
      },
      {
        path: 'private-content-page/:username',
        loadComponent: () =>
          import(
            './users/pages/private-content-page/private-content-page.component'
          ).then((m) => m.PrivateContentPageComponent),
      },

      {
        path: 'suggestion-content-page',
        loadComponent: () =>
          import(
            './shared/pages/suggestion-page/suggestion-page.component'
          ).then((m) => m.SuggestionPageComponent),
      },
    ],
  },
  {
    path: 'edit/:username',
    loadComponent: () =>
      import(
        './users/pages/edit-profile-page/edit-profile-page.component'
      ).then((m) => m.EditProfilePageComponent),
    children: [
      {
        path: 'edit-public-content-page',
        loadComponent: () =>
          import(
            './users/pages/edit-public-content-page/edit-public-content-page.component'
          ).then((m) => m.EditPublicContentPageComponent),
      },
      {
        path: 'edit-private-content-page',
        loadComponent: () =>
          import(
            './users/pages/edit-private-content-page/edit-private-content-page.component'
          ).then((m) => m.EditPrivateContentPageComponent),
      },
    ],
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
    //canActivate: [authGuard],
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
