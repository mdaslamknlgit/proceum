import { Component, OnInit, ViewChild } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { environment } from 'src/environments/environment';
import * as Editor from '../../../assets/ckeditor5/build/ckeditor';
import { UploadAdapter } from '../../classes/UploadAdapter';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
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
  public library_purpose: any;
  public attachments = [];
  public attachment_files = [];
  public images = [];
  public images_files = [];
  onReady(eventData) {
    let apiUrl = environment.apiUrl;
    eventData.plugins.get('FileRepository').createUploadAdapter = function (
      loader
    ) {
      var data = new UploadAdapter(loader, apiUrl + 'upload');
      return data;
    };
  }
  constructor(private http: CommonService, private toster: ToastrService) {}
  ngOnInit(): void {
    this.http.child_data.subscribe((res) => {
      if (this.library_purpose == 'attachments') {
        let obj = { file_path: res['file_path'], path: res['path'] };
        if (this.attachment_files.includes(obj['file_path'])) {
          this.toster.error('File is already used', 'File Exists');
        } else {
          this.toster.success('Files Added.', 'File');
          this.attachments.push(obj);
          this.attachment_files.push(obj['file_path']);
        }
      }
      if (this.library_purpose == 'images') {
        let obj = { file_path: res['file_path'], path: res['path'] };
        if (this.images_files.includes(obj['file_path'])) {
          this.toster.error('File is already used', 'File Exists');
        } else {
          this.toster.success('Files Added.', 'File');
          this.images.push(obj);
          this.images_files.push(obj['file_path']);
        }
      }
    });
  }
  CloseModal() {
    this.library_popup = false;
  }
  openAssetsLibrary(tab, purpose) {
    this.library_purpose = purpose;
    this.active_tab = tab;
    this.library_popup = true;
  }
  removeFile(index, purpose) {
    if (purpose == 'attachments') {
      const index2 = this.attachment_files.indexOf(
        this.attachments[index]['file_path']
      );
      if (index2 > -1) {
        this.attachment_files.splice(index2, 1);
        this.attachments.splice(index, 1);
      }
    } else if (purpose == 'images') {
      const index2 = this.images_files.indexOf(this.images[index]['file_path']);
      if (index2 > -1) {
        this.images_files.splice(index2, 1);
        this.images.splice(index, 1);
      }
    }
  }
}
