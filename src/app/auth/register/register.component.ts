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
  register: Register = { first_name:'', last_name:'', sur_name:'', email: '', password: '', confirm_pwd: '' };
  public message: string = 'Invalid email or password';
  constructor( private http: AuthService,private route: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  doRegistration() {
    let params = {
      url: 'user',
      first_name:this.register.first_name,
      last_name:this.register.last_name,
      sur_name:this.register.sur_name,
      email: this.register.email,
      password: this.register.password,
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
  }

}

export interface Register {
  first_name:String;
  last_name:String;
  sur_name:String;
  email: String;
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
