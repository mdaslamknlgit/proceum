import { Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NavigationEnd, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-topbar',
  templateUrl: './admin-topbar.component.html',
  styleUrls: ['./admin-topbar.component.scss'],
})
export class AdminTopbarComponent implements OnInit {
  public sidemenu_status: string = "sd_cls";
  // public sidemenu_status: string = localStorage.getItem('sidemenu');
  public glbSrch = true;
  public user;
  public search_key;
  private subscription: Subscription;
  public content_notifications = [];
  public load_top_bar: boolean;
  public show_notifications = false;
  width: any;
  @HostListener('window:load', ['$event'])
  @HostListener('window:resize', ['$event'])
  onEvent(event) {
    this.width = window.innerWidth;
  }
  @Output() finishedLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private http: CommonService, public translate: TranslateService, private route: Router, private fs: FirebaseService,) {
    this.http.menu_status = "sd_cls";
    this.translate.setDefaultLang(this.http.lang);
    // this.http.menu_status = localStorage.getItem('sidemenu');
  }
  ngOnInit(): void {
    //check subdomain
    let sub_domain = window.location.hostname.split('.')[0];
    //static sub domain
    //sub_domain = 'drsprep';
    //If subdomain not exist in in app domains then check for partner domain
    if (environment.INAPP_DOMAINS_ARRAY.indexOf(sub_domain) === -1) {
      this.getSubDomainDetails(sub_domain);
    } else {
      localStorage.setItem('header_logo', '');
      this.load_top_bar = true;
      this.finishedLoading.emit(true);
    }
    this.user = this.http.getUser();
    this.route.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        // if (this.width < 1024) {
        this.sidemenu_status = this.http.menu_status = 'sd_cls';
        // }
      }
    });
  }
  ngAfterViewInit() {
    let param = { path: "content_notifications", role_id: Number(this.user['role']) };
    this.subscription = this.fs.getNotifications(param).subscribe(res => {
      this.content_notifications = res;
    })
  }
  // toggleSidemenu(param) {
  //   this.sidemenu_status =
  //     this.sidemenu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
  //   localStorage.setItem('sidemenu', 'sd_cls');
  //   // localStorage.setItem('sidemenu', this.sidemenu_status);
  //   this.http.menu_status = this.sidemenu_status;
  // }

  toggleSidemenu(param) {
    this.sidemenu_status = this.http.menu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  navigateTo(url) {
    let user = this.http.getUser();
    if (user['role'] == '1') {
      url = "/admin/" + url;
    }
    if (user['role'] == '3' || user['role'] == '4' || user['role'] == '5' || user['role'] == '6' || user['role'] == '7') {
      url = "/reviewer/" + url;
    }
    this.route.navigateByUrl(url);
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
  adminglobalsearch() {
    // this.route.navigateByUrl('/admin/global-search/' + this.search_key)
    this.route.navigateByUrl('/index/global-search/' + this.search_key)
  }
}
