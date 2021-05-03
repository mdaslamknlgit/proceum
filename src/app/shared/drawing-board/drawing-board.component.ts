import { Component, Inject, OnInit } from '@angular/core';
import { NgWhiteboardService } from 'ng-whiteboard';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-drawing-board',
  templateUrl: './drawing-board.component.html',
  styleUrls: ['./drawing-board.component.scss'],
})
export class DrawingBoardComponent implements OnInit {
  color = '#333333';
  backgroundColor = '#fff';
  size = '5px';
  isActive = false;
  elem;
  isFullscreen = false;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private toastr: ToastrService,
    private whiteboardService: NgWhiteboardService
  ) {}
  

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    this.isFullscreen = true;
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
    this.isFullscreen = false;
  }

  ngOnInit(): void {
    this.elem = document.documentElement;
  }
  onInit() {}
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
