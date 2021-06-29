import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'admin-root',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
    public user = [];
  constructor(private router: Router, private http: CommonService) {}
  ngOnInit() {
      this.user = this.http.getUser();
      console.log(this.http.getUser());
  }
}
