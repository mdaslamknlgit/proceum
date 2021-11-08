import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-study-mode',
  templateUrl: './study-mode.component.html',
  styleUrls: ['./study-mode.component.scss']
})
export class StudyModeComponent implements OnInit {
  public show_q_numbers = true;
  public lst_grdclk = true;


  constructor() { }

  ngOnInit(): void {
  }

}
