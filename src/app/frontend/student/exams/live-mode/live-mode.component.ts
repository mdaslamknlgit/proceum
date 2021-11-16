import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-mode',
  templateUrl: './live-mode.component.html',
  styleUrls: ['./live-mode.component.scss']
})
export class LiveModeComponent implements OnInit {
  public show_q_numbers = true;
  public rvrsClr = true;
  public qstnsPup = false;
  public instrPup = false;
  constructor() { }

  ngOnInit(): void {
  }

}
