import { Component, OnInit } from '@angular/core';


export interface PeriodicElement {
 
  sno: number; 
  Volume: string; 
  Subject: string; 
  Chapter: string; 
  Topic : string; 
  SubTopic: string; 
  Actions: string; 
}

const ELEMENT_DATA: PeriodicElement[] = [
  {sno: 1, Volume: 'UG MED VOL -1', Subject: 'Human anatomy', Chapter:'N/A', Topic:'Anatomical terminology', SubTopic:'Demonstrate Positions & movements in human body', Actions:'test'},
  {sno: 1, Volume: 'UG MED VOL -1', Subject: 'Human anatomy', Chapter:'N/A', Topic:'Anatomical terminology', SubTopic:'Demonstrate Positions & movements in human body', Actions:'test'},
  {sno: 1, Volume: 'UG MED VOL -1', Subject: 'Human anatomy', Chapter:'N/A', Topic:'Anatomical terminology', SubTopic:'Demonstrate Positions & movements in human body', Actions:'test'},
  {sno: 1, Volume: 'UG MED VOL -1', Subject: 'Human anatomy', Chapter:'N/A', Topic:'Anatomical terminology', SubTopic:'Demonstrate Positions & movements in human body', Actions:'test'},
  {sno: 1, Volume: 'UG MED VOL -1', Subject: 'Human anatomy', Chapter:'N/A', Topic:'Anatomical terminology', SubTopic:'Demonstrate Positions & movements in human body', Actions:'test'},

];

 

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.scss']
})
export class ContentManagementComponent implements OnInit {

  displayedColumns: string[] = ['sno', 'Volume', 'Subject', 'Chapter', 'Topic', 'SubTopic', 'Actions'];
  dataSource = ELEMENT_DATA;

 

  constructor() { }

  ngOnInit(): void {
  }

}
