import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { DashboardComponent } from './student/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { IndexComponent } from './index/index.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FaqsComponent } from './faqs/faqs.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { OurTeamComponent } from './our-team/our-team.component';
import { MyAccountComponent } from './student/my-account/my-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EmailVerifiedComponent } from './email-verified/email-verified.component';
import { UnsubscribeEmailComponent } from './unsubscribe-email/unsubscribe-email.component';
import { StaticPagesComponent } from './static-pages/static-pages.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { StudentComponent } from './student.component';
import { DetailsComponent } from './student/levels/details/details.component';
import { LevelComponent } from './student/levels/level.component';
import { Level_listComponent } from './student/levels/levels_list/level_list.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ImageViewerModule } from 'ngx-image-viewer';
import { ListPackagesComponent } from './pricing-packages/list-packages/list-packages.component';
import { PackageDetailsComponent } from './pricing-packages/package-details/package-details.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { StudyPlannerStudentComponent } from './student/study-planner-student/study-planner-student.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SafePipe } from '../shared/pipes/safe.pipe';
import { SharedModule } from '../shared/shared.module';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { TestsPageComponent } from './student/study-planner-student/tests-page/tests-page.component';
import { QbankTestsPageComponent } from './student/levels/qbank-tests-page/qbank-tests-page.component';
//import { QbankComponent } from './student/levels/qbank/qbank.component';
import { StudyModeComponent } from './student/exams/study-mode/study-mode.component';
import { ExamModeComponent } from './student/exams/exam-mode/exam-mode.component';
import { LiveModeComponent } from './student/exams/live-mode/live-mode.component';
import { ExamPrepmodeComponent } from './student/exams/exam-prepmode/exam-prepmode.component';
import { TeacherMaterialComponent } from './student/learning-notes/teacher-material/teacher-material.component';
import { MaterialDescriptionComponent } from './student/learning-notes/material-description/material-description.component';

// import { StlModelViewerModule } from 'angular-stl-model-viewer';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'my-account',
        component: MyAccountComponent,
      },
      { path: 'curriculums', component: LevelComponent },
      {
        path: 'curriculum/details/:curriculum_id/:level_id/:level_parent_id',
        component: DetailsComponent,
      },
      {
        path: 'curriculum/details/:curriculum_id/:level_id/:level_parent_id/:content_id',
        component: DetailsComponent,
      },
      {
        path: 'content-preview/:content_id',
        component: DetailsComponent,
      },
      { path: 'curriculums/:curriculum_id', component: Level_listComponent },
      {
        path: 'curriculums/:curriculum_id/:level_id',
        component: Level_listComponent,
      },
      {
        path: 'curriculums/:curriculum_id/:level_id/:level_parent_id',
        component: Level_listComponent,
      },
      {
        path: 'qbank/:curriculum_id/:level_id/:level_parent_id',
        component: QbankTestsPageComponent,
      },
      { path: 'study-planner', component: StudyPlannerStudentComponent },
      { path: 'study-mode', component: StudyModeComponent },
      { path: 'exam-mode', component: ExamModeComponent },
      { path: 'live-mode', component: LiveModeComponent },
      { path: 'teacher-material', component: TeacherMaterialComponent },
      { path: 'material-details/:material_id', component: MaterialDescriptionComponent },
      { path: 'study-planner/:plan_id', component: StudyPlannerStudentComponent },
      { path: 'exam-prepmode', component: ExamPrepmodeComponent },
      { path: 'study-planner/test/:day/:plan_id', component: TestsPageComponent },
    ],
  },
];
@NgModule({
  declarations: [
    StudentComponent,
    DashboardComponent,
    IndexComponent,
    ContactUsComponent,
    PrivacyPolicyComponent,
    FaqsComponent,
    AboutUsComponent,
    OurTeamComponent,
    MyAccountComponent,
    ForgotPasswordComponent,
    EmailVerifiedComponent,
    UnsubscribeEmailComponent,
    ResetPasswordComponent,
    StaticPagesComponent,
    DetailsComponent,
    LevelComponent,
    Level_listComponent,
    QbankTestsPageComponent,
    ListPackagesComponent,
    PackageDetailsComponent,
    StudyPlannerStudentComponent,
    ShoppingCartComponent,
    TestsPageComponent,
    //QbankComponent,
    StudyModeComponent,
    ExamModeComponent,
    LiveModeComponent,
    ExamPrepmodeComponent,
    TeacherMaterialComponent,
    MaterialDescriptionComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ConfirmationPopoverModule.forRoot({
        confirmButtonType: 'danger', // set defaults here
      }),
      SweetAlert2Module.forRoot(),
    MaterialModule,
    LayoutsModule,
    CKEditorModule,
    ImageViewerModule.forRoot(),
    PdfViewerModule,
    SharedModule
  ],
  exports: [RouterModule],
})
export class FrontendModule {}
