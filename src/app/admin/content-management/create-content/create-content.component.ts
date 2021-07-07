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
import { Subscription } from 'rxjs/internal/Subscription';

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
  public displayedColumns: string[] = ['s_no', 'question', 'action'];
  public video_types = [{name: "KPoint", value:'KPOINT'}, {name: "Youtube", value:'YOUTUBE'}]
  public all_questions = new MatTableDataSource();
  public selected_questions = ELEMENT_DATA; // new MatTableDataSource();
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
  public lecture_note_content: string = '';
  public lecture_note_title: string = '';
  public lecture_note_obj = [];
  public lecture_note_index = '';
  public highyield_content: string = '';
  public highyield_title: string = '';
  public highyield_obj = [];
  public highyield_index = '';
  public cases = '';
  public mcqs = '';
  public related_topics = '';
  public external_ref_content = '';
  public content_id = 0;
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
  public showReviewers = false;
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
  public review_docs = [];
  public review_docs_new = [];
  public content_reviewer_role = '';
  public intro_video = [{pk_id:0, video_section:'INTRO', source:'', title:'', value:'', status:''}];
  public two_d_videos = [{pk_id:0, video_section:'2D', source:'', title:'', value:'', status:''}];
  public board_lecture_videos = [{pk_id:0, video_section:'BOARD_LECTURES', source:'', title:'', value:'', status:''}];
  public clinical_videos = [{pk_id:0, video_section:'CLINICAL_ESSENTIALS', source:'', title:'', value:'', status:''}];
  public procedural_videos = [{pk_id:0, video_section:'PROCEDURAL', source:'', title:'', value:'', status:''}];
  public three_d_videos = [{pk_id:0, video_section:'3D', source:'', title:'', value:'', status:''}];
  public publsh_content = false;
  private subscription:Subscription;
  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.user = this.http.getUser();
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
  ngOnDestroy() { 
    this.subscription.unsubscribe();
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
        let videos = data['videos'];
        if(videos['intro_video'].length > 0){
            this.intro_video = videos['intro_video'];
        }
        if(videos['two_d_videos'].length > 0){
            this.two_d_videos = videos['two_d_videos'];
        }
        if(videos['board_lecture_videos'].length > 0){
            this.board_lecture_videos = videos['board_lecture_videos'];
        }
        if(videos['clinical_videos'].length > 0){
            this.clinical_videos = videos['clinical_videos'];
        }
        if(videos['procedural_videos'].length > 0){
            this.procedural_videos = videos['procedural_videos'];
        }
        if(videos['three_d_videos'].length > 0){
            this.three_d_videos = videos['three_d_videos'];
        }
        this.main_content = data['main_content'];
        this.learning_obj_content = data['learning_obj_content'];
        this.lecture_note_obj = data['learning_note_obj'];
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
  addVideo(tabIndex){
    if(tabIndex == 1){
      this.two_d_videos.push({pk_id:0, video_section:'2D', source:'', title:'', value:'', status:''});
    }
    if(tabIndex == 2){
      this.board_lecture_videos.push({pk_id:0, video_section:'BOARD_LECTURES', source:'', title:'', value:'', status:''});
    }
    if(tabIndex == 3){
      this.clinical_videos.push({pk_id:0, video_section:'CLINICAL_ESSENTIALS', source:'', title:'', value:'', status:''});
    }
    if(tabIndex == 4){
      this.procedural_videos.push({pk_id:0, video_section:'PROCEDURAL', source:'', title:'', value:'', status:''});
    }
    if(tabIndex == 5){
      this.three_d_videos.push({pk_id:0, video_section:'3D', source:'', title:'', value:'', status:''});
    }
  }
  removeVideo(tabIndex, index){
    if(tabIndex == 1){
        this.two_d_videos[index]['status'] = "delete";
        //this.two_d_videos.splice(index, 1);
    }
    if(tabIndex == 2){
      this.board_lecture_videos[index]['status'] = "delete";
      //this.board_lecture_videos.splice(index, 1);
    }
    if(tabIndex == 3){
      this.clinical_videos[index]['status'] = "delete";
      //this.clinical_videos.splice(index, 1);
    }
    if(tabIndex == 4){
      this.procedural_videos[index]['status'] = "delete";
      //this.procedural_videos.splice(index, 1);
    }
    if(tabIndex == 5){
      this.three_d_videos[index]['status'] = "delete";
      //this.three_d_videos.splice(index, 1);
    }
  }
  getChildData() {
    this.subscription = this.http.child_data.subscribe((res) => {
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
  selectReviewer() {
    this.showReviewers = true;
  }
  CloseSelectReviewer() {
    this.showReviewers = !this.showReviewers;
  }
  addLectureNote() {
    let lecture_note = {
      id: 0,
      title: this.lecture_note_title,
      content: this.lecture_note_content,
    };
    if (this.lecture_note_index != '' && this.lecture_note_obj[Number(this.lecture_note_index)] != undefined) {
      this.lecture_note_obj[Number(this.lecture_note_index)]['title'] =
        this.lecture_note_title;
      this.lecture_note_obj[Number(this.lecture_note_index)]['content'] =
        this.lecture_note_content;
    } else {
      this.lecture_note_obj.push(lecture_note);
    }
    this.lecture_note_title = '';
    this.lecture_note_content = '';
    this.lecture_note_index = '';
  }
  editLectureNote(index) {
    this.lecture_note_index = '' + index;
    this.lecture_note_title = this.lecture_note_obj[index]['title'];
    this.lecture_note_content = this.lecture_note_obj[index]['content'];
  }
  removeLectureNote(index) {
    if (index > -1) {
      this.lecture_note_obj[index]['status'] = 'delete';
      if (this.lecture_note_obj[index]['id'] == 0)
        this.lecture_note_obj.splice(index, 1);
    }
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
      intro_video: this.intro_video,
      two_d_videos: this.two_d_videos,
      board_lecture_videos: this.board_lecture_videos,
      clinical_videos: this.clinical_videos,
      procedural_videos: this.procedural_videos,
      three_d_videos: this.three_d_videos,
      main_content: this.main_content,
      attachments: this.attachments,
      images: this.images,
      learning_obj_content: this.learning_obj_content,
      learning_notes_content: this.learning_notes_content,
      learning_note_obj: this.lecture_note_obj,
      highyield_obj: this.highyield_obj,
      external_ref_content: this.external_ref_content,
      selected_mcqs: this.selected_mcqs,
      selected_short_questions: this.selected_short_questions,
      selected_cases: this.selected_cases,
      is_draft: is_draft,
      content_id: this.content_id,
      reviewer_role: is_draft?'':this.reviewer_role,
      publsh_content: this.publsh_content
    };
    let params = { url: 'create-content', form_data: form_data };

    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.navigateTo('manage-content');
      } else {
          this.publsh_content = false;
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }
  showComments() {
      if(!this.show_coments){
        this.getComents();
      }else{
        this.show_coments = !this.show_coments;
      }
  }
  getComents(){
    let param = {
        url: 'get-content-comments',
        content_id : this.content_id
    };
    this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
        //this.toster.success(res['message'], 'Success', { closeButton: true });
        this.show_coments = !this.show_coments;
        this.older_coments = res['data']['comments'];
        this.review_docs = res['data']['review_docs'];
        } else {
        this.toster.error(res['message'], res['message'], {
            closeButton: true,
        });
        }
    });
  }
  uploadReviewFiles(event) {
    let allowed_types = [];
    allowed_types = [
        'doc',
        'docx',
        'pdf',
        'odt',
        'xls',
        'xlsx',
        'ppt',
        'csv',
      ];
    const uploadData = new FormData();
    let files = event.target.files;
    if (files.length == 0) return false;
    let valid_files = [];
    for (var i = 0; i < files.length; i++) {
      let ext = files[i].name.split('.').pop().toLowerCase();
      if (allowed_types.includes(ext)) {
        valid_files.push(files[i]);
        uploadData.append('file' + i, files[i]);
      } else {
        this.toster.error(
          ext +
            ' Extension not allowed file (' +
            files[i].name +
            ') not uploaded'
        );
      }
    }
    if (valid_files.length == 0) {
      //this.documents_input.nativeElement.value = '';
      return false;
    }
    uploadData.append('path', 'documents/review_docs');
    uploadData.append('number_files', files.length);
    let param = { url: 'upload-files' };
    this.http.imageUpload(param, uploadData).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success('Files successfully uploaded.', 'File Uploaded');
      }
      //this.review_docs_new.push(res['url']);
      this.review_docs.push(res['url']);
    });
  }
  removeReviewDocument(index){
    if (index > -1) {
      this.review_docs.splice(index, 1);
    }
  }
  addComent(){
      if(this.comments_content == ''){
          return false;
      }
    let param = {
        url: 'add-content-comment',
        content_id : this.content_id,
        comment: this.comments_content,
        review_docs: this.review_docs
    };
    this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.older_coments = res['data']['comments'];
        this.review_docs = res['data']['review_docs'];
        this.comments_content = '';
        } else {
        this.toster.error(res['message'], res['message'], {
            closeButton: true,
        });
        }
    });
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
        this.publsh_content = true;
        this.createContent(true);
        // let param = {
        //     url: 'content-publish/' + this.content_id,
        //     publish: 1
        // };
        // this.http.post(param).subscribe((res) => {
        //     if (res['error'] == false) {
        //     this.toster.success(res['message'], 'Success', { closeButton: true });
        //     this.navigateTo('manage-content');
        //     } else {
        //     this.toster.error(res['message'], res['message'], {
        //         closeButton: true,
        //     });
        //     }
        // });
    }
}
