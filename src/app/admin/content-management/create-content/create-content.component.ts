import { Component, OnInit, ViewChild } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { environment } from 'src/environments/environment';
import * as Editor from '../../../../assets/ckeditor5/build/ckeditor';
import { UploadAdapter } from '../../../classes/UploadAdapter';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  s_no: number;
  question: number;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { s_no: 1, question: 1.0079, action: 'H' },
  { s_no: 2, question: 4.0026, action: 'He' },
  { s_no: 3, question: 6.941, action: 'Li' },
];

@Component({
  selector: 'app-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  displayedColumns: string[] = ['s_no', 'question', 'action'];
  all_questions = new MatTableDataSource();
  selected_questions = ELEMENT_DATA; // new MatTableDataSource();
  public user = [];
  public is_submit = false;
  public active_tab = 'images';
  public selected_mcqs = [];
  public selected_cases = [];
  public selected_short_questions = [];
  public library_popup: boolean = false;
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
  public highyield_title: string = '';
  public highyield_obj = [];
  public highyield_index = '';
  public cases = '';
  public mcqs = '';
  public related_topics = '';
  public external_ref_content = '';
  public content_id = 0;
  public show_questions = false;
  public active_tab_type = 'mcq';
  public search_question = '';
  public all_or_selected = 'all';
  public question_tab = 0;
  public short_answer_tab = 0;
  public case_tab = 0;
  public offset = 0;
  public limit = environment.page_size;
  public totalSize: 0;
  public page = 0;
  public page_size_options = environment.page_size_options;
  public older_coments = [];
  public comments_content = '';
  public show_coments = false;
  public reviewer_role = '';
  public reviewers = [];
  public is_published = '';
  @ViewChild(MatPaginator, { static: false })
  paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('editor', { static: false }) editor: CKEditorComponent;
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
  public pgae_title = 'Create Content';
  public show_tabs = false;
  content_reviewer_role = '';
  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.user = this.http.getUser();
    let comments = {
      name: 'Reviewer1',
      comment:
        '01. Fusce tincidunt dolor vel arcu vulputate, sed cursus metus pulvinar.02. Mauris vitae mi auctor, porta libero non, venenatis tellus. 03.Quisque ac nunc et ipsum hendrerit porta. 04. Pellentesque et ex egetaugue convallis faucibus. 05. Morbi condimentum tortor sit amet justolaoreet, vitae scelerisque ipsum vestibulum.',
      date_time: '24-05-2021 13:10:10',
    };
    this.older_coments.push(comments);
    this.activatedRoute.params.subscribe((param) => {
      this.content_id = param.id;
      if (this.content_id != undefined) {
        this.pgae_title = 'Edit Content';
        this.getContent();
      }
      else{
          this.content_id = 0;
      }
    });
    this.getChildData();
    this.getReviewers();
  }
  getReviewers(){
    let data = { url: 'get-reviewers' };
    this.http.post(data).subscribe((res) => {
        if (res['error'] == false) {
            this.reviewers = res['data']['reviewers'];
        }
    })
  }
  ngAfterViewInit(){
      this.show_tabs = true;
  }
  getContent() {
    let data = { url: 'create-content/' + this.content_id };
    this.http.post(data).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data']['content_data'];
        this.content_reviewer_role = data['reviewer_role'];
        this.is_published = data['is_published'];
        this.title = data['title'];
        this.main_content = data['main_content'];
        this.learning_obj_content = data['learning_obj_content'];
        this.learning_notes_content = data['learning_notes_content'];
        this.highyield_obj = data['highyield_obj'];
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
        this.selected_mcqs = data['selected_mcqs'];
        this.selected_short_questions = data['selected_short_questions'];
        this.selected_cases = data['selected_cases'];
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
  viewQuestions() {
    let data = {
      url: 'questions-list',
      limit: this.limit,
      offset: this.offset,
    };
    this.http.post(data).subscribe((res) => {
      if (res['error'] == false) {
        this.show_questions = true;
      }
    });
  }
  CloseQuestiosModal() {
    this.show_questions = !this.show_questions;
  }
  addHighyield() {
    let highyield = {
      id: 0,
      title: this.highyield_title,
      content: this.highyield_content,
    };
    if (this.highyield_index != '') {
      this.highyield_obj[Number(this.highyield_index)]['title'] =
        this.highyield_title;
      this.highyield_obj[Number(this.highyield_index)]['content'] =
        this.highyield_content;
    } else {
      this.highyield_obj.push(highyield);
    }
    this.highyield_title = '';
    this.highyield_content = '';
    this.highyield_index = '';
  }
  editHighyield(index) {
    this.highyield_index = '' + index;
    this.highyield_title = this.highyield_obj[index]['title'];
    this.highyield_content = this.highyield_obj[index]['content'];
  }
  removeHighyield(index) {
    if (index > -1) {
      this.highyield_obj[index]['status'] = 'delete';
      if (this.highyield_obj[index]['id'] == 0)
        this.highyield_obj.splice(index, 1);
    }
  }
  notesTab(event) {
    let tab_index = event.index;
    this.question_tab = 0;
    this.short_answer_tab = 0;
    this.case_tab = 0;
    this.search_question = '';
    this.all_or_selected = 'all';
    if (tab_index == 3) {
      this.active_tab_type = 'mcq';
      let data = {
        url: 'questions-list',
        limit: this.limit,
        offset: this.offset,
        type: this.active_tab_type,
        all_or_selected: this.all_or_selected,
      };
      this.getAllQuestions(data);
    }
    if (tab_index == 4) {
      this.active_tab_type = 'short_answer';
      let data = {
        url: 'questions-list',
        limit: this.limit,
        offset: this.offset,
        type: this.active_tab_type,
        all_or_selected: this.all_or_selected,
      };
      this.getAllQuestions(data);
    }
    if (tab_index == 5) {
      this.active_tab_type = 'case';
      let data = {
        url: 'questions-list',
        limit: this.limit,
        offset: this.offset,
        type: this.active_tab_type,
        all_or_selected: this.all_or_selected,
      };
      this.getAllQuestions(data);
    }
  }

  questionsTab(tab) {
    let tab_index = tab.index;
    this.search_question = '';
    //this.question_tab = tab_index;
    if (tab_index == 0) {
      this.all_or_selected = 'all';
      let data = {
        url: 'questions-list',
        limit: this.limit,
        offset: this.offset,
        type: this.active_tab_type,
        all_or_selected: this.all_or_selected,
      };
      this.getAllQuestions(data);
    }
    if (tab_index == 1) {
      let question_ids = [];
      if (this.active_tab_type == 'mcq') {
        question_ids = this.selected_mcqs;
      }
      if (this.active_tab_type == 'short_answer') {
        question_ids = this.selected_short_questions;
      }
      if (this.active_tab_type == 'case') {
        question_ids = this.selected_cases;
      }
      this.all_or_selected = 'selected';
      let data = {
        url: 'questions-list',
        limit: this.limit,
        offset: this.offset,
        type: this.active_tab_type,
        all_or_selected: this.all_or_selected,
        question_ids: question_ids,
      };
      if (question_ids.length > 0) {
        this.getAllQuestions(data);
      } else {
        this.all_questions = new MatTableDataSource([]);
      }
    }
  }
  getAllQuestions(param) {
    this.resetPagination();
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.all_questions = new MatTableDataSource(
          res['data']['question_list']
        );
        this.totalSize = res['total_records'];

        this.all_questions.paginator = this.paginator;
      } else {
        this.all_questions = new MatTableDataSource([]);
      }
    });
  }
  searchQuestions() {
    this.resetPagination();
    let param = {
      url: 'questions-list',
      type: this.active_tab_type,
      offset: this.page,
      limit: this.limit,
      search: this.search_question,
      all_or_selected: this.all_or_selected,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.all_questions = new MatTableDataSource(
          res['data']['question_list']
        );
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.all_questions = new MatTableDataSource([]);
      }
    });
  }
  resetPagination() {
    //console.log(this.all_questions.paginator.page);
    if (this.paginator != undefined) {
      this.paginator.pageIndex = 0;
      this.paginator.firstPage();
    }
    this.offset = 0;
    this.limit = environment.page_size;
    this.totalSize = 0;
    this.page = 0;
  }
  public getServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'questions-list',
      type: this.active_tab_type,
      offset: this.page,
      limit: event.pageSize,
      search: this.search_question,
      all_or_selected: this.all_or_selected,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.all_questions = new MatTableDataSource(
          res['data']['question_list']
        );
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.all_questions = new MatTableDataSource([]);
      }
    });
  }
  selectQuestion(event, id) {
    id = '' + id;
    if (this.active_tab_type == 'mcq') {
      if (event['checked'] == true) {
        this.selected_mcqs.push(id);
      } else {
        const index = this.selected_mcqs.indexOf(id);
        if (index > -1) {
          this.selected_mcqs.splice(index, 1);
        }
      }
    }
    if (this.active_tab_type == 'short_answer') {
      if (event['checked'] == true) {
        this.selected_short_questions.push(id);
      } else {
        const index = this.selected_short_questions.indexOf(id);
        if (index > -1) {
          this.selected_short_questions.splice(index, 1);
        }
      }
    }
    if (this.active_tab_type == 'case') {
      if (event['checked'] == true) {
        this.selected_cases.push(id);
      } else {
        const index = this.selected_cases.indexOf(id);
        if (index > -1) {
          this.selected_cases.splice(index, 1);
        }
      }
    }
  }
  createContent(is_draft) {
    this.is_submit = true;
    if(this.title == ''){
        return false;
    }
    let form_data = {
      title: this.title,
      main_videos: this.videos,
      intro_video: '',
      main_content: this.main_content,
      attachments: this.attachments,
      images: this.images,
      learning_obj_content: this.learning_obj_content,
      learning_notes_content: this.learning_notes_content,
      highyield_obj: this.highyield_obj,
      external_ref_content: this.external_ref_content,
      selected_mcqs: this.selected_mcqs,
      selected_short_questions: this.selected_short_questions,
      selected_cases: this.selected_cases,
      is_draft: is_draft,
      content_id: this.content_id,
      reviewer_role: is_draft?'':this.reviewer_role
    };
    let params = { url: 'create-content', form_data: form_data };

    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.navigateTo('manage-content');
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
      //   (<HTMLFormElement>document.getElementById('curriculum_form')).reset();
      //   this.videos = [];
      //   this.videos_files = [];
      //   this.attachments = [];
      //   this.attachment_files = [];
      //   this.images = [];
      //   this.images_files = [];
    });
  }
  showComments() {
    this.show_coments = !this.show_coments;
  }
  navigateTo(url){
    let user = this.user;
    if(user['role']== '1'){
        url = "/admin/"+url;
    }
    if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
      url = "/reviewer/"+url;
  }
    this.router.navigateByUrl(url);
}
    publishContent(){
        let param = {
            url: 'content-publish/' + this.content_id,
            publish: 1
        };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
            this.toster.success(res['message'], 'Success', { closeButton: true });
            this.navigateTo('manage-content');
            } else {
            this.toster.error(res['message'], res['message'], {
                closeButton: true,
            });
            }
        });
    }
}
