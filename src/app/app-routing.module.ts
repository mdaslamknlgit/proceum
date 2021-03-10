import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  {
    path: 'main',
    loadChildren: () =>
      import('./frontend/frontend.module').then((m) => m.FrontendModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin/dashboard',
    loadChildren: () =>
      import('./admin/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
    data: {
      role: '1',
    },
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./frontend/frontend.module').then((m) => m.FrontendModule),
    canActivate: [AuthGuard],
    data: {
      role: '2',
    },
  },
  { path: '**', redirectTo: 'login' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
