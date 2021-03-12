import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-topbar',
  templateUrl: './admin-topbar.component.html',
  styleUrls: ['./admin-topbar.component.scss'],
})
export class AdminTopbarComponent implements OnInit {
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
    this.http.post(params).subscribe((res) => {
      sessionStorage.removeItem('_token');
      this.route.navigate(['/login']);
    });
  }
}
