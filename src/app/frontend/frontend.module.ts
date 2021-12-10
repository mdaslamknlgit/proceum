import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { DashboardComponent } from './student/dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
//import { MaterialModule } from '../material/material.module';
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

import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { TestsPageComponent } from './student/study-planner-student/tests-page/tests-page.component';
import { OrderListComponent } from './student/purchases/order-list/order-list.component';
import { OrderDetailsComponent } from './student/purchases/order-details/order-details.component';
import { QbankTestsPageComponent } from './student/levels/qbank-tests-page/qbank-tests-page.component';
//import { QbankComponent } from './student/levels/qbank/qbank.component';
import { StudyModeComponent } from './student/levels/exams/study-mode/study-mode.component';
import { ExamModeComponent } from './student/levels/exams/exam-mode/exam-mode.component';
import { LiveModeComponent } from './student/levels/exams/live-mode/live-mode.component';
import { ExamPrepmodeComponent } from './student/levels/exams/exam-prepmode/exam-prepmode.component';
import { TeacherMaterialComponent } from './student/learning-notes/teacher-material/teacher-material.component';
import { MaterialDescriptionComponent } from './student/learning-notes/material-description/material-description.component';
import { UploadDetailsComponent } from './social-share/upload-details/upload-details.component';
import { SharePageComponent } from './social-share/share-page/share-page.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from 'src/app/classes/date-format';
import { DatePipe } from '@angular/common';
import { MyEarningsComponent } from './my-earnings/my-earnings.component';
import { StudentAssessmentListComponent } from './student/assessment/student-assessment-list/student-assessment-list.component';
import { EventsListComponent } from './webinars/events-list/events-list.component';
import { AttendAssessmentComponent } from './student/assessment/attend-assessment/attend-assessment.component';

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
      { path: 'qbank/create-exam/:qbank_id', component: ExamPrepmodeComponent },
      { path: 'qbank/study-mode/:qbank_id/:source_id', component: StudyModeComponent },
      { path: 'qbank/exam-mode/:qbank_id/:exam_id', component: ExamModeComponent },
      { path: 'qbank/live-mode/:qbank_id/:exam_id', component: LiveModeComponent },
      { path: 'qbank/:curriculum_id/:level_id/:level_parent_id', component: QbankTestsPageComponent },
      { path: 'study-planner', component: StudyPlannerStudentComponent },
      //{ path: 'exam-mode', component: ExamModeComponent },
      
      { path: 'sharing', component: SharePageComponent },
      { path: 'upload-details', component: UploadDetailsComponent },
      { path: 'upload-details/:upload_id', component: UploadDetailsComponent },
      { path: 'teacher-material', component: TeacherMaterialComponent },
      { path: 'material-details/:material_id', component: MaterialDescriptionComponent },
      { path: 'study-planner/:plan_id', component: StudyPlannerStudentComponent },
      { path: 'study-planner/test/:day/:plan_id', component: TestsPageComponent },
      { path: 'purchased-orders', component: OrderListComponent },
      { path: 'events-list', component: EventsListComponent },
      { path: 'assessment-list', component: StudentAssessmentListComponent },
      { path: 'attend-assessment', component: AttendAssessmentComponent },
      { path: 'order-details/:order_id', component: OrderDetailsComponent},
      { path: 'my-earnings', component:  MyEarningsComponent},
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
    OrderListComponent,
    OrderDetailsComponent,
    UploadDetailsComponent,
    SharePageComponent,
    MyEarningsComponent,
    StudentAssessmentListComponent,
    EventsListComponent,
    AttendAssessmentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ConfirmationPopoverModule.forRoot({
        confirmButtonType: 'danger', // set defaults here
      }),
      SweetAlert2Module.forRoot(),
    //MaterialModule,
    LayoutsModule,
    CKEditorModule,
    ImageViewerModule.forRoot(),
    PdfViewerModule,
    SharedModule
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
  ],
  exports: [RouterModule, SharedModule],
})
export class FrontendModule {}
