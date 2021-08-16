import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { environment } from 'src/environments/environment';
import * as Editor from '../../../../assets/ckeditor5/build/ckeditor';
import { UploadAdapter } from '../../../classes/UploadAdapter';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { count } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-edit-new-question',
  templateUrl: './edit-new-question.component.html',
  styleUrls: ['./edit-new-question.component.scss']
})
export class EditNewQuestionComponent implements OnInit {
    public video_types = environment.video_types;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('documents') documents_input: ElementRef;
  page_size_options = environment.page_size_options;

  public Editor = Editor;

  configEditor = {
    Plugins: [],
    placeholder: 'Enter Text',
    toolbar: {
      items: ['Alignment', 'FontColor', 'FontBackgroundColor', 'FontSize', 'underline', 'blockQuote', 'bulletedList', 'numberedList', 'SpecialCharacters'],
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


  is_loaded = true
  question_id = null;
  public question_Qbank = false;
  QTypes: any;
  QBanks: any;
  question: any = {
    questionUsageType:'',
    curriculum_id:0,
    question_type_id: '',
    q_bank_ids: [],
    question_text: '',
    topic: '',
    q_source: null,
    q_source_value: null,
    difficulty_level_id: '',
    explanation: '',
    option1: null,
    option2: null,
    option3: null,
    option4: null,

    option1_crt_ans: '',
    option2_crt_ans: '',
    option3_crt_ans: '',
    option4_crt_ans: '',
    single_crt_ans: '',
    option1_value: '',
    option2_value: '',
    option3_value: '',
    option4_value: '',



    correct_ans_ids: [],
    option_array : []
  }
  q_type = '';
  public current_path = 'qlist';

  single_option = false;
  multiple_option = false;
  free_text = false;
  audio_single_option = false;
  audio_multiple_option = false;
  vidio_single_option = false;
  video_multiple_option = false;
  image_single_option = false;
  image_multiple_option = false;
  audio_clip_free_text = false;
  video_clicp_free_text = false;
  image_free_text = false;

  opt1FileName = '';
  opt2FileName = '';
  opt3FileName = '';
  opt4FileName = '';
  file = '';
  fileName = '';

  myFiles = [];
    curriculums: any;
    public topics: ReplaySubject<any> = new ReplaySubject<any>(1);
    opt5FileName: any;
    opt6FileName: any;
    opt7FileName: any;
    opt8FileName: any;
    user = [];
  constructor(private http: CommonService,private router: Router,
    private toster: ToastrService,
    private activeRoute: ActivatedRoute,
  ) { }
  qtype: any;
  ngOnInit(): void {
    this.user = this.http.getUser();
    this.getQTypes()
    this.getQBanks()
    this.activeRoute.params.subscribe((routeParams) => {
      this.question_id = routeParams.id;
      this.getQuestion()
    });

  }

  getQuestion() {
    let param = {
      url: 'qlists/show/' + this.question_id,
    };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
      
        let options = res['q_options'];
        let questionData = res['question'];
        this.question.curriculum_id = Number(questionData['curriculum_id']);
        if(this.question.curriculum_id > 0){
            this.getTopics(this.question.curriculum_id, '');
        }
        this.question.questionUsageType = Number(questionData['question_for']);
        if(this.question.questionUsageType == 3){
            this.question_Qbank = true;
        }
        if(questionData.q_bank_ids){
            this.question.q_bank_ids = Array.from(questionData.q_bank_ids.split(","), Number);
        }
        else{
            this.question.q_bank_ids = [];
        }
        this.question.question_text = questionData.question_text;
        this.question.topic = questionData.topic;
        this.question.explanation = questionData.explanation;
        this.question.question_type_id = res['q_type']['pk_id'];
        this.question.difficulty_level_id = questionData.difficulty_level_id;
        var correct_ans_ids_string = questionData.correct_ans_id+'';
        let correct_ans_ids = [];
        if(correct_ans_ids_string.includes(',')){
            correct_ans_ids = correct_ans_ids_string.split(",").map(Number);
        }
        else{
            correct_ans_ids.push(Number(correct_ans_ids_string));
        }
        this.question.correct_ans_ids = correct_ans_ids;
        this.question.q_source = questionData.q_source;
        this.question.q_source_value = questionData.q_source_value;
        for(let i=1;i<=options.length; i++){
            this.question.option_array.push(i);
        }
        if (options.length > 0) {
            console.log(correct_ans_ids);
          for (var i = 0; options.length > i; i++) {
            switch (i) {
              case 0:
                  if(correct_ans_ids.includes(options[i]['pk_id'])){
                    this.question.option1_crt_ans = 'checked';
                    
                  }
                  this.question.option1_value = options[i]['pk_id'];
                this.opt1FileName = options[i]['option_image'];
                this.question.option1 = options[i]['option_text'];
                break;
              case 1:
                if(correct_ans_ids.includes(options[i]['pk_id'])){
                    this.question.option2_crt_ans = 'checked';
                    
                  }
                  this.opt2FileName = options[i]['option_image'];
                  this.question.option2_value = options[i]['pk_id'];
                this.question.option2 = options[i]['option_text'];
                break;
              case 2:
                if(correct_ans_ids.includes(options[i]['pk_id'])){
                    this.question.option3_crt_ans = 'checked';
                  }
                this.opt3FileName = options[i]['option_image'];
                this.question.option3_value = options[i]['pk_id'];
                this.question.option3 = options[i]['option_text'];
                break;
              case 3:
                if(correct_ans_ids.includes(options[i]['pk_id'])){
                    this.question.option4_crt_ans = 'checked';
                }
                this.opt4FileName = options[i]['option_image'];
                  this.question.option4_value = options[i]['pk_id'];
                this.question.option4 = options[i]['option_text'];
                break;
                case 4:
                if(correct_ans_ids.includes(options[i]['pk_id'])){
                    this.question.option5_crt_ans = 'checked';
                }
                this.opt5FileName = options[i]['option_image'];
                  this.question.option5_value = options[i]['pk_id'];
                this.question.option5 = options[i]['option_text'];
                break;
                case 5:
                if(correct_ans_ids.includes(options[i]['pk_id'])){
                    this.question.option6_crt_ans = 'checked';
                }
                this.opt6FileName = options[i]['option_image'];
                  this.question.option6_value = options[i]['pk_id'];
                this.question.option6 = options[i]['option_text'];
                break;
                case 6:
                if(correct_ans_ids.includes(options[i]['pk_id'])){
                    this.question.option7_crt_ans = 'checked';
                }
                this.opt7FileName = options[i]['option_image'];
                  this.question.option7_value = options[i]['pk_id'];
                this.question.option7 = options[i]['option_text'];
                break;
                case 7:
                if(correct_ans_ids.includes(options[i]['pk_id'])){
                    this.question.option8_crt_ans = 'checked';
                }
                this.opt8FileName = options[i]['option_image'];
                  this.question.option8_value = options[i]['pk_id'];
                this.question.option8 = options[i]['option_text'];
                break;
              default:
                console.log("No such type exists!");
                break;

            }
          }
        }
        let qtype = res['q_type']['question_type'];
        switch (qtype) {
            
          case 'Single Option Selection':
            this.single_option = true;
            this.question.single_crt_ans = correct_ans_ids_string;
            break;
          case 'Multiple Options Selection':
            this.multiple_option = true;
            break;
        case 'Freetype Text Input':
            this.free_text = true;
            break;
          case 'Audio Clip with Single Option Selection':
            this.fileName = questionData['q_source_value'];
            this.question.single_crt_ans = correct_ans_ids_string;
            this.audio_single_option = true;
            break;
          case 'Audio Clip with Multiple Options Selection':
            this.audio_multiple_option = true;
            this.fileName = questionData['q_source_value'];
            break;
          case 'Audio Clip with Freetype Text Input':
            this.audio_clip_free_text = true;
            break;
          case 'Video Clip with Single Option Selection':
            this.question.single_crt_ans = correct_ans_ids_string;
            this.vidio_single_option = true;
            break;
          case 'Video Clip with Multiple Options Selection':
            this.video_multiple_option = true;
            break;

          case 'Video Clip with Freetype Text Input':
            this.video_clicp_free_text = true;
            break;
          case 'Image with Single Option Selection':
            this.question.single_crt_ans = correct_ans_ids_string;
            this.fileName = questionData['q_source_value'];
            this.image_single_option = true;
            break;
          case 'Image with Multiple Options Selection':
            this.fileName = questionData['q_source_value'];
            this.image_multiple_option = true;
            break;
          case 'Image with Freetype Text Input':
            this.image_free_text = true;
            break;
          default:
            console.log("No such type exists!");
            break;
        }
      }
    });
  }


  getQLists() {
    let param = { url: 'qbank' };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['qbanks']);
        if (this.is_loaded == true || true) {
          this.is_loaded = false;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }


  getQTypes() {
    this.QTypes = [];
    let params = {
      url: 'qlists/types',

    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.QTypes = res['data']['qtypes'];
        this.curriculums = res['data']['curriculums_list'];
      }
    });

  }
  getTopics(curriculum_id, search){
    let params = {
        url: 'get-topics-by-curriculum',
        curriculum_id: curriculum_id,
        search: search
      };
     this.http.post(params).subscribe((res) => {
        if (res['error'] == false) {
            //this.topics.next([]);
            if(res['data']['topics'].length > 0)
                this.topics.next(res['data']['topics'].slice());
                else
                this.topics.next([]);
        }
      });
  }
  getQBanks() {
    this.QTypes = [];
    let params = {
      url: 'qlists/banks',

    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.QBanks = res['data']['qbanks'];
      }
    });

  }

  changeQType(e) {
   
    this.single_option = false;
    this.multiple_option = false;
    this.free_text = false;
    this.audio_single_option = false;
    this.audio_multiple_option = false;
    this.vidio_single_option = false;
    this.video_multiple_option = false;
    this.image_single_option = false;
    this.image_multiple_option = false;
    this.audio_clip_free_text = false;
    this.video_clicp_free_text = false;
    this.image_free_text = false;
  
    let qtype = e.value.question_type;
    this.question.question_type_id = e.value.id
    // this.question.question_type_id = e.value.id;
    switch (qtype) {
      case 'Single Option Selection':
        this.single_option = true;
        break;
      case 'Multiple Options Selection':
        this.multiple_option = true;
        break;
        case 'Freetype Text Input':
        this.free_text = true;
        break;
      case 'Audio Clip with Single Option Selection':
        this.audio_single_option = true;
        break;
      case 'Audio Clip with Multiple Options Selection':
        this.audio_multiple_option = true;
        break;
      case 'Audio Clip with Freetype Text Input':
        this.audio_clip_free_text = true;
        break;
      case 'Video Clip with Single Option Selection':
        this.vidio_single_option = true;
        break;
      case 'Video Clip with Multiple Options Selection':
        this.video_multiple_option = true;
        break;

      case 'Video Clip with Freetype Text Input':
        this.video_clicp_free_text = true;
        break;
      case 'Image with Single Option Selection':
        this.image_single_option = true;
        break;
      case 'Image with Multiple Options Selection':
        this.image_multiple_option = true;
        break;
      case 'Image with Freetype Text Input':
        this.image_free_text = true;
        break;
      default:
        console.log("No such type exists!");
        break;
    }

  }


  onCorrectAnsChange(e) {
      console.log(e.source.value)
      if((this.single_option || this.audio_single_option || this.vidio_single_option || this.image_single_option) && (e.source.value)){
        this.question.correct_ans_ids = [];
      }
    if (e.source.checked) {
      this.question.correct_ans_ids.push(e.source.value)
    }
    if (!e.source.checked) {
      var index = parseInt(this.question.correct_ans_ids.indexOf(e.source.value));
      if (index !== -1) {
        this.question.correct_ans_ids.splice(index, 1);
      }
    }
  
  }

  onFileChange(event) {
    let allowed_types = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];
    if (this.image_single_option || this.image_multiple_option || this.image_free_text) {
      allowed_types = [
        'jpg', 'jpeg', 'bmp', 'gif', 'png'
      ];
    }
    if (this.audio_single_option || this.audio_multiple_option || this.audio_clip_free_text || this.video_clicp_free_text) {
      allowed_types = ['mp3', 'mp4', 'weba']
    }


    let files = event.target.files;
    for (var i = 0; i < event.target.files.length; i++) {
      let ext = files[i].name.split('.').pop().toLowerCase();
      if (allowed_types.includes(ext)) {
        let fileId = event.target.id;
        let fileName = event.target.files[i]['name'];
        switch (fileId) {
          case 'file':
            this.myFiles.splice(this.myFiles.indexOf("file"), 1);
            this.fileName = fileName;
            this.myFiles['file'] = event.target.files[i];
            break;
          case 'opt1Img':
            this.myFiles.splice(this.myFiles.indexOf("file"), 1);
            this.opt1FileName = fileName;
            this.myFiles['opt1Img'] = event.target.files[i];
            break;
          case 'opt2Img':
            this.opt2FileName = fileName;
            this.myFiles['opt2Img'] = event.target.files[i];
            break;
          case 'opt3Img':
            this.opt3FileName = fileName;
            this.myFiles['opt3Img'] = event.target.files[i];
            break;
          case 'opt4Img':
            this.opt4FileName = fileName;
            this.myFiles['opt4Img'] = event.target.files[i];
            break;

          default:
            console.log("No such type exists!");
            break;
        }


      } else {
        this.toster.error(
          ext +
          ' Extension not allowed file (' +
          files[i].name +
          ') not uploaded'
        );
      }

    }

  }

  updateQList(q_data) {
      if(this.question_Qbank && this.question.q_bank_ids.length == 0){
        this.toster.error("Please select Question bank(s)", "Error", {closeButton: true});
          return false;
      }
    q_data = q_data.value;
    let filesData = this.myFiles;
    const formData = new FormData();
    if (Object.keys(filesData).length > 0) {
      Object.keys(filesData).map(function (key) {
        formData.append(key, filesData[key]);
      });
    }

    if(this.question.single_crt_ans){
      this.question.correct_ans_ids[0] = this.question.single_crt_ans
    }
    var details = JSON.stringify(this.question);
    formData.append('details', details);

    let param = { url: "qlists/update/"+this.question_id };
    this.http.imageUpload(param, formData).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        window.history.back()
       }else{
        let message = res['errors']['topic']
        ? res['errors']['topic']
        : res['errors'];
      this.toster.error(message, 'Error', { closeButton: true });
       }
    });

  }
  public changeQUsageType(val){
    this.question_Qbank = false;
    if(val == 3){
      this.question_Qbank = true;
    }
    else{
        this.question.q_bank_ids = []
    }
  }
  public openFileExplor(id){console.log(id)
    document.getElementById('opt'+id+'Img').click();
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
validateVideo(){
    if(this.question.q_source_value != '' && this.question.q_source == 'KPOINT'){
        this.validateKpointId(this.question.q_source_value);
    }
    if(this.question.q_source_value != '' && this.question.q_source == 'YOUTUBE'){
        this.validateYouTubeUrl(this.question.q_source_value);
    }
}
validateKpointId(id){
    if(id.length == 40){
        let param1 = {"url": "get-kpoint-token"};
        this.http.post(param1).subscribe(res=>{
            let xt = res['data']['xt'];
            let param = {video_id: id, xt:xt, url: "kapsule/"+id+"?xt="+xt};
            this.http.kpointGet(param).subscribe(res=>{
                },
            error => {
                if(error['error']['error']['code'] == 9003){
                    this.question.q_source_value = '';
                    this.toster.error("Invalid kpoint id", "Error", {closeButton: true,});
                }
                if(error['error']['error']['code'] == 9001){
                    this.question.q_source_value = '';
                    this.toster.error("Invalid kpoint id", "Error", {closeButton: true,});
                }
            }
            );
        })
    }
    else{
        this.question.q_source_value = '';
        this.toster.error("Invalid kpoint id", "Error", {closeButton: true,});
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
                this.question.q_source_value = '';
                this.toster.error("Invalid Youtube Url", "Error", {closeButton: true,});
            }
        }
    }
}
