import { Component, OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider, SocialUser,FacebookLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit(): void {
  }
  sociallogin(social_type:string): void {
    if(social_type == "GG"){
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }else if(social_type == "FB"){
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }else if(social_type == "AP"){

    }
    
  }
}
