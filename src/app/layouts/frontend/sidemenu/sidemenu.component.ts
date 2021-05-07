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
  constructor(private http: CommonService, private router: Router) {}

  ngOnInit(): void {
    this.active_route = this.router.url;
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.active_route = this.router.url;
      }
    });

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
