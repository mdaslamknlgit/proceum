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
import { CurriculumComponent } from './frontend/student/curriculum/curriculum.component';
import { SettingsComponent } from './admin/settings/settings.component';


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
  { path: 'privacy-policy', component: PrivacyPolicyComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'library', component:ProceumLibraryComponent},
  { path: 'forgot-password', component:ForgotPasswordComponent},
  { path: 'email-verification', component:EmailVerifiedComponent},
  { path: 'unsubscription', component:UnsubscribeEmailComponent},
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  { path: 'white-board', component: DrawingBoardComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
    data: {
      role: '1',
    },
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./frontend/frontend.module').then((m) => m.FrontendModule),
    canActivate: [AuthGuard],
    data: {
      role: '2',
    },
  },
  { path: 'student-curriculum', component: CurriculumComponent },
  {path : 'settings', component: SettingsComponent},
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
