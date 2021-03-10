import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

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
