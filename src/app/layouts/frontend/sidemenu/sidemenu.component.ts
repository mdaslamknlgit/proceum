import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {
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
