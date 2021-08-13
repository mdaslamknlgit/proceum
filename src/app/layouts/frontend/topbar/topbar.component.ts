import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  public sidemenu_status: String = '';
  public innerWidth: any;
  public isOpen = false;
  public load_top_bar = false;
  activeClass: string = 'tp_rt_mn';
  menus: any;
  subMenus: any = [];
  subMenuCount: number = 0;
  isCustomMenuShow: boolean = true;
  sub_domain_data: any = [];
  constructor(
    private http: CommonService,
    private authHttp: AuthService,
    private route: Router,
    private activeRoute: ActivatedRoute
  ) {}
  public user;
  id: number = undefined;
  ngOnInit(): void {
    //check subdomain
    let sub_domain = window.location.hostname;
    //sub_domain = 'aiimst';
    //If subdomain not exist in in app domains then check for partner domain
    if(environment.INAPP_DOMAINS_ARRAY.indexOf(sub_domain) === -1){
      this.getSubDomainDetails(sub_domain);
    }else{
      this.load_top_bar = true;
    }
    this.http.menu_status = '';
    this.user = this.http.getUser();
    this.innerWidth = window.innerWidth;
    this.getMenus();
    this.activeRoute.params.subscribe((routeParams) => {
      if (routeParams.id) {
        //this.activeClass = 'tp_rt_mn active';
      }
    });
  }

  navigateTo() {
    if (this.user['role'] == '1') {
      this.route.navigateByUrl('/admin/dashboard');
    } else if (this.user['role'] == '2') {
      this.route.navigateByUrl('/student/dashboard');
    }
    else if (this.user['role'] == '3' || this.user['role'] == '4' || this.user['role'] == '5' || this.user['role'] == '6' || this.user['role'] == '7') {
        this.route.navigateByUrl('/reviewer/dashboard');
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
    let login_id = JSON.parse(atob(localStorage.getItem('user'))).login_id;
    let params = { url: 'logout', login_id: login_id };
    this.http.post(params).subscribe((res) => {
      localStorage.removeItem('_token');
      localStorage.removeItem('user');
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
    this.subMenus = [];
    let params = {
      url: 'sub-menu',
      parent_id: menu_id,
      name: 'sub-menu',
    };
    this.authHttp.post(params).subscribe((res) => {
      this.subMenus = res['pages'];
    });
  }

  getSubDomainDetails(sub_domain){
    let params = {
      url: 'get-subdomain-details',
      sub_domain: sub_domain,
    };
    this.authHttp.post(params).subscribe((res) => {
      if(!res['error']){
        this.sub_domain_data = res['data'];
        localStorage.setItem('sub_domain_data', this.sub_domain_data);
        //console.log(this.sub_domain_data);
      }else{
        console.log("No subdomain data found");
      }
      this.load_top_bar = true;
    });
  }
}
