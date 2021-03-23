import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
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
  get sidemenuStatus() {
    return this.http.menu_status;
  }
  activeMenu(num) {
    if (!this.is_open && this.menu_active != num) this.menu_active = num;
    else {
      this.menu_active = 0;
      this.active_route = '';
    }
  }
}
