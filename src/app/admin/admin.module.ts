import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
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
import { AccessMatrixComponent } from './roles-list/access-matrix/access-matrix.component';
import { LoginHistoryComponent } from './login-history/login-history.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NewsletterListComponent } from './newsletter-list/newsletter-list.component';
import { SettingsComponent } from './settings/settings.component';
import { CreateCustomPagesComponent } from './custom-pages/create-custom-pages/create-custom-pages.component';
import { EditCustomPagesComponent } from './custom-pages/edit-custom-pages/edit-custom-pages.component';
import { CountriesStatesCitiesComponent } from './countries-states-cities/countries-states-cities.component';
import {
  MAT_COLOR_FORMATS,
  NgxMatColorPickerModule,
  NGX_MAT_COLOR_FORMATS,
} from '@angular-material-components/color-picker';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from 'src/app/classes/date-format';
import { StatesComponent } from './states/states.component';
import { CitiesComponent } from './cities/cities.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomPageListComponent } from './custom-pages/custom-page-list/custom-page-list.component';
import { DatePipe } from '@angular/common';
import { AdminComponent } from './admin.component';
import { CustomRouteReuseStategy } from '../classes/reuse-strategy';
import { CreateContentComponent } from './content-management/create-content/create-content.component';
import { AssetsLibraryComponent } from './assets-library/assets-library.component';
import { ContentManagementComponent } from './content-management/content-management.component';
import { MapingComponent } from './content-management/maping/maping.component';
import { WhiteboardgalleryComponent } from './whiteboardgallery/whiteboardgallery.component';
import { CreatePartnerComponent } from './create-partner/create-partner.component';
import { CreateNewQuestionComponent } from './question-management/create-new-question/create-new-question.component';
import { QuestionsManagementComponent } from './question-management/questions-management/questions-management.component';
import { ReviewDashboardComponent } from './module_review/review-dashboard/review-dashboard.component';
import { QuestionBankComponent } from './question-management/question-bank/question-bank.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'individuals',
        component: StudentsComponent,
      },
      {
        path: 'login-history',
        component: LoginHistoryComponent,
      },
      {
        path: 'assets-library/:files',
        component: AssetsLibraryComponent,
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
        data: { shouldReuse: false },
      },
      {
        path: 'curriculum/:curriculum_id/:step',
        component: StepsComponent,
        data: { shouldReuse: false },
      },
      {
        path: 'curriculum/:curriculum_id/:step/:level_parent_id',
        component: StepsComponent,
        data: { shouldReuse: false },
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
        path: 'countries',
        component: CountriesStatesCitiesComponent,
      },
      {
        path: 'countries/:country_id',
        component: StatesComponent,
      },
      {
        path: 'countries/:country_id/:state_id',
        component: CitiesComponent,
      },
      { path: 'newsletter-list', component: NewsletterListComponent },
      { path: 'settings', component: SettingsComponent },

      { path: 'custom-page', component: CustomPageListComponent },
      { path: 'create-custom-page', component: CreateCustomPagesComponent },
      { path: 'edit-custom-page/:id', component: EditCustomPagesComponent },
      { path: 'manage-content', component: ContentManagementComponent },
      { path: 'link-content', component: MapingComponent },
      { path: 'create-content', component: CreateContentComponent },
      { path: 'whiteboardgallery', component: WhiteboardgalleryComponent },
      { path: 'createnewquestion', component: CreateNewQuestionComponent },
      { path: 'questionmanagement', component: QuestionsManagementComponent },
      { path: 'questionbank', component: QuestionBankComponent },
      { path: 'create-partner', component: CreatePartnerComponent },
      { path: 'create-content/:id', component: CreateContentComponent },
    ],
  },
];
@NgModule({
  declarations: [
    AdminComponent,
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
    SettingsComponent,
    CreateCustomPagesComponent,
    CountriesStatesCitiesComponent,
    StatesComponent,
    CitiesComponent,
    CustomPageListComponent,
    EditCustomPagesComponent,
    CreateContentComponent,
    AssetsLibraryComponent,
    ContentManagementComponent,
    MapingComponent,
    WhiteboardgalleryComponent,
    CreatePartnerComponent,
    CreateNewQuestionComponent,
    QuestionsManagementComponent,
    ReviewDashboardComponent,
    QuestionBankComponent,
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
    HttpClientModule,
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStategy },
    DatePipe,
  ],
  exports: [RouterModule],
})
export class AdminModule {}
