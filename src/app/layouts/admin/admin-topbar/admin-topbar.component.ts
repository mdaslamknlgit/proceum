import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-topbar',
  templateUrl: './admin-topbar.component.html',
  styleUrls: ['./admin-topbar.component.scss'],
})
export class AdminTopbarComponent implements OnInit {
  public sidemenu_status: String = "sd_opn";
  constructor(
    private http: CommonService,
    private route: Router,
    private sidebar: SidebarComponent
  ) {}
  ngOnInit(): void {
  }
  toggleSidemenu() {
    console.log(this.sidebar.sidemenu_status);
    this.sidemenu_status = this.sidemenu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
    this.sidebar.set(this.sidemenu_status);
  }

  logout() {
    let params = { url: 'logout' };
    this.http.postGetData(params).subscribe((res) => {
      sessionStorage.removeItem('_token');
      this.route.navigate(['/login']);
    });
  }
}
