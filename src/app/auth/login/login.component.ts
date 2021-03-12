import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  login: Login = { email: '', password: '' };
  public message: String = 'Invalid email or password';
  constructor(private http: AuthService, private route: Router) {}
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
      } else {
        sessionStorage.setItem('_token', res['data'].token);
        sessionStorage.setItem('role', res['data'].role);
        if (res['data'].role == 1) this.route.navigate(['/admin/dashboard']);
        else this.route.navigate(['/student/dashboard']);
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
  message: String;
  role?: any;
  errors?: any;
}
