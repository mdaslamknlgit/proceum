import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalApp } from '../../../global';
import Swal from 'sweetalert2';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  socialUser: SocialUser;
  force_login = false;
    partner_id = 0;
  register: Register = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    provider: '',
    id: '',
    password: '',
    confirm_pwd: '',
    register_type: '',
  };
  login: Login = { email: '', password: '' };
  public email_error: string = 'Email is Required';
  public password_error: string = 'Password is Required';
  public email_check: boolean = true;
  public is_login: boolean = false;
  public isLoadedTopBar: boolean = false;
  public subDomain: boolean = false;
  public params = [];
  password_hide: boolean = true;
  constructor( private activatedRoute: ActivatedRoute, private http: AuthService,
    private route: Router,
    private toastr: ToastrService,
    private socialAuthService: SocialAuthService,
    public app: GlobalApp
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
        let data = atob(param.data);
        this.params = data.split("/");console.log(this.params, data);
        this.forceLogin();
    })
    this.socialAuthService.authState.subscribe((user) => {
      if (user && this.is_login == false) {
        this.is_login = true;
        this.socialUser = user;
        this.register.first_name = this.socialUser.firstName;
        this.register.last_name = this.socialUser.lastName;
        this.register.email = this.socialUser.email
          ? this.socialUser.email
          : '';
        this.register.password = 'Proceum@123';
        this.register.confirm_pwd = 'Proceum@123';
        this.register.register_type = 'SL';
        this.register.provider = this.socialUser.provider;
        this.register.id = this.socialUser.id;
        let params = {
          url: 'register',
          first_name: this.register.first_name,
          last_name: this.register.last_name,
          email: this.register.email,
          password: this.register.password,
          role: 2,
          register_type: this.register.register_type,
          provider: this.register.provider,
          id: this.register.id,
        };
        this.http.register(params).subscribe((res: Response) => {
          if (res.error) {
            this.socialAuthService.signOut(true);
            this.register = {
              first_name: '',
              last_name: '',
              email: '',
              phone: '',
              provider: '',
              id: '',
              password: '',
              confirm_pwd: '',
              register_type: '',
            };
            this.toastr.error(res.message, 'Error', {
              closeButton: true,
              timeOut: 5000,
            });
          } else {
            localStorage.setItem('_token', res['data'].token);
            let json_user = btoa(JSON.stringify(res['data'].user));
            localStorage.setItem('user', json_user);
            let role = res['data']['user']['role'];
            if (res['data']['user']['role'] == 1 || role == 8 || role == 9 || role == 10) {
              //admin
              let redirect_url = localStorage.getItem('_redirect_url')
                ? localStorage.getItem('_redirect_url')
                : '/admin/dashboard';
              localStorage.removeItem('_redirect_url');
              this.route.navigate([redirect_url]);
            } else if (res['data']['user']['role'] == 3 || res['data']['user']['role'] == 4 || res['data']['user']['role'] == 5 || res['data']['user']['role'] == 6 || res['data']['user']['role'] == 7) {
              //Reviewer L1, L2,L3 Approver
              let redirect_url = localStorage.getItem('_redirect_url')
                ? localStorage.getItem('_redirect_url')
                : '/reviewer/dashboard';
              localStorage.removeItem('_redirect_url');
              this.route.navigate([redirect_url]);
            } else if (role == 8 || role == 9 || role == 10) {
              let redirect_url = localStorage.getItem('_redirect_url')
                ? localStorage.getItem('_redirect_url')
                : '/admin/dashboard';
              localStorage.removeItem('_redirect_url');
              this.route.navigate([redirect_url]);
            } else {
              //student or others
              let redirect_url = localStorage.getItem('_redirect_url')
                ? localStorage.getItem('_redirect_url')
                : '/student/dashboard';
              localStorage.removeItem('_redirect_url');
              this.route.navigate([redirect_url]);
            }
          }
        });
      }
    });
  }

    passwordFun() {
        this.password_hide = !this.password_hide;
    }
    forceLogin(){
        let params = {url: 'force-login', partner_id: this.params[0], role: this.params[1]};
        this.http.login(params).subscribe((res: Response) => {
            if (res.error == false) {
                this.login.email = res['data']['email'],
                this.login.password = res['data']['password'];
                this.force_login = true;
                console.log(this.params)
                this.doLogin();
            }}
        );
    }
    doLogin() {
        if (this.login.email != '') {
            this.email_check = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.login.email);
        if (this.email_check == false) {
            this.email_error = 'Invalid email';
        } else {
            if (this.login.password != '') {
            let params = {
                url: 'login',
                email: this.login.email,
                password: this.login.password,
                force_login: this.force_login
            };
            this.http.login(params).subscribe((res: Response) => {
                if (res.error) {
                if (res['insti_reg_user']) {
                    let sweetAlertHtml = 'Dear '+ res['user_role_type'] +', Thanks for registering with us.<br/> \
                    Your account is not enabled yet as we are still reviewing your information.<br/> \
                    We will get back to you soon.<br/>Once your account is approved, you will be notified via email.';
                    Swal.fire({
                    icon: 'warning',
                    //title: 'Dear Partner,',
                    html: sweetAlertHtml
                    })
                    return false;
                }
                this.toastr.error(res.message, 'Error', {
                    closeButton: true,
                    timeOut: 5000,
                });
                } else {
                localStorage.setItem('_token', res['data'].token);
                let json_user = btoa(JSON.stringify(res['data'].user));
                localStorage.setItem('user', json_user);
                //If login user has subdomain the send him to land on subdomain
                if (res['data']['user']['sub_domain']) {
                    this.landOnSubdomain(res['data']['user']);
                }
                if (res['data']['user']['role'] == 1) {
                    //admin
                    let redirect_url = localStorage.getItem('_redirect_url') ? localStorage.getItem('_redirect_url') : '/admin/dashboard';
                    localStorage.removeItem('_redirect_url');
                    this.route.navigate([redirect_url]);
                } else if (res['data']['user']['role'] == 3 || res['data']['user']['role'] == 4 || res['data']['user']['role'] == 5 || res['data']['user']['role'] == 6 || res['data']['user']['role'] == 7) {
                    //Reviewer L1, L2,L3 Approver
                    let redirect_url = localStorage.getItem('_redirect_url') ? localStorage.getItem('_redirect_url') : '/reviewer/dashboard';
                    localStorage.removeItem('_redirect_url');
                    this.route.navigate([redirect_url]);
                } else if (Object.values(environment.PARTNER_ADMIN_SPECIFIC_ROLES).includes(Number(res['data']['user']['role']))) {
                    let redirect_url = localStorage.getItem('_redirect_url') ? localStorage.getItem('_redirect_url') : '/admin/dashboard';
                    this.route.navigate([redirect_url]);
                } else if (res['data']['user']['role'] == 12) {
                    let redirect_url = localStorage.getItem('_redirect_url') ? localStorage.getItem('_redirect_url') : '/teacher/dashboard';
                    localStorage.removeItem('_redirect_url');
                    this.route.navigate([redirect_url]);
                }
                else {
                    //student or others
                    let redirect_url = localStorage.getItem('_redirect_url') ? localStorage.getItem('_redirect_url') : '/student/dashboard';
                    localStorage.removeItem('_redirect_url');
                    this.route.navigate([redirect_url]);
                }
                }
            });
            }
        }
        }
    }

  landOnSubdomain(userData) {
    let replacer = userData['sub_domain'];
    let role = Number(userData['role']);
    let dashboard = "/student/dashboard";
    if (Object.values(environment.ALL_ADMIN_SPECIFIC_ROLES).includes(role)) {
      dashboard = "/admin/dashboard";
    }
    if (role == environment.ALL_ROLES.TEACHER) {
      dashboard = "/teacher/dashboard";
    }
    let replaceValue = window.location.host.split('.')[0];
    let url = window.location.origin.replace(replaceValue,replacer);
    if(replaceValue != 'localhost:4200'){
      url = url.replace('https',environment.SSL_ORIGIN);
      window.location.href = url + dashboard;
    }
    return false;
    /* let newdomain;
    newdomain = window.location.origin.replace('uat', subdomain);
    if (newdomain.indexOf(subdomain) > -1) {
      window.location.href = newdomain + dashboard; return;
    }
    newdomain = window.location.origin.replace('dev', subdomain);
    if (newdomain.indexOf(subdomain) > -1) {
      window.location.href = newdomain + dashboard; return;
    }
    newdomain = window.location.origin.replace('master', subdomain);
    if (newdomain.indexOf(subdomain) > -1) {
      window.location.href = newdomain + dashboard; return;
    } */
  }

  sociallogin(social_type: string): void {
    if (social_type == 'GG') {
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    } else if (social_type == 'FB') {
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    } else if (social_type == 'AP') {
    }
  }

  logout() {
    let params = { url: 'logout' };
    this.http.login(params).subscribe((res: Response) => {
      localStorage.removeItem('_token');
      localStorage.removeItem('user');
      this.route.navigate(['/login']);
    });
  }
}

export interface Register {
  first_name: string;
  last_name: string;
  email: string;
  phone: any;
  provider: any;
  id: any;
  password: any;
  confirm_pwd: any;
  register_type: any;
}

export interface Login {
  email: string;
  password: any;
}
export interface Response {
  error: boolean;
  token: any;
  message: string;
  role?: any;
  errors?: any;
}
