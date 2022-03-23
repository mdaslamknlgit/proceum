import { Component, OnInit } from '@angular/core';
export interface PeriodicElement {
 
}

const ELEMENT_DATA: PeriodicElement[] = [ 
  
];
@Component({
  selector: 'app-create-exam',
  templateUrl: './create-exam.component.html',
  styleUrls: ['./create-exam.component.scss']
})
export class CreateExamComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'Subject', 'Chapter', 'Topic', 'subtopic', 'Questions', 'Actions'];
  dataSource = ELEMENT_DATA;
  constructor() { }
  ngOnInit(): void {
  }
}
