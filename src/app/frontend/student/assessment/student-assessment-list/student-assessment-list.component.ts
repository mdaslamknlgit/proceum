import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  
}

const ELEMENT_DATA: PeriodicElement[] = [

]

@Component({
  selector: 'app-student-assessment-list',
  templateUrl: './student-assessment-list.component.html',
  styleUrls: ['./student-assessment-list.component.scss']
})
export class StudentAssessmentListComponent implements OnInit {
  displayedColumns: string[] = ['assId', 'assTyp', 'SubName', 'dtndTm', 'qstns', 'eqDrtn', 'mrKs', 'prCent', 'reSlt', 'stTs', 'acTn'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
