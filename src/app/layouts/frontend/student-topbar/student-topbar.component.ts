import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NavigationEnd, Router } from '@angular/router';
import { CartCountService } from '../../../services/cart-count.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-student-topbar',
  templateUrl: './student-topbar.component.html',
  styleUrls: ['./student-topbar.component.scss'],
})
export class StudentTopbarComponent implements OnInit {
  public sidemenu_status: string = localStorage.getItem('sidemenu');
  public glbSrch = true;
  public user;
  public search_key;
  //For cart badge
  number: any;
  subscription: Subscription;
  user_id = '';
  load_top_bar = false;
  @Output() finishedLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private http: CommonService,
    private route: Router,
    private cartCountService: CartCountService,
    public translate: TranslateService,
  ) {
    this.http.menu_status = localStorage.getItem('sidemenu');
    this.translate.setDefaultLang(this.http.lang);
    //for cart badge
    this.subscription = this.cartCountService.getNumber().subscribe(number => { this.number = number });
  }
  ngAfterViewInit() {
    this.search_key = this.http.search_string;
  }
  ngOnInit(): void {
    //check subdomain
    let sub_domain = window.location.hostname.split('.')[0];
    //static sub domain
    //sub_domain = 'iimsc';
    //If subdomain not exist in in app domains then check for partner domain
    if (environment.INAPP_DOMAINS_ARRAY.indexOf(sub_domain) === -1) {
      this.getSubDomainDetails(sub_domain);
    } else {
      localStorage.setItem('header_logo', '');
      this.load_top_bar = true;
      this.finishedLoading.emit(true);
    }
    this.user = this.http.getUser();
    if (this.user) {
      this.user_id = this.user['id'];
      this.getCartCount();
    }
    this.route.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        // if (this.width < 1024) {
        this.sidemenu_status = this.http.menu_status = 'sd_cls';
        // }
      }
    });
  }

  // toggleSidemenu(param) {
  //   this.sidemenu_status =
  //     this.sidemenu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
  //   localStorage.setItem('sidemenu', this.sidemenu_status);
  //   this.http.menu_status = this.sidemenu_status;
  // }
  getCartCount() {
    if (this.user_id != '') {
      let params = { url: 'get-cart-count', id: this.user_id };
      this.http.post(params).subscribe((res) => {
        if (res['data'] != 0) {
          this.cartCountService.sendNumber(res['data']);
        }
      });
    }

  }

  toggleSidemenu(param) {
    this.sidemenu_status =
      this.http.menu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
    this.http.menu_status = this.sidemenu_status;
  }

  logout() {
    let login_id = JSON.parse(atob(localStorage.getItem('user'))).login_id;
    let params = { url: 'logout', login_id: login_id };
    this.http.post(params).subscribe((res) => {
      this.http.removeSession();
      this.route.navigate(['/login']);
    });
  }

  getSubDomainDetails(sub_domain) {
    let params = {
      url: 'get-subdomain-details',
      sub_domain: sub_domain,
    };
    this.http.post(params).subscribe((res) => {
      if (!res['error']) {
        localStorage.setItem('header_logo', res['data']['header_logo']);
        localStorage.setItem('footer_logo', res['data']['footer_logo']);
        localStorage.setItem('organization_name', res['data']['organization_name']);
        localStorage.setItem('description', res['data']['description']);
        //console.log(this.sub_domain_data);
      } else {
        //window.location.href = environment.APP_BASE_URL;
      }
      this.load_top_bar = true;
      this.finishedLoading.emit(true);
    });
  }

  getHeaderLogo() {
    let header_logo = localStorage.getItem('header_logo');
    if (header_logo) {
      return header_logo;
    } else {
      return "./assets/images/ProceumLogo.png";
    }
  }
  studentglobalsearch() {
    // this.route.navigateByUrl('/student/global-search/' + this.search_key)
    this.route.navigateByUrl('/index/global-search/' + this.search_key)
  }
}
