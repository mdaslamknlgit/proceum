import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SocialAuthService, GoogleLoginProvider, SocialUser,FacebookLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  socialUser: SocialUser;
  register: Register = { first_name:'', last_name:'', email: '', password: '', confirm_pwd: '',register_type:'' };
  public message: string = 'Required data is missing';
  public email_check: boolean = false;
  public password_check: boolean = false;
  public confirm_check: boolean = false;
  domain:string;
  constructor( private http: AuthService,private route: Router,private toastr: ToastrService,private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
    this.domain = location.origin;
    this.socialAuthService.authState.subscribe((user) => {
      if(user){
        this.socialUser = user;
        this.register.first_name = this.socialUser.firstName;
        this.register.last_name =  this.socialUser.lastName;
        this.register.email =  this.socialUser.email;
        this.register.password = 'Proceum@123' ;
        this.register.confirm_pwd = 'Proceum@123';
        this.register.register_type = 'SL';
        this.doRegistration();
      }
    });

  }

  doRegistration() {
    this.message = "";
    if(this.register.first_name == '' || this.register.last_name == '' || this.register.email == '' || this.register.password == '' || this.register.confirm_pwd == ''){
      this.message = "Required data is missing";
      return;
    }else{

      if (this.register.email != "") {
        this.email_check = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.register.email);
        if (this.email_check == false) {
          this.message = "Invalid email";
          return;
        }
      }
      if(this.register.password != ""){
        const regex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#^()><?/:;,.])[A-Za-z\d$@$!%*?&#^()><?/:;,.].{7,15}');
        this.password_check = regex.test(this.register.password);
        if(this.password_check == true){
          if(this.register.password === this.register.confirm_pwd){
            this.confirm_check = true;
            if(this.register.register_type == ''){
              this.register.register_type = 'GN';
            }
            let params = {
              url: 'register',
              first_name:this.register.first_name,
              last_name:this.register.last_name,
              email: this.register.email,
              password: this.register.password,
              role:2,
              register_type:this.register.register_type,
              domain:this.domain
            };
            this.http.register(params).subscribe((res: Response) => {
              if (res.error) {
                // this.register.password = '';
                this.message = res.message;
                // this.toastr.error(this.message, 'Error', { closeButton: true });
              } else {
                if(res.register_type == 'SL'){
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
                }else{
                  this.toastr.success(res.message, 'Success', { closeButton: true });

                  this.register = { first_name:'', last_name:'', email: '', password: '', confirm_pwd: '',register_type:'' };
                }
                
              }
            });

          }else{
            this.confirm_check = false;
            this.message = "Password and Confirm password are not matched";
            return;
          }
        }else{
          this.message = "Invalid Password";
          return;
        }

  
      }

    }
  }

  sociallogin(social_type:string): void {
    if(social_type == "GG"){
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }else if(social_type == "FB"){
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }else if(social_type == "AP"){
     
      this.getL();
    }
    
  }

  getL(): void{
    this.http.get().subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  } 

}

export interface Register {
  first_name:string;
  last_name:string;
  email: string;
  password: any;
  confirm_pwd:any;
  register_type:any;
}

export interface Response {
  error: boolean;
  token: any;
  message: string;
  role?: any;
  errors?: any;
  register_type?:any;
}
