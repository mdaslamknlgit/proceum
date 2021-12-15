import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-sidebar-teacher',
  templateUrl: './sidebar-teacher.component.html',
  styleUrls: ['./sidebar-teacher.component.scss']
})
export class SidebarTeacherComponent implements OnInit {
    public menu_active = 0;
    public is_open: boolean = false;
    public active_route = '';
    constructor(private http: CommonService, private router: Router) {}
    ngOnInit(): void {
      this.active_route = this.router.url;
      this.router.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
          this.active_route = this.router.url;
        }
      });
    }
    closeSidebar(){
      this.http.menu_status = 'sd_cls';
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
      // if (!this.is_open && this.menu_active != num) this.menu_active = num;
      // else {
      //   this.menu_active = 0;
      //   this.active_route = '';
      // }
    }
}
