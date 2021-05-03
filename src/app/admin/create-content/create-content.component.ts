import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss']
})
export class CreateContentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public Editor = ClassicEditor;
  htmlEditorConfig = {
    mediaEmbed: {
      previewsInData: true,
    },

    placeholder: 'Enter content',
  };
}
