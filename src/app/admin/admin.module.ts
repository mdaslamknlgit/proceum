import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsModule } from '../layouts/layouts.module';
import { UsersComponent } from './users/users.component';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ManageTemplateComponent } from './email-templates/manage-template/manage-template.component';
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'email-templates',
    component: EmailTemplatesComponent,
  },
];
@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    EmailTemplatesComponent,
    ManageTemplateComponent,
  ],
  imports: [
    MaterialModule,
    LayoutsModule,
    RouterModule.forChild(routes),
    CommonModule,
    CKEditorModule,
  ],
  exports: [RouterModule],
})
export class AdminModule {}
