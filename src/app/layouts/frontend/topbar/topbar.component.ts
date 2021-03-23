import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  public sidemenu_status: String = '';
  constructor(private http: CommonService, private route: Router) {}
  public user;
  ngOnInit(): void {
    this.http.menu_status = '';
    this.user = this.http.getUser();
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
      sessionStorage.removeItem('user');
      this.route.navigate(['/login']);
    });
  }
  isSticky: boolean = false;
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 150;
  }
}
