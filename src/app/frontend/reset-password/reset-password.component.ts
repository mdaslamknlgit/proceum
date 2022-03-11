import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  password_hide: boolean = true;
  password_confirm_hide: boolean = true;
  password_check: boolean = false;
  confirm_check: boolean = false;
  public password_msg: string = 'Password is Required';
  public confirm_msg: string = 'Confirm Password is Required';
  is_show: boolean = false;
  reset: Reset = { new_password: '', confirm_password: '' };
  hash_token:any;
  constructor(private http: AuthService,private toastr: ToastrService,private router: Router,private activatedRoute: ActivatedRoute) {
    this.hash_token = this.activatedRoute.snapshot.paramMap.get('token');
   }

  ngOnInit(): void {
  }

  doResetPassword(){

    if(this.reset.new_password == '' || this.reset.confirm_password == ''){
    }else{

      if(this.reset.new_password != ""){
        const regex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#^()><?/:;,.])[A-Za-z\d$@$!%*?&#^()><?/:;,.].{7,15}');
        this.password_check = regex.test(this.reset.new_password);
        if(this.password_check == true){
          if(this.reset.new_password === this.reset.confirm_password){
            this.confirm_check = true;
            let params = {
              url: 'reset-password',
              password:this.reset.new_password,
              hash_token:this.hash_token
            };
            this.http.register(params).subscribe((res: Response) => {
              if(res.error) {
                this.is_show = false;
                this.toastr.error(res.message, 'Error', { closeButton: true , timeOut: 5000});
              }else{
                this.is_show = true;
                this.toastr.success(res.message, 'Success', { closeButton: true, timeOut: 5000 });
              }
            });

          }else{
            this.confirm_check = false;
            this.confirm_msg = "Password and Confirm password are not matched";
            this.toastr.error(this.confirm_msg, 'Error', { closeButton: true, timeOut: 5000 });
          }
        }else{
          this.password_msg = "A minimum 8 characters password contains a combination of uppercase and lowercase letter,special character and number are required.";
          this.toastr.error(this.password_msg, 'Error', { closeButton: true, timeOut: 5000 });
        }

  
      }

    }

  }

  passwordFun() {
    this.password_hide = !this.password_hide;
  }
  passwordConfirmFun(){
    this.password_confirm_hide = !this.password_confirm_hide;
  }

}

export interface Reset {
  new_password: any;
  confirm_password: any;
}

export interface Response {
  error: boolean;
  message: string;
  errors?: any;
}
