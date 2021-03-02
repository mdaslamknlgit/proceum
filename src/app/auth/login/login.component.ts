import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private http: AuthService) { }

  ngOnInit(): void {
  }
  doLogin(){
    let params = {url: 'login', email:'hareesh@sparshcom.net', password: '12345678'};
    this.http.login(params).subscribe((res) =>{
      console.log(res);
    })
  }
}
