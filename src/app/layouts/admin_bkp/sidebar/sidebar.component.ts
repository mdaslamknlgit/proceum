import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public menu_active = 0;
  public is_open: boolean = false;
  public active_route = '';
  public user = [];
  constructor(private http: CommonService, private router: Router, public translate: TranslateService) {
    this.translate.setDefaultLang(this.http.lang);
  }
  ngOnInit(): void {
    this.active_route = this.router.url;
    this.router.events.subscribe((ev) => {
        this.user = this.http.getUser();
        if(this.user.length == 0 && this.router.url != '/login'){
            this.logout();
        }
      if (ev instanceof NavigationEnd) {
        this.active_route = this.router.url;
      }
    });
  }
  closeSidebar(){
    this.http.menu_status = 'sd_cls';
  }
  logout() {
          let local_storage = localStorage.getItem('user');
      if(local_storage){
        let login_id = JSON.parse(atob(local_storage)).login_id;
        let params = { url: 'logout', login_id: login_id };
        this.http.post(params).subscribe((res) => {
        this.http.removeSession();
        setTimeout(res=>{
            //window.location.href='/login';
        }, 1000)
        });
      }
      else{
        this.http.removeSession();
        setTimeout(res=>{
            //window.location.href='/login';
        }, 1000)
      }
  }
  scrollHandler(event) {
    const container = document.querySelector('.sd_br');
    sessionStorage.setItem('sidemenu_scroll', '' + container.scrollTop);
  }
  get sidemenuStatus() {
    const container = document.querySelector('.sd_br');
    container.scrollTop = sessionStorage.getItem('sidemenu_scroll')
      ? Number(sessionStorage.getItem('sidemenu_scroll'))
      : 0;
    return this.http.menu_status;
  }
  activeMenu(num, menu_active) {
    if (num != menu_active) this.menu_active = num;
    else this.menu_active = 0;
  }
}

