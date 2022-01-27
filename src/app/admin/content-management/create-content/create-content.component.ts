import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
import { FirebaseService } from 'src/app/services/firebase.service';
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
  public video_types = environment.video_types;
  public all_questions = new MatTableDataSource();
  public flash_card_all_questions = new MatTableDataSource();
  public teacher_materials_all_questions = new MatTableDataSource();
  public selected_questions = ELEMENT_DATA; // new MatTableDataSource();
  public user = [];
  public is_submit = false;
  public active_tab = 'images';
  public selected_mcqs = [];
  public selected_cases = [];
  public selected_short_questions = [];
  public selected_flash_cards = [];
  public selected_teacher_materials = [];
  public library_popup: boolean = false;
  public title = '';
  public is_paid = true;
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
  public lecture_note_title_duplicate = false;
  public lecture_note_obj = [];
  public lecture_note_index = '';
  public highyield_content: string = '';
  public highyield_title: string = '';
  public highyield_title_duplicate = false;
  public highyield_obj = [];
  public highyield_index = '';
  public loading_questions=false;
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
  public flashcard_tab = 0;
  public teachermaterials_tab = 0;
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
  public content_parent_id = 0;
  public is_draft = false;
  public dataentry_uid = 0;
  public is_preview = false;
  public allow_coment = false;
  public bucket_url = "";
    public threed_object:any;
  @ViewChild(MatPaginator, { static: false })
  paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('editor', { static: false }) editor: CKEditorComponent;
  @ViewChild('description_editor', { static: false }) description_editor: CKEditorComponent;
  @ViewChild('lerning_obj_editor', { static: false }) lerning_obj_editor: CKEditorComponent;
  @ViewChild('lecture_editor', { static: false }) lecture_editor: CKEditorComponent;
  @ViewChild('highyield_editor', { static: false }) highyield_editor: CKEditorComponent;
  @ViewChild('external_editor', { static: false }) external_editor: CKEditorComponent;
  public focus_editor =  '';
  public Editor = Editor;
  @HostListener('window:open_library', ['$event'])
  openCustomPopup(event) {
    this.openAssetsLibrary('images/content_images', 'editor');
  }
  editorReviewConfig = {
    Plugins: [],
    placeholder: 'Enter content',
    toolbar: {
      items: ['Heading', 'bold', 'FontColor', 'FontBackgroundColor', 'italic', 'underline', 'link', 'bulletedList', 'numberedList',],
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
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'TableProperties', 'TableCellProperties'],

            // Configuration of the TableProperties plugin.
            tableProperties: {
                // ...
            },

            // Configuration of the TableCellProperties plugin.
            tableCellProperties: {
                // ...
            }
    },
    mediaEmbed: {
      previewsInData: true,
    },
    language: 'en',
  };
  editorConfig = {
    Plugins: [],
    placeholder: 'Enter content',
    toolbar: {
      items: environment.ckeditor_toolbar,
    },
    link: {
        decorators: {
            openInNewTab: {
                mode: 'manual',
                label: 'Open in a new tab',
                defaultValue: true,			// This option will be selected by default.
                attributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                }
            }
        }
    },
    image: {
      upload: ['png'],
      toolbar: [
        'imageStyle:alignLeft',
        'imageStyle:full',
        'imageStyle:alignRight',
        'imageStyle:side'
      ],
      styles: ['full', 'alignLeft', 'alignRight', 'side'],
    },
    // wproofreader: {
    //     serviceId: 'your-service-ID',
    //     srcUrl: 'https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js'
    // },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'TableProperties', 'TableCellProperties'],
    },
    highlight: {
        options: [
            {
                model: 'yellowMarker',
                class: 'marker-yellow',
                title: 'Yellow marker',
                color: 'var(--ck-highlight-marker-yellow)',
                type: 'marker'
            }]
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
      var data = new UploadAdapter(loader, apiUrl + 'upload-content-image');
      return data;
    };
  }
  public pgae_title = 'Create Content';
  public content_status = '';
  public show_tabs = false;
  public review_docs = [];
  public review_docs_new = [];
  public content_reviewer_role = '';
  //intro videos
  public video_source_0 = '';
  public video_title_0 = '';
  public video_title_error_0 = '';
  public video_value_0 = "";
  public video_value_error_0 = "";
  public video_value_invalid_error_0 = "";
  public video_index_0:any;
  public intro_video = [];
  //2d videos
  public video_source_1 = '';
  public video_title_1 = '';
  public video_title_error_1 = '';
  public video_value_1 = "";
  public video_value_error_1 = "";
  public video_value_invalid_error_1 = "";
  public video_index_1:any;
  public two_d_videos = [];
  //board lecture vidoes
  public video_source_2 = '';
  public video_title_2 = '';
  public video_title_error_2 = '';
  public video_value_2 = "";
  public video_value_error_2 = "";
  public video_value_invalid_error_2 = "";
  public video_index_2:any;
  public board_lecture_videos = [];
  //clinical videos
  public video_source_3 = '';
  public video_title_3 = '';
  public video_title_error_3 = '';
  public video_value_3 = "";
  public video_value_error_3 = "";
  public video_value_invalid_error_3 = "";
  public video_index_3:any;
  public clinical_videos = [];
  //procedural videos
  public video_source_4 = '';
  public video_title_4 = '';
  public video_title_error_4 = '';
  public video_value_4 = "";
  public video_value_error_4 = "";
  public video_value_invalid_error_4 = "";
  public video_index_4:any;
  public procedural_videos = [];
  //3d videos
  public video_source_5 = '3D_OBJECT';
  public video_title_5 = '';
  public video_title_error_5 = '';
  public video_value_5 = "";
  public video_value_error_5 = "";
  public video_value_invalid_error_5 = "";
  public video_index_5:any;
  public three_d_videos = [];

  public publsh_content = false;
  public publish_message = "";
  private subscription:Subscription;
  private subscription_editor:Subscription;
  public schdule_publish = false;
  public publish_date = new Date();
  public publish_time = '';
  public today_date = new Date();
  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fs: FirebaseService
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
    this.getChildDataEditor();
    this.getReviewers();
  }
  public load_editor = false;
  ngOnDestroy() { 
      
    this.subscription.unsubscribe();
    this.subscription_editor.unsubscribe();
}
  getReviewers(){
    let data = { url: 'get-reviewers' };
    this.http.post(data).subscribe((res) => {
        if (res['error'] == false) {
            this.reviewers = res['data']['reviewers'];
            this.curriculum_list = res['data']['curriculums'];
            this.bucket_url = res['data']['bucket_url'];
        }
    })
  }
  ngAfterViewInit(){
      setTimeout(res=>{
        this.load_editor = true;
        this.show_tabs = true;
      }, 1000)

  }
  addImage(src){
      if(this.focus_editor == 'description_editor'){
        this.description_editor.editorInstance.execute("insertImage", { source: src });
      }
      if(this.focus_editor == 'lerning_obj_editor'){
        this.lerning_obj_editor.editorInstance.execute("insertImage", { source: src })
      }
      if(this.focus_editor == 'lecture_editor'){
        this.lecture_editor.editorInstance.execute("insertImage", { source: src })
      }
      if(this.focus_editor == 'highyield_editor'){
        this.highyield_editor.editorInstance.execute("insertImage", { source: src })
      }
      if(this.focus_editor == 'external_editor'){
        this.external_editor.editorInstance.execute("insertImage", { source: src })
      }
  }
  getContent() {
    let data = { url: 'create-content/' + this.content_id };
    this.http.post(data).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data']['content_data'];
        this.content_reviewer_role = data['reviewer_role'];
        this.content_parent_id = data['content_parent_id'];
        if(this.content_parent_id > 0){
            this.publish_message = "Changes will be updated to old content.";
        }
        this.content_status = data['content_status'];
        this.is_published = data['is_published'];
        this.title = data['title'];
        this.is_paid = data['is_paid'] == 1?true:false;
        this.is_draft = data['is_draft'] == 1?true:false;
        this.dataentry_uid = Number(data['dataentry_uid']);
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
        this.selected_mcqs = data['selected_mcqs'];
        this.selected_short_questions = data['selected_short_questions'];
        this.selected_cases = data['selected_cases'];
        this.selected_flash_cards = data['selected_flash_cards'];
        this.selected_teacher_materials = data['selected_teacher_materials'];
      }
    });
  }
  addVideo(tabIndex){
      if(tabIndex ==5){
        this.three_d_videos.push({pk_id:0, video_section:'3D', source: this.video_source_5, title: this['video_title_5'], value: this.video_value_5, status:'', error:false, message: ''});
        this['video_index_'+tabIndex] = undefined;
        this['video_title_'+tabIndex] = '';
        this['video_value_'+tabIndex] = '';
      }
      else{
        this.validateVideo(tabIndex);
      }
  }
  add3dObject(threed_object){
    this.three_d_videos.push({pk_id:0, video_section:'3D', source: this.video_source_5, title: this['video_title_5'], value: this.video_value_5, status:'', error:false, message: ''});
    this['video_index_5'] = undefined;
    this['video_title_5'] = '';
    this['video_value_5'] = '';
    threed_object.value = "";
  }
  validateVideo(tab_index){
    if(this['video_source_'+tab_index] != '' && this['video_title_'+tab_index] && this['video_value_'+tab_index]){
        let video_title = this['video_title_'+tab_index];
        let video_source = this['video_source_'+tab_index];
        let video_value = this['video_value_'+tab_index];
        if(video_source == 'KPOINT'){
            let kpoint = this.validateKpointId(video_value);
            if(kpoint == true){
                let param1 = {"url": "get-kpoint-token"};
                this.http.post(param1).subscribe(res=>{
                    let xt = res['data']['xt'];
                    let param = {video_id: video_value, xt:xt, url: "kapsule/"+video_value+"?xt="+xt};
                    this.http.kpointGet(param).subscribe(res=>{
                        this.addUpdateVideo(tab_index, {source: video_source, title: video_title, value: video_value});
                     },
                    error => {
                        if(error['error']['error']['code'] == 9003){
                            this['video_value_invalid_error_'+tab_index] = 'Invalid kpoint id';
                            this.toster.error("Invalid kpoint id", "Error", {closeButton: true,});
                        }
                    }
                    );
                })
            }
            else{
                this['video_value_invalid_error_'+tab_index] = 'Invalid kpoint id';
                this.toster.error("Invalid kpoint id", "Error", {closeButton: true,});
            }
        }
        if(video_source == 'YOUTUBE'){
            let youtube_check = this.validateYouTubeUrl(video_value);
            if(youtube_check){
                this.addUpdateVideo(tab_index, {source: video_source, title: video_title, value: video_value});
            }
            else{
                this['video_value_invalid_error_'+tab_index] = 'Invalid youtube url';
                this.toster.error("Invalid youtube url", "Error", {closeButton: true,});
            }
        }
    }
  }
  addUpdateVideo(tab_index, param){
    if(tab_index == 0)
    {
        if(this['video_index_'+tab_index] == undefined){
            this.intro_video.push({pk_id:0, video_section:'INTRO', source: param['source'], title: param['title'], value: param['value'], status:'', error:false, message: ''});
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video added", "Success", {closeButton: true,});
        }
        else{
            this.intro_video[this['video_index_'+tab_index]]['source'] = param['source'];
            this.intro_video[this['video_index_'+tab_index]]['title'] = param['title'];
            this.intro_video[this['video_index_'+tab_index]]['value'] = param['value'];
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video updated", "Success", {closeButton: true,});
        }
    }
    if(tab_index == 1)
    {
        if(this['video_index_'+tab_index] == undefined){
            this.two_d_videos.push({pk_id:0, video_section:'2D', source: param['source'], title: param['title'], value: param['value'], status:'', error:false, message: ''});
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video added", "Success", {closeButton: true,});
        }
        else{
            this.two_d_videos[this['video_index_'+tab_index]]['source'] = param['source'];
            this.two_d_videos[this['video_index_'+tab_index]]['title'] = param['title'];
            this.two_d_videos[this['video_index_'+tab_index]]['value'] = param['value'];
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video updated", "Success", {closeButton: true,});
        }
    }
    if(tab_index == 2)
    {
        if(this['video_index_'+tab_index] == undefined){
            this.board_lecture_videos.push({pk_id:0, video_section:'BOARD_LECTURES', source: param['source'], title: param['title'], value: param['value'], status:'', error:false, message: ''});
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video added", "Success", {closeButton: true,});
        }
        else{
            this.board_lecture_videos[this['video_index_'+tab_index]]['source'] = param['source'];
            this.board_lecture_videos[this['video_index_'+tab_index]]['title'] = param['title'];
            this.board_lecture_videos[this['video_index_'+tab_index]]['value'] = param['value'];
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video updated", "Success", {closeButton: true,});
        }
    }
    if(tab_index == 3)
    {
        if(this['video_index_'+tab_index] == undefined){
            this.clinical_videos.push({pk_id:0, video_section:'CLINICAL_ESSENTIALS', source: param['source'], title: param['title'], value: param['value'], status:'', error:false, message: ''});
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video added", "Success", {closeButton: true,});
        }
        else{
            this.clinical_videos[this['video_index_'+tab_index]]['source'] = param['source'];
            this.clinical_videos[this['video_index_'+tab_index]]['title'] = param['title'];
            this.clinical_videos[this['video_index_'+tab_index]]['value'] = param['value'];
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video updated", "Success", {closeButton: true,});
        }
    }
    if(tab_index == 4)
    {
        if(this['video_index_'+tab_index] == undefined){
            this.procedural_videos.push({pk_id:0, video_section:'PROCEDURAL', source: param['source'], title: param['title'], value: param['value'], status:'', error:false, message: ''});
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video added", "Success", {closeButton: true,});
        }
        else{
            this.procedural_videos[this['video_index_'+tab_index]]['source'] = param['source'];
            this.procedural_videos[this['video_index_'+tab_index]]['title'] = param['title'];
            this.procedural_videos[this['video_index_'+tab_index]]['value'] = param['value'];
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video updated", "Success", {closeButton: true,});
        }
    }
    if(tab_index == 5)
    {
        if(this['video_index_'+tab_index] == undefined){
            this.three_d_videos.push({pk_id:0, video_section:'3D', source: 'YOUTUBE', title: param['title'], value: param['value'], status:'', error:false, message: ''});
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video added", "Success", {closeButton: true,});
        }
        else{
            this.three_d_videos[this['video_index_'+tab_index]]['source'] = param['source'];
            this.three_d_videos[this['video_index_'+tab_index]]['title'] = param['title'];
            this.three_d_videos[this['video_index_'+tab_index]]['value'] = param['value'];
            this.resetVideo(tab_index);
            this['video_value_invalid_error_'+tab_index] = '';
            this['video_value_error_'+tab_index] = '';
            this['video_title_error_'+tab_index] = '';
            this.toster.success("Video updated", "Success", {closeButton: true,});
        }
    }
  }
    CheckTitleValue(tab_index, index){
        let videos = [];
        if(tab_index == 0){
            videos = this.intro_video;
        }
        if(tab_index == 1){
            videos = this.two_d_videos;
        }
        if(tab_index == 2){
            videos = this.board_lecture_videos;
        }
        if(tab_index == 3){
            videos = this.clinical_videos;
        }
        if(tab_index == 4){
            videos = this.procedural_videos;
        }
        if(tab_index == 5){
            videos = this.three_d_videos;
        }

        if(videos.length > 0){
            videos.forEach((res, index2)=>{
                let title = this['video_title_'+tab_index];
                let value = this['video_value_'+tab_index];
                let video_index = this['video_index_'+tab_index];
                if((res['title'].trim() == title.trim()) && res['status'] != 'delete' && video_index != index2 && index == 1){
                    this['video_title_'+tab_index] = '';
                    this['video_title_error_'+tab_index] = "Duplicate Title "+title;
                    this.toster.error("Title ("+title+") should not be duplicate", "Error", {closeButton: true,});
                }
                else{
                    this['video_title_error_'+tab_index] = '';
                }
                if((res['value'] == value) && res['status'] != 'delete' && video_index != index2 && index == 2){
                    this['video_value_'+tab_index] = '';
                    this['video_value_error_'+tab_index] = "Duplicate Value "+value;
                    this.toster.error("Value ("+value+") should not be duplicate", "Error", {closeButton: true,});
                }
                else{
                    this['video_value_error_'+tab_index] = '';
                }
            });
        }
    }
    validateKpointId(id){
        if(id.length == 40){
            return true;
        }
        else{
            return false;
        }
    }
    validateYouTubeUrl(url)
    {
        if (url != undefined || url != '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                return true;
            }
            else {
                return false;
            }
        }
    }
  upload3dObject(event){
    let allowed_types = [];
    allowed_types = ["obj"];
    const uploadData = new FormData();
    let files = event.target.files;
    if (files.length == 0) return false;
    let valid_files = [];
    for (var i = 0; i < files.length; i++) {
      let ext = files[i].name.split('.').pop().toLowerCase();
      if (allowed_types.includes(ext)) {
        let size = files[i].size;
        size = Math.round(size / 1024);
        if(size > environment.file_upload_size){
            this.toster.error(
                ext +
                  ' Size of file (' +
                  files[i].name +
                  ') is too large max allowed size 2mb', "Error", {closeButton: true,}
              );
              return false;
        }
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
      return false;
    }
    uploadData.append('path', 'documents/threed_objects');
    uploadData.append('number_files', files.length);
    let param = { url: 'upload-files' };
    this.http.imageUpload(param, uploadData).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success('Files successfully uploaded.', 'File Uploaded');
        this.video_value_5 = res['url'];
      }else{
        this.toster.error('File upload failed.', 'Error');
        this.video_value_5 = '';
      }
    });
  }
  resetVideo(tabIndex){
    this['video_index_'+tabIndex] = undefined;
    this['video_title_'+tabIndex] = '';
    this['video_source_'+tabIndex] = '';
    this['video_value_'+tabIndex] = '';
  }
  editVideo(tabIndex, index){
    this['video_index_'+tabIndex] = index;
    this['video_value_invalid_error_'+tabIndex] = '';
    if(tabIndex == 0){
        this['video_title_'+tabIndex] = this.intro_video[index]['title'];
        this['video_source_'+tabIndex] = this.intro_video[index]['source'];
        this['video_value_'+tabIndex] = this.intro_video[index]['value'];
    }
    if(tabIndex == 1){
        this['video_title_'+tabIndex] = this.two_d_videos[index]['title'];
        this['video_source_'+tabIndex] = this.two_d_videos[index]['source'];
        this['video_value_'+tabIndex] = this.two_d_videos[index]['value'];
    }
    if(tabIndex == 2){
        this['video_title_'+tabIndex] = this.board_lecture_videos[index]['title'];
        this['video_source_'+tabIndex] = this.board_lecture_videos[index]['source'];
        this['video_value_'+tabIndex] = this.board_lecture_videos[index]['value'];
    }
    if(tabIndex == 3){
        this['video_title_'+tabIndex] = this.clinical_videos[index]['title'];
        this['video_source_'+tabIndex] = this.clinical_videos[index]['source'];
        this['video_value_'+tabIndex] = this.clinical_videos[index]['value'];
    }
    if(tabIndex == 4){
        this['video_title_'+tabIndex] = this.procedural_videos[index]['title'];
        this['video_source_'+tabIndex] = this.procedural_videos[index]['source'];
        this['video_value_'+tabIndex] = this.procedural_videos[index]['value'];
    }
    if(tabIndex == 5){
        this['video_title_'+tabIndex] = this.three_d_videos[index]['title'];
        this['video_source_'+tabIndex] = this.three_d_videos[index]['source'];
        this['video_value_'+tabIndex] = this.three_d_videos[index]['value'];
    }
  }
  removeVideo(tabIndex, index){
    if(tabIndex == 0){
        this.intro_video[index]['status'] = "delete";
        //this.two_d_videos.splice(index, 1);
    }
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
  getChildDataEditor() {
    this.subscription_editor = this.http.child_data_editor.subscribe((res) => {
      if (this.library_purpose == 'editor') {
        let obj = { file_path: res['file_path'], path: res['path'] };
        this.addImage(res['path']);
        this.CloseModal();
      }
    });
  }
  editorFocused(editor_name){
      this.focus_editor = editor_name;
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
      if(this.lecture_note_title_duplicate){
          //return false;
      }
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
        this.lecture_note_obj[Number(this.lecture_note_index)]['status'] = '';
    } else {
        if(this.lecture_note_obj.length == 0){
            this.lecture_note_obj.push(lecture_note);
        }else{
            this.lecture_note_obj.forEach((res, index)=>{
            if(res['title'] == this.lecture_note_title && res['status'] != 'delete'){
                
                this.toster.error("Title has been taken", "Error", {closeButton: true,});
                return false;
            }
            if(this.lecture_note_obj.length == (index+1)){
                this.lecture_note_obj.push(lecture_note);
            }
        })
    }
        //this.lecture_note_obj.push(lecture_note);
        }
    this.lecture_note_title = '';
    this.lecture_note_content = '';
    this.lecture_note_index = '';
  }
  checkLectureNoteDuplicate(){
    this.lecture_note_obj.forEach((res, index)=>{
        if(res['title'].trim() == this.lecture_note_title.trim() && res['status'] != 'delete' && ''+index != this.lecture_note_index){
            this.lecture_note_title_duplicate = true;
            this.lecture_note_title = '';
            this.toster.error("Title has been taken", "Error" , {closeButton: true,});
            return false;
        }
        if(this.lecture_note_obj.length == (index+1)){
            this.lecture_note_title_duplicate = false;
        }
    })
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
      if(this.highyield_title_duplicate){
          //return false;
      }
    let highyield = {
      id: 0,
      title: this.highyield_title.trim(),
      content: this.highyield_content.trim(),
    };
    if (this.highyield_index != '' && this.highyield_obj[Number(this.highyield_index)] != undefined) {
      this.highyield_obj[Number(this.highyield_index)]['title'] = this.highyield_title.trim();
      this.highyield_obj[Number(this.highyield_index)]['content'] = this.highyield_content.trim();
      this.highyield_obj[Number(this.highyield_index)]['status'] = '';
    } else {
        if(this.highyield_obj.length == 0){
            this.highyield_obj.push(highyield);
        }else{
        this.highyield_obj.forEach((res, index)=>{
            if(res['title'] == this.highyield_title && res['status'] != 'delete'){
                this.toster.error("Title has been taken");
                return false;
            }
            if(this.highyield_obj.length == (index+1)){
                this.highyield_obj.push(highyield);
            }
        })
    }
      
    }
    this.highyield_title = '';
    this.highyield_content = '';
    this.highyield_index = '';
  }
  checkHighyieldDuplicate(){
    this.highyield_obj.forEach((res, index)=>{
        if(res['title'].trim() == this.highyield_title.trim() && res['status'] != 'delete' && ''+index != this.highyield_index){
            this.highyield_title_duplicate = true;
            this.highyield_title = '';
            this.toster.error("Title has been taken", "Error" , {closeButton: true,});
            return false;
        }
        if(this.highyield_obj.length == (index+1)){
            this.highyield_title_duplicate = false;
        }
    })
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
    console.log(event);
    let tab_index = event.index;
    this.question_tab = 0;
    this.short_answer_tab = 0;
    this.case_tab = 0;
    this.flashcard_tab = 0;
    this.teachermaterials_tab = 0;
    this.search_question = '';
    this.all_or_selected = 'all';
    //level filters clear
    this.curriculum_labels = [];
    this.level_options = [];
    this.all_level_options = [];
    this.selected_level = [];
    this.filter_array.level_id=0;
    this.filter_array.curriculum_id=0;
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
    if (tab_index == 7) {
      this.all_or_selected = 'all';
      let data = {
        url: 'flash-cards-list',
        limit: this.limit,
        offset: this.offset,
        all_or_selected: this.all_or_selected,
      };
      this.getFlashCardAllQuestions(data);
    }
    if(tab_index == 8){
      this.all_or_selected = 'all';
      let data = {
        url: 'get-materials-list',
        limit: this.limit,
        offset: this.offset,
        all_or_selected: this.all_or_selected,
      };
      this.getTeacherMaterialAllQuestions(data);
    }
  }

  questionsTab(tab) {
    let tab_index = tab.index;
    this.search_question = '';
    //level filters clear
    this.level_options = [];
    this.all_level_options = [];
    this.selected_level = [];
    this.filter_array.level_id=0;
    this.filter_array.curriculum_id=0;
    this.curriculum_labels = [];
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
      this.loading_questions=true;
      this.all_questions = new MatTableDataSource([]);
    this.resetPagination();
    this.http.post(param).subscribe((res) => {
        this.loading_questions=false;
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
    let param = {
      url: 'questions-list',
      type: this.active_tab_type,
      offset: this.page,
      limit: this.limit,
      search: this.search_question,
      all_or_selected: this.all_or_selected,
      question_ids: question_ids,
      curriculum_id: this.filter_array.curriculum_id,
      level_id: this.filter_array.level_id
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

  /* Added by Phanindra */
  flashCardTab(tab){
    let tab_index = tab.index;
    this.search_question = '';
    //level filters clear
    this.level_options = [];
    this.all_level_options = [];
    this.selected_level = [];
    this.filter_array.level_id=0;
    this.filter_array.curriculum_id=0;
    this.curriculum_labels = [];
    if (tab_index == 0) {
      this.all_or_selected = 'all';
      let data = {
        url: 'flash-cards-list',
        limit: this.limit,
        offset: this.offset,
        all_or_selected: this.all_or_selected,
      };
      this.getFlashCardAllQuestions(data);
    }
    if (tab_index == 1) {
      let question_ids = [];
      question_ids = this.selected_flash_cards;
      this.all_or_selected = 'selected';
      let data = {
        url: 'flash-cards-list',
        limit: this.limit,
        offset: this.offset,
        all_or_selected: this.all_or_selected,
        question_ids: question_ids,
      };
      if (question_ids.length > 0) {
        this.getFlashCardAllQuestions(data);
      } else {
        this.flash_card_all_questions = new MatTableDataSource([]);
      }
    }
  }
  getFlashCardAllQuestions(param){
    this.loading_questions=true;
    this.flash_card_all_questions = new MatTableDataSource([]);
    this.resetPagination();
    this.http.post(param).subscribe((res) => {
      this.loading_questions=false;
      if (res['error'] == false) {
        this.flash_card_all_questions = new MatTableDataSource(
          res['data']['question_list']
        );
        this.totalSize = res['total_records'];

        this.flash_card_all_questions.paginator = this.paginator;
      } else {
        this.flash_card_all_questions = new MatTableDataSource([]);
      }
    });
  }
  searchFlashCardQuestions(){
    this.resetPagination();
    let question_ids = [];
    question_ids = this.selected_flash_cards;
    let param = {
      url: 'flash-cards-list',
      offset: this.page,
      limit: this.limit,
      search: this.search_question,
      all_or_selected: this.all_or_selected,
      question_ids: question_ids,
      curriculum_id: this.filter_array.curriculum_id,
      level_id: this.filter_array.level_id
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.flash_card_all_questions = new MatTableDataSource(
          res['data']['question_list']
        );
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.flash_card_all_questions = new MatTableDataSource([]);
      }
    });
  }
  selectFlashCardQuestion(event, id) {
    id = '' + id;
    if (event['checked'] == true) {
      this.selected_flash_cards.push(id);
    } else {
      const index = this.selected_flash_cards.indexOf(id);
      if (index > -1) {
        this.selected_flash_cards.splice(index, 1);
      }
    }    
  }
  public getFlashCardServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let question_ids = [];
    question_ids = this.selected_flash_cards;
    let param = {
      url: 'flash-cards-list',
      offset: this.page,
      limit: event.pageSize,
      search: this.search_question,
      all_or_selected: this.all_or_selected,
      question_ids: question_ids,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.flash_card_all_questions = new MatTableDataSource(
          res['data']['question_list']
        );
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.flash_card_all_questions = new MatTableDataSource([]);
      }
    });
  }

  teacherMaterialTab(tab){
    console.log(tab);
    let tab_index = tab.index;
    this.search_question = '';
    //level filters clear
    this.level_options = [];
    this.all_level_options = [];
    this.selected_level = [];
    this.filter_array.level_id=0;
    this.filter_array.curriculum_id=0;
    this.curriculum_labels = [];
    if (tab_index == 0) {
      this.all_or_selected = 'all';
      let data = {
        url: 'get-materials-list',
        limit: this.limit,
        offset: this.offset,
        all_or_selected: this.all_or_selected,
      };
      this.getTeacherMaterialAllQuestions(data);
    }
    if (tab_index == 1) {
      let question_ids = [];
      question_ids = this.selected_teacher_materials;
      this.all_or_selected = 'selected';
      let data = {
        url: 'get-materials-list',
        limit: this.limit,
        offset: this.offset,
        all_or_selected: this.all_or_selected,
        question_ids: question_ids,
      };
      if (question_ids.length > 0) {
        this.getTeacherMaterialAllQuestions(data);
      } else {
        this.teacher_materials_all_questions = new MatTableDataSource([]);
      }
    }
  }
  getTeacherMaterialAllQuestions(param){
    this.loading_questions=true;
    this.teacher_materials_all_questions = new MatTableDataSource([]);
    this.resetPagination();
    this.http.post(param).subscribe((res) => {
      this.loading_questions=false;
      if (res['error'] == false) {
        this.teacher_materials_all_questions = new MatTableDataSource(
          res['data']['materials_list']
        );
        this.totalSize = res['total_records'];

        this.teacher_materials_all_questions.paginator = this.paginator;
      } else {
        this.teacher_materials_all_questions = new MatTableDataSource([]);
      }
    });
  }
  searchteacherMaterialQuestions(){
    this.resetPagination();
    let question_ids = [];
    question_ids = this.selected_teacher_materials;
    let param = {
      url: 'get-materials-list',
      offset: this.page,
      limit: this.limit,
      search: this.search_question,
      all_or_selected: this.all_or_selected,
      question_ids: question_ids,
      curriculum_id: this.filter_array.curriculum_id,
      level_id: this.filter_array.level_id
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.teacher_materials_all_questions = new MatTableDataSource(
          res['data']['materials_list']
        );
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.teacher_materials_all_questions = new MatTableDataSource([]);
      }
    });
  }
  selectTeacherMaterialQuestion(event, id) {
    id = '' + id;
    if (event['checked'] == true) {
      this.selected_teacher_materials.push(id);
    } else {
      const index = this.selected_teacher_materials.indexOf(id);
      if (index > -1) {
        this.selected_teacher_materials.splice(index, 1);
      }
    }    
  }
  public getTeacherMaterialServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let question_ids = [];
    question_ids = this.selected_teacher_materials;
    let param = {
      url: 'get-materials-list',
      offset: this.page,
      limit: event.pageSize,
      search: this.search_question,
      all_or_selected: this.all_or_selected,
      question_ids: question_ids,
    };
    console.log(param);
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.teacher_materials_all_questions = new MatTableDataSource(
          res['data']['materials_list']
        );
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.teacher_materials_all_questions = new MatTableDataSource([]);
      }
    });
  }

  public curriculum_list = [];
  public curriculum_labels = [];
  public level_options = [];
  public all_level_options = [];
  public selected_level = [];
  public filter_array = {question_flag:'', question_usage:0, question_bank:'', curriculum_id:0, level_id:0};
  getLabels(tabName){
    if(tabName == 'flashCardTab'){
      this.searchFlashCardQuestions();
    }else if(tabName == 'teacherMaterialTab'){
      this.searchteacherMaterialQuestions();
    }else{
      this.searchQuestions();
    }    
    this.level_options = [];
    this.all_level_options = [];
    this.selected_level = [];
    this.filter_array.level_id=0;
    let param = {
        url: 'get-curriculum-labels',
        curriculum_id: this.filter_array.curriculum_id,
    };
    this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
            //this.applyFilters();
        let data = res['data'];
        this.level_options[1] = data['level_1'];
        this.all_level_options[1] = data['level_1'];
        this.curriculum_labels = data['curriculum_labels'];
            if(this.curriculum_labels.length == 0){
                this.level_options = [];
                this.all_level_options = [];
                this.selected_level = [];
            }
        }
    });
}
ucFirst(string) {
    return this.http.ucFirst(string);
}
getLevels(level_id,tabName) {
    this.filter_array.level_id = this.selected_level[level_id];
    if(tabName == 'flashCardTab'){
      this.searchFlashCardQuestions();
    }else if(tabName == 'teacherMaterialTab'){
      this.searchteacherMaterialQuestions();
    }else{
      this.searchQuestions();
    }
    let param = {
    url: 'get-levels-by-level',
    step_id: this.selected_level[level_id],
    };
    this.http.post(param).subscribe((res) => {
    if (res['error'] == false) {
        let data = res['data'];
        this.level_options[level_id + 1] = data['steps'];
        this.all_level_options[level_id + 1] = data['steps'];
        this.level_options.forEach((opt, index) => {
        if (index > level_id + 1) this.level_options[index] = [];
        });
        this.selected_level.forEach((opt, index) => {
            if (index > level_id) this.selected_level[index] = 0;
        });
    }
    });
}
searchLevelByName(search,level){
    let options = this.all_level_options[level];
    this.level_options[level] = options.filter(
        item => item.level_name.toLowerCase().includes(search.toLowerCase())
    );
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
  CloseSchdulePublish(){
      this.schdule_publish = false;
  }
  createContent(is_draft) {
    this.is_submit = true;
    if(this.title == ''){
        return false;
    }
    let form_data = {
      title: this.title,
      is_paid:this.is_paid == true?1:0,
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
      selected_flash_cards: this.selected_flash_cards,
      selected_teacher_materials: this.selected_teacher_materials,
      is_draft: is_draft,
      content_id: this.content_id,
      reviewer_role: is_draft?'':this.reviewer_role,
      publsh_content: this.publsh_content,
      publish_date: this.publish_date,
      publish_time: this.publish_time,
      is_preview: this.is_preview
    };
    let params = { url: 'create-content', form_data: form_data };

    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {

          if(this.is_preview == true){
              this.is_preview = false;
              if(this.content_id == 0){
                this.navigateTo("create-content/"+res['data']['id']);
              }
              else{
                  setTimeout(timeout=>{window.location.reload();},1000)
              }
              window.open('student/content-preview/'+res['data']['id'], "_blank");
          }
          else{
              this.is_preview = false;
            this.toster.success(res['message'], 'Success', { closeButton: true });
            if(res['data']['content_status'] == "REVIEW"){
                let doc = {
                    "role_id" : res['data']['reviewer_role'],
                    "first_name" : res['data']['first_name'],
                    "order_by" : res['data']['order_by'],
                    "content_id" : res['data']['id']
                }
                let param = {path: "content_notifications", content_id: ''+res['data']['id'], data:doc};
                this.fs.addNotification(param);
            }
            if(res['data']['content_status'] == "PUBLISHED"){
                let content_id = this.content_id>0?this.content_id:res['data']['id'];
                this.fs.deleteNotification({path: "content_notifications/"+content_id});
            }
            setTimeout(res=>{
                this.navigateTo('manage-content');
            }, 1000);
          }
      } else {
          this.publsh_content = false;
          this.is_preview = false
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
    allowed_types = ['doc', 'docx', 'pdf', 'odt', 'xls', 'xlsx', 'ppt', 'csv','jpg', 'jpeg', 'bmp', 'gif', 'png'];
    const uploadData = new FormData();
    let files = event.target.files;
    if (files.length == 0) return false;
    let valid_files = [];
    for (var i = 0; i < files.length; i++) {
      let ext = files[i].name.split('.').pop().toLowerCase();
      if (allowed_types.includes(ext)) {
        let size = files[i].size;
        size = Math.round(size / 1024);
        if(size > environment.file_upload_size){
            this.toster.error(
                ext +
                  ' Size of file (' +
                  files[i].name +
                  ') is too large max allowed size 2mb', "Error", {closeButton: true,}
              );
        }
        else{
            valid_files.push(files[i]);
            uploadData.append('file' + i, files[i]);
        }
      } else {
        this.toster.error(
          ext +
            ' Extension not allowed file (' +
            files[i].name +
            ') not uploaded', "Error", {closeButton: true,}
        );
      }
    }
    if (valid_files.length == 0) {
      return false;
    }
    uploadData.append('path', 'documents/review_docs');
    uploadData.append('number_files', files.length);
    let param = { url: 'upload-files' };
    this.http.imageUpload(param, uploadData).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success('Files successfully uploaded.', 'File Uploaded');
      }
      this.allow_coment = true;
      res['urls'].forEach(url => {
        this.review_docs.push(url);
      });
      
    });
  }
  getPreview(file){
      let path = '';
      if(['jpg', 'jpeg', 'bmp', 'gif', 'png'].includes(file.split('.').pop().toLowerCase())){
          return this.bucket_url+file;
      }
      else{
          return "../../../assets/images/"+file.split('.').pop().toLowerCase()+".png";
      }
    
  }
  removeReviewDocument(index){
    if (index > -1) {
      this.review_docs.splice(index, 1);
    }
  }
  addComent(){
    let param = {
        url: 'add-content-comment',
        content_id : this.content_id,
        comment: this.comments_content.trim()==''?"Please find attachments.":this.comments_content,
        review_docs: this.review_docs
    };
    this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.older_coments = res['data']['comments'];
        this.review_docs = res['data']['review_docs'];
        this.comments_content = '';
        this.allow_coment = false;
        } else {
        this.toster.error(res['message'], res['message'], {
            closeButton: true,
        });
        }
    });
  }
  navigateTo(url){
    let user = this.user;
    if (Object.values(environment.ALL_ADMIN_SPECIFIC_ROLES).indexOf(Number(user['role'])) > -1) {
      url = "/admin/"+url;
    }
    if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
      url = "/reviewer/"+url;
  }
    this.router.navigateByUrl(url);
}
getNavigateTo(url){
    let user = this.user;
    if (Object.values(environment.ALL_ADMIN_SPECIFIC_ROLES).indexOf(Number(user['role'])) > -1) {
      url = "/admin/"+url;
    }
    if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
      url = "/reviewer/"+url;
  }
    return url;
}
    publishContent(){
        this.publsh_content = true;
        this.createContent(false);
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
    savePreview(){
        this.is_preview = true;
        this.createContent(false);
    }
}
