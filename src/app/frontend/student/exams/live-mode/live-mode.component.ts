import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-mode',
  templateUrl: './live-mode.component.html',
  styleUrls: ['./live-mode.component.scss']
})
export class LiveModeComponent implements OnInit {
  public rvrsClr = true; 
  constructor() { }

  ngOnInit(): void {
  }

}
