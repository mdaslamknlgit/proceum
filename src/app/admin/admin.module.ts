import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';


import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { environment } from '../../environments/environment';

//custom modules
import { LayoutsModule } from '../layouts/layouts.module';
import { MaterialModule } from '../material/material.module';

import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';
import { ManageTemplateComponent } from './email-templates/manage-template/manage-template.component';
import { StudentsComponent } from './students/students.component';
import { CurriculamComponent } from './curriculam/curriculam.component';
import { DiscountSettingsComponent } from './discount-settings/discount-settings.component';
import { PromotionalSettingsComponent } from './promotional-settings/promotional-settings.component';
import { StepsComponent } from './curriculam/steps/steps.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { AccessMatrixComponent } from './roles-list/access-matrix/access-matrix.component';
import { LoginHistoryComponent } from './user-management/login-history/login-history.component';

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
import { OrderByPipe } from '../shared/pipes/order-by.pipe';

//components
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
import { CreatePartnerComponent } from './partner-management/create-partner/create-partner.component';
import { CreateNewQuestionComponent } from './question-management/create-new-question/create-new-question.component';
import { QuestionsManagementComponent } from './question-management/questions-management/questions-management.component';
import { ReviewDashboardComponent } from './module_review/review-dashboard/review-dashboard.component';
import { QuestionBankComponent } from './question-management/question-bank/question-bank.component';
import { CreatePackageComponent } from './course-package/create-package/create-package.component';
import { EditPackageComponent } from './course-package/edit-package/edit-package.component';
import { ListPackageComponent } from './course-package/list-package/list-package.component';
import { EditNewQuestionComponent } from './question-management/edit-new-question/edit-new-question.component';
import { PartnersListComponent } from './partner-management/partners-list/partners-list.component';
import { ManageUsersComponent } from './user-management/manage-users/manage-users.component';
import { CreateUserComponent } from './user-management/create-user/create-user.component';
import { PackageTestimonialsComponent } from './course-package/package-testimonials/package-testimonials.component';
import { StudyPlannerComponent } from './study-planner/study-planner.component';
import { LabValuesComponent } from './question-management/lab-values/lab-values.component';
import { PocVideosComponent } from './poc-videos/poc-videos.component';
import { NotFoundComponent } from '../shared/not-found/not-found.component';
import { StudyPlannerListComponent } from './study-planner/study-planner-list/study-planner-list.component';
import { TeacherMaterialsComponent } from './teacher-materials/teacher-materials.component';
import { ManageYearsSemestersGroupsComponent } from './manage-years-semesters-groups/manage-years-semesters-groups.component';
import { ShoppingCartComponent } from '../frontend/shopping-cart/shopping-cart.component';
import { CreateExamComponent } from './exam-modes/create-exam/create-exam.component';
import { SocialApprovalComponent } from './social-share/social-approval/social-approval.component';
import { ManageFlashCardsComponent } from './flash-cards/manage-flash-cards/manage-flash-cards.component';
import { CreateNewFlashCardsComponent } from './flash-cards/create-new-flash-cards/create-new-flash-cards.component';
import { CreateMeetingComponent } from './zoom/create-meeting/create-meeting.component';
import { ListMeetingComponent } from './zoom/list-meeting/list-meeting.component';
import { SharedModule } from '../shared/shared.module';
import { CreateAssessmentComponent } from './assessment/create-assessment/create-assessment.component';
import { AssessmentListComponent } from './assessment/assessment-list/assessment-list.component';
import { ListCollegesComponent } from './college-management/list-colleges/list-colleges.component';
import { CreateCollegeComponent } from './college-management/create-college/create-college.component';
//import { SafePipe } from '../shared/pipes/safe.pipe';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: NotFoundComponent },
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

      { path: 'whiteboard-gallery', component: WhiteboardgalleryComponent },
      { path: 'social-approval', component: SocialApprovalComponent },

      //{ path: 'createnewquestion', component: CreateNewQuestionComponent },
      //{ path: 'questionmanagement', component: QuestionsManagementComponent },
      //{ path: 'questionbank', component: QuestionBankComponent },

      { path: 'create-partner', component: CreatePartnerComponent },
      { path: 'create-partner/:id', component: CreatePartnerComponent },
      { path: 'partners-list', component: PartnersListComponent },
      { path: 'create-content/:id', component: CreateContentComponent },
      { path: 'prices-package-management', component: ListPackageComponent },
      { path: 'create-package', component: CreatePackageComponent },
      { path: 'edit-package/:id', component: EditPackageComponent },

      { path: 'questions-mgt/qbank', component: QuestionBankComponent },
      { path: 'questions-mgt/questions-list', component: QuestionsManagementComponent },
      { path: 'questions-mgt/create-question', component: CreateNewQuestionComponent },
      { path: 'questions-mgt/edit-question/:id', component: EditNewQuestionComponent },

      { path: 'manage-users', component: ManageUsersComponent },
      { path: 'create-user', component: CreateUserComponent },
      { path: 'edit-user/:id', component: CreateUserComponent },

      { path: 'manage-packages-testimonial', component: PackageTestimonialsComponent },

      //Years routes
      { path: 'manage-year-semester-group', component:  ManageYearsSemestersGroupsComponent},
      //study-planner
      { path: 'study-planner', component: StudyPlannerListComponent },
      { path: 'study-planner/create', component: StudyPlannerComponent },
      { path: 'study-planner/edit/:id', component: StudyPlannerComponent },
      { path: 'questions-mgt/lab-values', component: LabValuesComponent },
      { path: 'study-planner-list', component: StudyPlannerListComponent },
      //Added by Phanindra 06-09-2021
      { path: 'poc-videos', component: PocVideosComponent },

      //Teacher materials routes, Added by Sandeep kumar
      { path: 'materials', component: TeacherMaterialsComponent },
      { path: 'teacher-material', component: TeacherMaterialsComponent },
      

      { path: 'create-exam', component: CreateExamComponent},
      //Added by Phanindra 28-20-2021
      { path: 'manage-flash-cards', component: ManageFlashCardsComponent},
      { path: 'create-flash-cards', component: CreateNewFlashCardsComponent},
      { path: 'class/create', component: CreateMeetingComponent},
      { path: 'list-meeting', component: ListMeetingComponent },
      { path: 'create-assessment', component: CreateAssessmentComponent },
      { path: 'assessment-list', component: AssessmentListComponent },
      //College routes
      { path: 'create-college', component: CreateCollegeComponent },
      { path: 'edit-college/:id', component: CreateCollegeComponent },
      { path: 'college-list', component: ListCollegesComponent },
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
    CreatePackageComponent,
    EditPackageComponent,
    ListPackageComponent,
    CreateNewQuestionComponent,
    QuestionsManagementComponent,
    QuestionBankComponent,
    EditNewQuestionComponent,
    PartnersListComponent,
    OrderByPipe,
    //SafePipe,
    ManageUsersComponent,
    CreateUserComponent,
    PackageTestimonialsComponent,
    StudyPlannerComponent,
    LabValuesComponent,
    PocVideosComponent,
    StudyPlannerListComponent,
    ManageYearsSemestersGroupsComponent,
    CreateExamComponent,
    SocialApprovalComponent,
    ManageFlashCardsComponent,
    CreateNewFlashCardsComponent,
    TeacherMaterialsComponent,
    CreateMeetingComponent,
    ListMeetingComponent,
    CreateAssessmentComponent,
    AssessmentListComponent,
    ListCollegesComponent,
    CreateCollegeComponent
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
    AngularEditorModule,
    CKEditorModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    SharedModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStategy },
    DatePipe,
  ],
  exports: [RouterModule, SharedModule],
})
export class AdminModule {}
