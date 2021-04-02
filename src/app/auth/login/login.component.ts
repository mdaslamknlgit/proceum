import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
} from 'angularx-social-login';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  socialUser: SocialUser;
  register: Register = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_pwd: '',
    register_type: '',
  };
  login: Login = { email: '', password: '' };
  public message: string = 'Invalid email or password';
  password_hide: boolean = true;
  constructor(
    private http: AuthService,
    private route: Router,
    private toastr: ToastrService,
    private socialAuthService: SocialAuthService
  ) {}
  ngOnInit(): void {
    this.http.removeSession();
  }

  passwordFun() {
    this.password_hide = !this.password_hide;
  }

  doLogin() {
    let params = {
      url: 'login',
      email: this.login.email,
      password: this.login.password,
    };
    this.http.login(params).subscribe((res: Response) => {
      if (res.error) {
        this.toastr.error(res.message, 'Error', { closeButton: true , timeOut: 5000});

      } else {
        sessionStorage.setItem('_token', res['data'].token);
        let json_user = btoa(JSON.stringify(res['data'].user));
        sessionStorage.setItem('user', json_user);
        if (res['data']['user']['role'] == 1) {
          //admin
          let redirect_url = sessionStorage.getItem('_redirect_url')
            ? sessionStorage.getItem('_redirect_url')
            : '/admin/dashboard';
          sessionStorage.removeItem('_redirect_url');
          this.route.navigate([redirect_url]);
        } else if (res['data']['user']['role'] == 2) {
          //student
          let redirect_url = sessionStorage.getItem('_redirect_url')
            ? sessionStorage.getItem('_redirect_url')
            : '/student/dashboard';
          sessionStorage.removeItem('_redirect_url');
          this.route.navigate([redirect_url]);
        }
      }
    });
  }

  socialiteLogin() {
    this.socialAuthService.authState.subscribe((user) => {
      if (user) {
        this.socialUser = user;
        this.register.first_name = this.socialUser.firstName;
        this.register.last_name = this.socialUser.lastName;
        this.register.email = this.socialUser.email;
        this.register.password = 'Proceum@123';
        this.register.confirm_pwd = 'Proceum@123';
        this.register.register_type = 'SL';
        let params = {
          url: 'register',
          first_name: this.register.first_name,
          last_name: this.register.last_name,
          email: this.register.email,
          password: this.register.password,
          role: 2,
          register_type: this.register.register_type,
        };
        this.http.register(params).subscribe((res: Response) => {
          if (res.error) {
            this.toastr.error(res.message, 'Error', { closeButton: true , timeOut: 5000});
          } else {
            sessionStorage.setItem('_token', res['data'].token);
            let json_user = btoa(JSON.stringify(res['data'].user));
            sessionStorage.setItem('user', json_user);
            if (res['data']['user']['role'] == 1) {
              //admin
              this.route.navigate(['/admin/dashboard']);
            } else if (res['data']['user']['role'] == 2) {
              //student
              this.route.navigate(['/student/dashboard']);
            }
          }
        });
      }
    });
  }

  sociallogin(social_type: string): void {
    if (social_type == 'GG') {
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
      this.socialiteLogin();
    } else if (social_type == 'FB') {
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
      this.socialiteLogin();
    } else if (social_type == 'AP') {
    }
  }

  logout() {
    let params = { url: 'logout' };
    this.http.login(params).subscribe((res: Response) => {
      sessionStorage.removeItem('_token');
      this.route.navigate(['/login']);
    });
  }
}

export interface Register {
  first_name: string;
  last_name: string;
  email: string;
  password: any;
  confirm_pwd: any;
  register_type: any;
}

export interface Login {
  email: String;
  password: any;
}
export interface Response {
  error: boolean;
  token: any;
  message: string;
  role?: any;
  errors?: any;
}
