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
  register: Register = { first_name:'', last_name:'', email: '',  phone:'',provider:'',id:'', password: '', confirm_pwd: '',register_type:'' };
  public message: string = 'Required data is missing';
  public first_name:string = "First Name is Required";
  public last_name:string = "Last Name is Required";
  public email_error: string = "Email is Required";
  public password_error:string = "Password is Required";
  public confirm_password_error:string = "Confirm Password is Required";
  public email_check: boolean = true;
  public password_check: boolean = true;
  public confirm_check: boolean = true;
  public is_login:boolean=false;
  domain:string;
  confirm_hide: boolean = true;
  password_hide: boolean = true;
  is_show: boolean = false;
  constructor( private http: AuthService,private route: Router,private toastr: ToastrService,private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
    this.domain = location.origin;
    this.socialAuthService.authState.subscribe((user) => {
      if (user && this.is_login==false) {
        this.is_login=true;
        this.socialUser = user;
        this.register.first_name = this.socialUser.firstName;
        this.register.last_name =  this.socialUser.lastName;
        this.register.email =  this.socialUser.email;
        this.register.password = 'Proceum@123' ;
        this.register.confirm_pwd = 'Proceum@123';
        this.register.register_type = 'SL';
        this.register.provider =this.socialUser.provider;
        this.register.id = this.socialUser.id;
        this.message = "";
        if(this.register.first_name == '' || this.register.last_name == '' || this.register.email == '' || this.register.password == '' || this.register.confirm_pwd == ''){
        }else{
    
          if (this.register.email != "") {
            this.email_check = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.register.email);
            if (this.email_check == false) {
              this.email_error = "Invalid email";
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
                  provider :this.register.provider,
                  id: this.register.id,
                  domain:this.domain
                };
                this.http.register(params).subscribe((res: Response) => {
                  if (res.error) {
                    this.is_show = false;
                    this.toastr.error(res.message, 'Error', { closeButton: true , timeOut: 5000});
                  } else {
                    if(res.register_type == 'SL'){
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
                    }else{
                      this.is_show = true;
                      this.register = { first_name:'', last_name:'', email: '',  phone:'',provider:'',id:'', password: '', confirm_pwd: '',register_type:'' };
                    }
                    
                  }
                });
    
              }else{
                this.confirm_check = false;
                this.confirm_password_error = "Password and Confirm password are not matched";
              }
            }else{
              this.password_error = "A minimum 8 characters password contains a combination of uppercase and lowercase letter,special character and number are required.";
            }
    
      
          }
    
        }

      }
    });

  }

  confirmFun(){
    this.confirm_hide = !this.confirm_hide;
  }

  passwordFun(){
    this.password_hide = !this.password_hide;
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
  phone:any;
  provider:any
  id:any;
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
