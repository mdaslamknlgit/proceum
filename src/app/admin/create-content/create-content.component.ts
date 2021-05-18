import { Component, OnInit, ViewChild } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { environment } from 'src/environments/environment';
import * as Editor from '../../../assets/ckeditor5/build/ckeditor';
import { UploadAdapter } from '../../classes/UploadAdapter';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  public active_tab = 'images';
  @ViewChild('editor', { static: false }) editor: CKEditorComponent;
  public library_popup: boolean = false;
  public Editor = Editor;
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
  constructor(private http: CommonService) {}
  ngOnInit(): void {
    this.http.child_data.subscribe((res) => {
      console.log(res);
    });
  }
  CloseModal() {
    this.library_popup = false;
  }
  openAssetsLibrary(tab) {
    alert(tab);
    this.active_tab = tab;
    this.library_popup = true;
  }
}
