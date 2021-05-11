import { Component, OnInit, ViewChild } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { environment } from 'src/environments/environment';
import * as Editor from '../../../assets/ckeditor5/build/ckeditor';
import Clipboard from '@ckeditor/ckeditor5-clipboard/src/clipboard';
import { UploadAdapter } from '../../classes/UploadAdapter';
import { CommonService } from 'src/app/services/common.service';

//import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  @ViewChild('editor', { static: false }) editor: CKEditorComponent;
  constructor(private http: CommonService) {}

  public Editor = Editor;
  ngOnInit(): void {
    this.getAllFiles();
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
        'imageStyle:alignLeft',
        'imageStyle:full',
        'imageStyle:alignRight',
      ],
      styles: ['full', 'alignLeft', 'alignRight'],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
    mediaEmbed: {
      previewsInData: true,
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: 'en',
  };
  onReady(eventData) {
    let apiUrl = environment.apiUrl;
    eventData.plugins.get('FileRepository').createUploadAdapter = function (
      loader
    ) {
      var data = new UploadAdapter(loader, apiUrl + 'upload');
      return data;
    };
  }

  getAllFiles() {
    let param = { url: 'get-file-details', path: 'favicon.jpg' };
    this.http.post(param).subscribe((res) => {
      console.log(res);
    });
  }
}
