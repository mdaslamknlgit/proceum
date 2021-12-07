import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  
}

const ELEMENT_DATA: PeriodicElement[] = [

]

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss']
})
export class AssessmentListComponent implements OnInit {
  displayedColumns: string[] = ['Sno', 'SubName', 'assId', 'assNme', 'dtndTm', 'qstns', 'eqDrtn', 'invTd', 'appeRd', 'absnTee', 'acTn'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
