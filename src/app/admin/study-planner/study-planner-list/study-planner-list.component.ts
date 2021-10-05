import { Component, OnInit } from '@angular/core';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'}];

@Component({
  selector: 'app-study-planner-list',
  templateUrl: './study-planner-list.component.html',
  styleUrls: ['./study-planner-list.component.scss']
})
export class StudyPlannerListComponent implements OnInit {
  displayedColumns: string[] = ['SNo', 'Topic', 'MCQ', 'Cases', 'Shortans', 'Videos', 'Actions'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
