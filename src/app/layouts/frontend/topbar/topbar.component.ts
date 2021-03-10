import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  public sidemenu_status: String = 'sd_opn';
  constructor(private http: CommonService, private route: Router) {}

  ngOnInit(): void {
    this.http.menu_status = 'sd_opn';
  }
  toggleSidemenu(param) {
    this.sidemenu_status =
      this.sidemenu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
    this.http.menu_status = this.sidemenu_status;
  }
  logout() {
    let params = { url: 'logout' };
    this.http.postGetData(params).subscribe((res) => {
      sessionStorage.removeItem('_token');
      this.route.navigate(['/login']);
    });
  }
}
