import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'admin-root',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  loading: boolean;
  constructor(private loaderService: CommonService, private router: Router) {
    this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;
    });
  }
  ngOnInit() {}

}
