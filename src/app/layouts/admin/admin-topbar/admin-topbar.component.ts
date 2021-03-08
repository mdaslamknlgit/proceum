import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-topbar',
  templateUrl: './admin-topbar.component.html',
  styleUrls: ['./admin-topbar.component.scss']
})
export class AdminTopbarComponent implements OnInit {

  constructor(private http: CommonService, private route: Router) { }
 
  ngOnInit(): void {
  }

  
	logout(){
		let params = {url: 'logout'};
    	this.http.postGetData(params).subscribe((res) =>{
			sessionStorage.removeItem("_token");
			this.route.navigate(['/login']);
    	});
	}
}
