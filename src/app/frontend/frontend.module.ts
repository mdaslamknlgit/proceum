import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CurriculumComponent } from './student/curriculum/curriculum.component';
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
import { SafePipe } from '../shared/pipes/safe.pipe';
import { SharedModule } from '../shared/shared.module';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
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
      { path: 'study-planner', component: StudyPlannerStudentComponent },
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
    CurriculumComponent,
    ResetPasswordComponent,
    StaticPagesComponent,
    DetailsComponent,
    LevelComponent,
    Level_listComponent,
    ListPackagesComponent,
    PackageDetailsComponent,
    StudyPlannerStudentComponent,
    ShoppingCartComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
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
