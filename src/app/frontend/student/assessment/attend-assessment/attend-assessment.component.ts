import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attend-assessment',
  templateUrl: './attend-assessment.component.html',
  styleUrls: ['./attend-assessment.component.scss']
})
export class AttendAssessmentComponent implements OnInit {
  public show_q_numbers = true;
  public lst_grdclk = true;
  constructor() { }

  ngOnInit(): void {
  }

}
