import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-admin-topbar',
  templateUrl: './admin-topbar.component.html',
  styleUrls: ['./admin-topbar.component.scss'],
})
export class AdminTopbarComponent implements OnInit {
  public sidemenu_status: string = sessionStorage.getItem('sidemenu');
  public user;
  width: any;
  @HostListener('window:load', ['$event'])
  @HostListener('window:resize', ['$event'])
  onEvent(event) {
    this.width = window.innerWidth;
  }
  constructor(private http: CommonService, private route: Router) {
    this.http.menu_status = sessionStorage.getItem('sidemenu');
  }
  ngOnInit(): void {
    this.user = this.http.getUser();
    this.route.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        if (this.width < 1024) {
          this.sidemenu_status = this.http.menu_status = 'sd_cls';
        }
      }
    });
  }

  toggleSidemenu(param) {
    this.sidemenu_status =
      this.sidemenu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
    sessionStorage.setItem('sidemenu', this.sidemenu_status);
    this.http.menu_status = this.sidemenu_status;
  }

  logout() {
    let login_id = JSON.parse(atob(sessionStorage.getItem('user'))).login_id;
    let params = { url: 'logout', login_id: login_id };
    this.http.post(params).subscribe((res) => {
      this.http.removeSession();
      this.route.navigate(['/login']);
    });
  }
}
