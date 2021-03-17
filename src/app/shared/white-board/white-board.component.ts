import { Component, OnInit } from '@angular/core';
import { NgWhiteboardService } from 'ng-whiteboard';
@Component({
  selector: 'app-white-board',
  templateUrl: './white-board.component.html',
  styleUrls: ['./white-board.component.scss'],
})
export class WhiteBoardComponent implements OnInit {
  whtbrdsts = 'none';
  color: string = '#000';
  backgroundColor: string = 'transparent';
  size: string = '2px';
  public main_div_height = 0;
  public main_div_width = 0;
  constructor(private whiteboardService: NgWhiteboardService) {}
  ngOnInit(): void {}
  tglwbrd() {
    if (this.whtbrdsts == 'none') {
      var elmnt = document.getElementById('main_div');
      this.main_div_height = elmnt.scrollHeight - 5;
      this.main_div_width = elmnt.scrollWidth;
      this.whtbrdsts = 'block';
    } else {
      this.whtbrdsts = 'none';
    }
  }
  erase() {
    this.whiteboardService.erase();
  }
  setSize(size) {
    this.size = size;
  }
  save() {
    this.whiteboardService.save();
  }
  undo() {
    this.whiteboardService.undo();
  }
  redo() {
    this.whiteboardService.redo();
  }
}
