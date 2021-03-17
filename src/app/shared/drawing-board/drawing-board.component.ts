import { Component, OnInit } from '@angular/core';
import { NgWhiteboardService } from 'ng-whiteboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drawing-board',
  templateUrl: './drawing-board.component.html',
  styleUrls: ['./drawing-board.component.scss'],
})
export class DrawingBoardComponent implements OnInit {
  color = '#333333';
  backgroundColor = '#eee';
  size = '5px';
  isActive = false;

  constructor(
    private toastr: ToastrService,
    private whiteboardService: NgWhiteboardService
  ) {}
  ngOnInit(): void {}
  onInit() {
    this.toastr.success('Init!');
  }
  onClear() {
    this.toastr.success('Clear!');
  }
  onUndo() {
    this.toastr.success('Undo!');
  }
  onRedo() {
    this.toastr.success('Redo!');
  }
  onSave() {
    this.toastr.success('Save!');
  }
  onImageAded() {
    this.toastr.success('ImageAded!');
  }

  erase() {
    this.whiteboardService.erase();
  }
  setSize(size) {
    this.size = size;
    this.isActive = false;
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
  addImage(fileInput) {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      this.whiteboardService.addImage(reader.result);
      fileInput.value = '';
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }
}
