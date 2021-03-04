import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	constructor(private http: CommonService, private route: Router) { }
	public user:String;
	ngOnInit(): void {
	}
	getUser(){
		let params = {url: 'user', email:'hareesh@sparshcom.net', password: '12345678'};
		this.http.postGetData(params).subscribe((res) =>{
		this.user = JSON.stringify(res['user']);
		});
	}
	logout(){
		let params = {url: 'logout'};
    	this.http.postGetData(params).subscribe((res) =>{
			this.user = '';
			this.route.navigate(['/login']);
    	});
	}
}
