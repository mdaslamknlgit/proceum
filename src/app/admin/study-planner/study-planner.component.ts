import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'}];



@Component({
  selector: 'app-study-planner',
  templateUrl: './study-planner.component.html',
  styleUrls: ['./study-planner.component.scss']
})
export class StudyPlannerComponent implements OnInit {
    displayedColumns: string[] = ['SNo', 'Topic', 'MCQ', 'Cases', 'Shortans', 'Videos', 'Actions'];
    dataSource = ELEMENT_DATA;
    public study_plan = {name:'', course:[], duration:[]}
    constructor() { }
    ngOnInit(): void {

    }

}
