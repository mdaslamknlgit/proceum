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
import { CurriculamComponent } from './curriculam/curriculam.component';
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
    path: 'settings/email-templates',
    component: EmailTemplatesComponent,
  },
  {
    path: 'curriculum',
    component: CurriculamComponent,
  },
];
@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    EmailTemplatesComponent,
    ManageTemplateComponent,
    CurriculamComponent,
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
