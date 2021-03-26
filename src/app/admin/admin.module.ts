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
import { StudentsComponent } from './students/students.component';
import { CurriculamComponent } from './curriculam/curriculam.component';
import { DiscountSettingsComponent } from './discount-settings/discount-settings.component';
import { PromotionalSettingsComponent } from './promotional-settings/promotional-settings.component';
import { StepsComponent } from './curriculam/steps/steps.component';
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'students',
    component: StudentsComponent,
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
  {
    path: 'discount-settings',
    component: DiscountSettingsComponent,
  },
  {
    path: 'promotional-settings',
    component: PromotionalSettingsComponent,
  },
  {
    path: 'curriculum/:curriculum_id',
    component: StepsComponent,
  },
  {
    path: 'curriculum/:curriculum_id/:step',
    component: StepsComponent,
  },
];
@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    EmailTemplatesComponent,
    ManageTemplateComponent,
    StudentsComponent,
    CurriculamComponent,
    DiscountSettingsComponent,
    PromotionalSettingsComponent,
    StepsComponent,
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
