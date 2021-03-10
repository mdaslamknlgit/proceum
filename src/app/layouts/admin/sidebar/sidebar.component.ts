import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor() {}
  @Input() sidemenu_status: String = 'sd_opn';
  ngOnInit(): void {}
  set(status){
    this.sidemenu_status = status;
  }
  ngOnChanges() {
    this.sidemenu_status = this.sidemenu_status;
 }
}
