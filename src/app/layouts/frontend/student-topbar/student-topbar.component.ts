import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-topbar',
  templateUrl: './student-topbar.component.html',
  styleUrls: ['./student-topbar.component.scss'],
})
export class StudentTopbarComponent implements OnInit {
  public sidemenu_status: String = '';
  public innerWidth: any;
  public isOpen = false;
  menus: any;
  subMenus: any = [];
  constructor(
    private http: CommonService,
    private route: Router,
  ) {}
  public user;
  ngOnInit(): void {
    this.http.menu_status = '';
    this.user = this.http.getUser();
    this.innerWidth = window.innerWidth;
  }

  navigateTo() {
    if (this.user['role'] == '1') {
      this.route.navigateByUrl('/admin/dashboard');
    } else if(this.user['role'] == '2') {
      this.route.navigateByUrl('/student/dashboard');
    }
  }

  toggleSidemenu(param) {
    this.sidemenu_status =
      this.sidemenu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
    this.http.menu_status = this.sidemenu_status;
  }
  logout() {
    let login_id = JSON.parse(atob(sessionStorage.getItem('user'))).login_id;
    let params = { url: 'logout', login_id: login_id };
    this.http.post(params).subscribe((res) => {
      sessionStorage.removeItem('_token');
      sessionStorage.removeItem('user');
      this.route.navigate(['/login']);
    });
  }
  menuToggle() {
    this.isOpen = !this.isOpen;
  }
  isSticky: boolean = false;

  // @HostListener('window:resize', ['$event'])
  //   onResize(event) {
  //   this.innerWidth = window.innerWidth;
  // }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    // var AinnerWidth = window.innerWidth;
    this.isSticky = window.pageYOffset >= 100;
  }
}
