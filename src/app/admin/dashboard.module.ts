import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import {LayoutsModule } from '../layouts/layouts.module';
const routes: Routes = [
  {
    path: '',
    component : DashboardComponent,
  },
];
@NgModule({
  declarations: [DashboardComponent],
  imports: [MaterialModule, LayoutsModule, RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule]
})
export class DashboardModule { }
