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
  public message: string = 'Email is Required';
  domain:string;
  constructor( private http: AuthService,private toastr: ToastrService,private socialAuthService: SocialAuthService ) { }

  ngOnInit(): void {
    this.domain = location.origin;
  }

  doForgotPassword(){
    if (this.register_email != "") {
      this.email_check = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.register_email);
      if (this.email_check == false) {
        this.message = "Invalid email";
      }else{
        let params = {
          url: 'forgot-password',
          email:this.register_email,
          domain:this.domain
        }
        this.http.register(params).subscribe((res: Response) => {
          if (res.error) {
            this.email_check = false;
            this.message = res.message;
            this.toastr.error(this.message, 'Error', { closeButton: true , timeOut: 5000});
          }else{
            this.email_check = true;
            this.toastr.success(res.message, 'Success', { closeButton: true, timeOut: 5000 });

          }
        });

      }
    }else{
      this.message = "Email is required";
    }

  }
}

export interface Response {
  error: boolean;
  message: string;
}
