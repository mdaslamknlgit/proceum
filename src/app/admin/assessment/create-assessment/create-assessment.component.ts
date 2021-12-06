import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  Subject: string;
  Chapter: string;
  Topic: string;
  Count: string;
  Action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {Subject: 'Subject', Chapter: 'Chapter', Topic: 'Topic', Count: 'Count', Action: 'Action'},
];



@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.scss']
})
export class CreateAssessmentComponent implements OnInit {
  displayedColumns: string[] = ['Subject', 'Chapter', 'Topic', 'Count', 'Action'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
