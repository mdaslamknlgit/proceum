import { Component, OnInit, ViewChild } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { environment } from 'src/environments/environment';
import * as Editor from '../../../../assets/ckeditor5/build/ckeditor';
import { UploadAdapter } from '../../../classes/UploadAdapter';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
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
  public title = '';
  public videos = [];
  public videos_files = [];
  public main_content: string = '';
  public library_purpose: any;
  public attachments = [];
  public attachment_files = [];
  public images = [];
  public images_files = [];
  public learning_obj_content: string = '';
  public learning_notes_content: string = '';
  public highyield_content: string = '';
  public cases = '';
  public mcqs = '';
  public related_topics = '';
  public external_ref_content = '';
  public content_id = 0;
  onReady(eventData) {
    let apiUrl = environment.apiUrl;
    eventData.plugins.get('FileRepository').createUploadAdapter = function (
      loader
    ) {
      var data = new UploadAdapter(loader, apiUrl + 'upload');
      return data;
    };
  }
  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.content_id = param.id;
      if (this.content_id != undefined) {
        this.getContent();
      }
    });
    this.getChildData();
  }
  getContent() {
    let data = { url: 'create-content/' + this.content_id };
    this.http.post(data).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data']['content_data'];
        this.title = data['title'];
        this.main_content = data['main_content'];
        this.learning_obj_content = data['learning_obj_content'];
        this.learning_notes_content = data['learning_notes_content'];
        this.highyield_content = data['highyield_content'];
        this.external_ref_content = data['external_ref_content'];
        this.attachments = data['attachments'];
        this.attachment_files = [];
        if (data['attachments'].length > 0) {
          data['attachments'].forEach((file) => {
            this.attachment_files.push(file['file_path']);
          });
        }
        this.images = data['images'];
        this.images_files = [];
        if (data['images'].length > 0) {
          data['images'].forEach((file) => {
            this.images_files.push(file['file_path']);
          });
        }
        this.videos = data['main_videos'];
        this.videos_files = [];
        if (data['main_videos'].length > 0) {
          data['main_videos'].forEach((file) => {
            this.videos_files.push(file['file_path']);
          });
        }
      }
    });
  }
  getChildData() {
    this.http.child_data.subscribe((res) => {
      if (this.library_purpose == 'attachments') {
        let obj = { file_path: res['file_path'], path: res['path'] };
        if (this.attachment_files.includes(obj['file_path'])) {
          this.toster.error('File is already used', 'File Exists', {
            closeButton: true,
          });
        } else {
          this.toster.success('Files Added.', 'File', { closeButton: true });
          this.attachments.push(obj);
          this.attachment_files.push(obj['file_path']);
        }
      }
      if (this.library_purpose == 'images') {
        let obj = { file_path: res['file_path'], path: res['path'] };
        if (this.images_files.includes(obj['file_path'])) {
          this.toster.error('File is already used', 'File Exists', {
            closeButton: true,
          });
        } else {
          this.toster.success('Files Added.', 'File', { closeButton: true });
          this.images.push(obj);
          this.images_files.push(obj['file_path']);
        }
      }
      if (this.library_purpose == 'videos') {
        let obj = { file_path: res['file_path'], path: res['path'] };
        if (this.videos_files.includes(obj['file_path'])) {
          this.toster.error('File is already used', 'File Exists', {
            closeButton: true,
          });
        } else {
          this.toster.success('Files Added.', 'File', { closeButton: true });
          this.videos.push(obj);
          this.videos_files.push(obj['file_path']);
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
    } else if (purpose == 'videos') {
      const index2 = this.videos_files.indexOf(this.videos[index]['file_path']);
      if (index2 > -1) {
        this.videos_files.splice(index2, 1);
        this.videos.splice(index, 1);
      }
    }
  }
  createContent(is_draft) {
    let form_data = {
      title: this.title,
      main_videos: this.videos,
      intro_video: '',
      main_content: this.main_content,
      attachments: this.attachments,
      images: this.images,
      learning_obj_content: this.learning_obj_content,
      learning_notes_content: this.learning_notes_content,
      highyield_content: this.highyield_content,
      external_ref_content: this.external_ref_content,
      mcqs: this.mcqs,
      cases: this.cases,
      is_draft: is_draft,
      content_id: this.content_id,
    };
    let params = { url: 'create-content', form_data: form_data };

    this.http.post(params).subscribe((res) => {
      this.toster.success(res['message'], 'Success', { closeButton: true });
      (<HTMLFormElement>document.getElementById('curriculum_form')).reset();
      this.videos = [];
      this.videos_files = [];
      this.attachments = [];
      this.attachment_files = [];
      this.images = [];
      this.images_files = [];
    });
  }
}
