import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
CommonService;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private http: CommonService) {}
  ngOnInit(): void {}
}
