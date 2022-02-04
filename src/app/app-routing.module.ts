import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { IndexComponent } from './frontend/index/index.component';
import { AboutUsComponent } from './frontend/about-us/about-us.component';
import { ContactUsComponent } from './frontend/contact-us/contact-us.component';
import { DrawingBoardComponent } from './shared/drawing-board/drawing-board.component';
import { FaqsComponent } from './frontend/faqs/faqs.component';
import { OurTeamComponent } from './frontend/our-team/our-team.component';
import { PrivacyPolicyComponent } from './frontend/privacy-policy/privacy-policy.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProceumLibraryComponent } from './shared/proceum-library/proceum-library.component';
import { ForgotPasswordComponent } from './frontend/forgot-password/forgot-password.component';
import { EmailVerifiedComponent } from './frontend/email-verified/email-verified.component';
import { UnsubscribeEmailComponent } from './frontend/unsubscribe-email/unsubscribe-email.component';
import { StaticPagesComponent } from './frontend/static-pages/static-pages.component';
import { ResetPasswordComponent } from './frontend/reset-password/reset-password.component'; 
import { ListPackagesComponent } from './frontend/pricing-packages/list-packages/list-packages.component';
import { PackageDetailsComponent } from './frontend/pricing-packages/package-details/package-details.component';
import { ShoppingCartComponent } from './frontend/shopping-cart/shopping-cart.component';
import { QuestionBankComponent } from './admin/question-management/question-bank/question-bank.component';
import { CreateExamComponent } from './admin/exam-modes/create-exam/create-exam.component';
import { CouponsComponent } from './frontend/coupons/coupons.component';
import { PartnerRegisterComponent } from './auth/partner-register/partner-register.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  {
    path: 'main',
    loadChildren: () =>
      import('./frontend/frontend.module').then((m) => m.FrontendModule),
  },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'faqs', component: FaqsComponent },
  { path: 'our-team', component: OurTeamComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'signup', component: PartnerRegisterComponent },
  { path: 'library', component: ProceumLibraryComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'email-verification/:hash', component: EmailVerifiedComponent },
  { path: 'unsubscription', component: UnsubscribeEmailComponent },
  { path: 'coupons', component: CouponsComponent },
  
  {
    path: 'mcicirriculam/:id',
    component: StaticPagesComponent,
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: 'white-board', component: DrawingBoardComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
    data: {
      role: '1,8,9,10,14',
    },
  },
  {
    path: 'reviewer',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
    data: {
      role: '3,4,5,6,7',
    },
  },
  {
    path: 'teacher',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule), canActivate: [AuthGuard], data: {
      role: '12',
    },
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./frontend/frontend.module').then((m) => m.FrontendModule),
    canActivate: [AuthGuard],
    data: {
      role: '2,1,3,4,5,6,7,11',
    },
  },
  {
    path: 'index',
    loadChildren: () =>
      import('./frontend/frontend.module').then((m) => m.FrontendModule),
  },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  
  { path: 'pricing-and-packages', component: ListPackagesComponent },
  { path: 'package-details/:id', component: PackageDetailsComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: IndexComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
