import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule, Routes } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
const routes: Routes = [
  {
    path: '',
    component : LoginComponent,
  },
];
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), MaterialModule, MatIconModule
  ],
  exports:[RouterModule]
})
export class AuthModule { }
