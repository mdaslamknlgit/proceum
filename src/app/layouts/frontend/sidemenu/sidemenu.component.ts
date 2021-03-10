import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {
  constructor(private http: CommonService) {}

  ngOnInit(): void {}
  get sidemenuStatus() {
    return this.http.menu_status;
  }
}
