import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(private http: CommonService) {}
  ngOnInit(): void {}
  get sidemenuStatus() {
    return this.http.menu_status;
  }
}
