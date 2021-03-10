import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { IndexComponent } from './index/index.component';
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '',
    component: IndexComponent,
  },
];
@NgModule({
  declarations: [DashboardComponent, IndexComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule],
  exports: [RouterModule],
})
export class FrontendModule {}
