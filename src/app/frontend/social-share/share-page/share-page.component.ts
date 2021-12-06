import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  sno: number;
  platform: string;
  datetime: string;
  aproval_status: string;
  actions: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {sno: 1, platform: 'Facebook', datetime: '09-11-21', aproval_status: '', actions: ''},
  {sno: 1, platform: 'Facebook', datetime: '09-11-21', aproval_status: '', actions: ''},
  {sno: 1, platform: 'Facebook', datetime: '09-11-21', aproval_status: '', actions: ''},
];

@Component({
  selector: 'app-share-page',
  templateUrl: './share-page.component.html',
  styleUrls: ['./share-page.component.scss']
})
export class SharePageComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'platform','datetime','actions','aproval_status'];
  dataSource = ELEMENT_DATA;
  public model_status = false;
  toggleModel() {
    this.model_status = !this.model_status;
  }
  constructor() { }

  ngOnInit(): void {
  }

}
