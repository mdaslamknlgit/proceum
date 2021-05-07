import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  public sidemenu_status: String = '';
  public innerWidth: any;
  public isOpen = false;
  activeClass: string = 'tp_rt_mn';
  menus: any;
  subMenus: any = [];
  subMenuCount: number = 0;
  isCustomMenuShow: boolean = true;
  constructor(
    private http: CommonService,
    private authHttp: AuthService,
    private route: Router,
    private activeRoute: ActivatedRoute
  ) {}
  public user;
  id: number = undefined;
  ngOnInit(): void {
    this.http.menu_status = '';
    this.user = this.http.getUser();
    this.innerWidth = window.innerWidth;
    this.getMenus();
    this.activeRoute.params.subscribe((routeParams) => {
      if (routeParams.id) {
        this.activeClass = 'tp_rt_mn active';
      }
    });
  }

  navigateTo() {
    if (this.user['role'] == '1') {
      this.route.navigateByUrl('/admin/dashboard');
    } else if (this.user['role'] == '2') {
      this.route.navigateByUrl('/student/dashboard');
    }
  }
  menuActive() {
    if (typeof this.id != undefined) {
      this.activeClass = 'tp_rt_mn active';
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

  getMenus() {
    let params = { url: 'get-menus' };
    this.authHttp.post(params).subscribe((res) => {
      this.menus = res['menus'];
    });
  }
  
  changeSubmenu(menu_id) {
    this.subMenus =[];
    let params = {
      url: 'sub-menu',
      parent_id: menu_id,
      name: 'sub-menu'
    };
    this.authHttp.post(params).subscribe((res) => {
      this.subMenus = res['pages'];
    });
  }
}
