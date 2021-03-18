import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  login: Login = { email: '', password: '' };
  public message: string = 'Invalid email or password';
  constructor(
    private http: AuthService,
    private route: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    sessionStorage.removeItem('_token');
  }
  doLogin() {
    let params = {
      url: 'login',
      email: this.login.email,
      password: this.login.password,
    };
    this.http.login(params).subscribe((res: Response) => {
      if (res.error) {
        this.login.password = '';
        this.message = res.message;
        this.toastr.error(this.message, 'Error', { closeButton: true });
      } else {
        sessionStorage.setItem('_token', res['data'].token);
        let json_user = btoa(JSON.stringify(res['data'].user));
        sessionStorage.setItem('user', json_user);
        if (res['data']['user']['role'] == 1)
          this.route.navigate(['/admin/dashboard']);
        else if (res['data']['user']['role'] == 2)
          this.route.navigate(['/student/dashboard']);
      }
    });
  }
  logout() {
    let params = { url: 'logout' };
    this.http.login(params).subscribe((res: Response) => {
      sessionStorage.removeItem('_token');
      this.route.navigate(['/login']);
    });
  }
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
