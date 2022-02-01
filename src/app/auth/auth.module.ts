import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../material/material.module';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { FormsModule } from '@angular/forms';
import { PartnerRegisterComponent } from './partner-register/partner-register.component';




const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];
@NgModule({
  declarations: [LoginComponent, RegisterComponent, PartnerRegisterComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule, LayoutsModule,FormsModule],
  exports: [RouterModule],
})
export class AuthModule {}
