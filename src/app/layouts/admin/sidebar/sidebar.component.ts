import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public menu_active = 0;
  public is_open: boolean = false;
  constructor(private http: CommonService) {}
  ngOnInit(): void {}
  get sidemenuStatus() {
    return this.http.menu_status;
  }
  activeMenu(num) {
    //alert();
    if (!this.is_open && this.menu_active != num) this.menu_active = num;
    else {
      this.menu_active = 0;
    }
  }
}
