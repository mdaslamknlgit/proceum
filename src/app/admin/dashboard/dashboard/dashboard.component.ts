import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	constructor(private http: CommonService) { }
	public user:String;
	ngOnInit(): void {
	}
	getUser(){
		let params = {url: 'user', email:'hareesh@sparshcom.net', password: '12345678'};
		this.http.postGetData(params).subscribe((res) =>{
		console.log(res);
		this.user = JSON.stringify(res['user']);
		});
	}
	logout(){
		let params = {url: 'logout'};
    	this.http.postGetData(params).subscribe((res) =>{
      		console.log(res);
    	});
	}
}
