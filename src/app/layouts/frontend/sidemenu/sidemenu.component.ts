import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {
  public menu_active = 0;
  public is_open: boolean = false;
  public active_route = '';
  public user = [];
  public allowed_urls = ['student/content-preview'];
  constructor(private http: CommonService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.http.getUser();
    this.active_route = this.router.url;
    this.router.events.subscribe((ev) => {
        if(!this.user['role'] || this.user['role'] != '2'){
            this.allowed_urls.forEach(url=>{
                if(!this.router.url.includes(url)){
                    let login_id = JSON.parse(atob(localStorage.getItem('user'))).login_id;
                    if(login_id !=undefined)
                        this.logout();
                }
            })
        }
      if (ev instanceof NavigationEnd) {
        this.active_route = this.router.url;
      }
    });
  }
  logout() {
    let login_id = JSON.parse(atob(localStorage.getItem('user'))).login_id;
    let params = { url: 'logout', login_id: login_id };
    this.http.post(params).subscribe((res) => {
      localStorage.removeItem('_token');
      localStorage.removeItem('user');
      setTimeout(res=>{window.location.reload();}, 1000);
      this.router.navigate(['/login']);
    });
  }
  scrollHandler(event) {
    const container = document.querySelector('.sd_br');
    localStorage.setItem('sidemenu_scroll', '' + container.scrollTop);
  }

  get sidemenuStatus() {
    const container = document.querySelector('.sd_br');
    container.scrollTop = localStorage.getItem('sidemenu_scroll')
      ? Number(localStorage.getItem('sidemenu_scroll'))
      : 0;
    return this.http.menu_status;
  }

  activeMenu(num, menu_active) {
    if (num != menu_active) this.menu_active = num;
    else this.menu_active = 0;
  }
}
