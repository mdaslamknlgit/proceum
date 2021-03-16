import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { IndexComponent } from './frontend/index/index.component';
const routes: Routes = [
  { path: '', component: IndexComponent },
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
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
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
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
