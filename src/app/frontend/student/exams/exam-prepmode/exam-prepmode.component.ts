import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
 
}

const ELEMENT_DATA: PeriodicElement[] = [ 
  
];

@Component({
  selector: 'app-exam-prepmode',
  templateUrl: './exam-prepmode.component.html',
  styleUrls: ['./exam-prepmode.component.scss']
})
export class ExamPrepmodeComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'Subject', 'Chapter', 'Topic', 'subtopic', 'Questions', 'Actions'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
