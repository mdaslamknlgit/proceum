import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  public sidemenu_status: String = '';
  public innerWidth: any;
  public isOpen = false;
  constructor(private http: CommonService, private route: Router,private socialAuthService: SocialAuthService) {}
  public user;
  ngOnInit(): void {
    this.http.menu_status = '';
    this.user = this.http.getUser();
    this.innerWidth = window.innerWidth;
  }
  toggleSidemenu(param) {
    this.sidemenu_status =
      this.sidemenu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
    this.http.menu_status = this.sidemenu_status;
  }
  logout() {
    let login_id = JSON.parse(atob(sessionStorage.getItem('user'))).login_id;
    let params = { url: 'logout',login_id:login_id };
    this.http.post(params).subscribe((res) => {
      sessionStorage.removeItem('_token');
      sessionStorage.removeItem('user');
      this.socialAuthService.signOut(true);
      this.route.navigate(['/login']);
    });
 }
  menuToggle(){
      this.isOpen = !this.isOpen;
  }
  isSticky: boolean = false;

  // @HostListener('window:resize', ['$event'])
  //   onResize(event) {
  //   this.innerWidth = window.innerWidth;
  // }

  @HostListener('window:scroll',  ['$event'])
  checkScroll() {
    // var AinnerWidth = window.innerWidth;
    this.isSticky = window.pageYOffset >= 100;
  }
}
