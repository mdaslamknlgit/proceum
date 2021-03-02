import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
const routes: Routes = [
  	{ path: '', pathMatch: 'full', redirectTo: 'login' },
  	{
		path: 'login',
		loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  	},
  	{
		path: 'dashboard',
		loadChildren: () => import('./admin/dashboard/dashboard.module').then(m => m.DashboardModule)
  	},
  	{ path: '**', redirectTo: 'login' }
];
@NgModule({
  	imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  	exports: [RouterModule]
})
export class AppRoutingModule { }
