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

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [ {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'my-account',
    component: MyAccountComponent,
  }
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
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    LayoutsModule,
  ],
  exports: [RouterModule],
})
export class FrontendModule {}
