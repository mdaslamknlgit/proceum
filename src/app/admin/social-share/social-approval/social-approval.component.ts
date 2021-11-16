import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  sno: number;
  username: string;
  email: string;
  phone: string;
  platform: string;
  datetime: string;
  actions: string;
  aproval_status: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {sno: 1, username: 'John Doe 1', email: 'student1@gmail.com', phone: '+91-987654321', platform: 'Facebook', datetime: '09-11-21', actions: '', aproval_status: ''},
  {sno: 1, username: 'John Doe 1', email: 'student1@gmail.com', phone: '+91-987654321', platform: 'Facebook', datetime: '09-11-21', actions: '', aproval_status: ''},
];


@Component({
  selector: 'app-social-approval',
  templateUrl: './social-approval.component.html',
  styleUrls: ['./social-approval.component.scss']
})
export class SocialApprovalComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'username','email','phone','platform','datetime','actions','aproval_status'];
  dataSource = ELEMENT_DATA;
  public model_status = false;
  toggleModel() {
    this.model_status = !this.model_status;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
