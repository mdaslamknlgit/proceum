import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
	selector: 'app-login',
  	templateUrl: './login.component.html',
  	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	currentYear: number = new Date().getFullYear();
	login = {email:'', password: ''};
	constructor(private http: AuthService, private route: Router) { }
	ngOnInit(): void {}
  	doLogin(){
    	let params = {url: 'login', email:'hareesh@sparshcom.net', password: '12345678'};
    	this.http.login(params).subscribe((res) =>{
      		sessionStorage.setItem("_token", res["token"]);
			  this.route.navigate(['/dashboard']);
    	});
  	}
	logout(){
		let params = {url: 'logout', email:'hareesh@sparshcom.net', password: '12345678'};
    	this.http.login(params).subscribe((res) =>{
      		sessionStorage.setItem("_token", res["token"]);
			this.route.navigate(['/login']);
    	});
	}
}
