import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SocialAuthService, GoogleLoginProvider, SocialUser,FacebookLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public register_email:string = '';
  public email_check: boolean = false;
  public message: string = '';
  constructor( private http: AuthService,private toastr: ToastrService,private socialAuthService: SocialAuthService ) { }

  ngOnInit(): void {
  }

  doForgotPassword(){
    if (this.register_email != "") {
      this.email_check = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.register_email);
      if (this.email_check == false) {
        this.message = "Invalid email";
        return;
      }else{
        let params = {
          url: 'forgot-password',
          email:this.register_email}
        this.http.register(params).subscribe((res: Response) => {
          if (res.error) {
            this.message = res.message;
          }else{
            this.toastr.success(res.message, 'Success', { closeButton: true });
          }
        });

      }
    }else{
      this.message = "Email is required";
    }

  }
  // sociallogin(social_type:string): void {
  //   if(social_type == "GG"){
  //     this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  //   }else if(social_type == "FB"){
  //     this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  //   }else if(social_type == "AP"){

  //   }
    
  // }
}

export interface Response {
  error: boolean;
  message: string;
}
