import { Component, OnInit, ViewChild } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { environment } from 'src/environments/environment';
import * as Editor from '../../../assets/ckeditor5/build/ckeditor';
//import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor: CKEditorComponent;
  constructor() {}

  public Editor = Editor;
  ngOnInit(): void {
    //console.log(this.Editor.ui.componentFactory.names());
  }
  editorConfig = {
    Plugins: [],
    placeholder: 'Enter content',
    toolbar: {
      items: environment.ckeditor_toolbar,
    },
    image: {
      upload: ['png'],
      toolbar: [
        'imageTextAlternative',
        '|',
        'imageStyle:alignLeft',
        'imageStyle:full',
        'imageStyle:alignRight',
      ],
      styles: ['full', 'alignLeft', 'alignRight'],
    },
    ckfinder: {
      uploadUrl: environment.apiUrl + 'upload',
      //withCredentials: true,
      headers: {
        'X-CSRF-TOKEN': 'CSFR-Token',
        Authorization: 'Bearer <JSON Web Token>',
      },
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: 'en',
  };
}
