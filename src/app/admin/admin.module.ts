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
import { RolesListComponent } from './roles-list/roles-list.component';
import { AccessMatrixComponent } from './access-matrix/access-matrix.component';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NewsletterListComponent } from './newsletter-list/newsletter-list.component';
import { ModalPopupComponent } from './newsletter-list/model-popup/model-popup.component';
import { SettingsComponent } from './settings/settings.component';
import { CustomPagesComponent } from './custom-pages/custom-pages.component';
import { CountriesStatesCitiesComponent } from './countries-states-cities/countries-states-cities.component';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';

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
    path: 'students',
    component: StudentsComponent,
  },
  {
    path: 'login-history',
    component: LoginHistoryComponent,
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
  {
    path: 'curriculum/:curriculum_id/:step/:level_parent_id',
    component: StepsComponent,
  },
  {
    path: 'roles-list',
    component: RolesListComponent,
  },
  {
    path: 'access-matrix',
    component: AccessMatrixComponent,
  },
  {
    path: 'countries-states-cities',
    component: CountriesStatesCitiesComponent,
  },
  { path: 'newsletter-list', component: NewsletterListComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'custom-page', component: CustomPagesComponent },
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
    RolesListComponent,
    AccessMatrixComponent,
    LoginHistoryComponent,
    NewsletterListComponent,
    ModalPopupComponent,
    SettingsComponent,
    CustomPagesComponent,
    CountriesStatesCitiesComponent,
  ],
  imports: [
    MaterialModule,
    LayoutsModule,
    NgxMatColorPickerModule,
    RouterModule.forChild(routes),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    CommonModule,
    CKEditorModule,
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
   ],
  exports: [RouterModule],
})
export class AdminModule {}
