import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exam-mode',
  templateUrl: './exam-mode.component.html',
  styleUrls: ['./exam-mode.component.scss']
})
export class ExamModeComponent implements OnInit {
  public show_q_numbers = true;
  public lst_grdclk = true;

  constructor() { }

  ngOnInit(): void {
  }

}
