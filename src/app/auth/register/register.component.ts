import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  register: Register = { first_name:'', last_name:'', email: '', password: '', confirm_pwd: '' };
  public message: string = 'Required data is missing';
  public email_check: boolean = false;
  public password_check: boolean = false;
  public confirm_check: boolean = false;
  constructor( private http: AuthService,private route: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
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
            let params = {
              url: 'register',
              first_name:this.register.first_name,
              last_name:this.register.last_name,
              email: this.register.email,
              password: this.register.password,
              role:2
            };
            this.http.register(params).subscribe((res: Response) => {
              if (res.error) {
                this.register.password = '';
                this.message = res.message;
                this.toastr.error(this.message, 'Error', { closeButton: true });
              } else {
                sessionStorage.setItem('_token', res['data'].token);
                sessionStorage.setItem('role', res['data'].role);
                  this.route.navigate(['/student/dashboard']);
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

}

export interface Register {
  first_name:string;
  last_name:string;
  email: string;
  password: any;
  confirm_pwd:any;
}

export interface Response {
  error: boolean;
  token: any;
  message: string;
  role?: any;
  errors?: any;
}
