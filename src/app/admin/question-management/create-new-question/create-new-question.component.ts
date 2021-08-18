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
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

interface CurriculumNode {
  id?: number;
  name: string;
  curriculum_id?: number;
  selected?: boolean;
  indeterminate?: boolean;
  parentid?: number;
  is_curriculum_root?: boolean;
  children?: CurriculumNode[];
  has_children?: boolean;
  ok?: boolean;
}
@Component({
  selector: 'app-create-new-question',
  templateUrl: './create-new-question.component.html',
  styleUrls: ['./create-new-question.component.scss']
})


export class CreateNewQuestionComponent implements OnInit {
public video_types = environment.video_types;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('documents') documents_input: ElementRef;
    //Code starts here for course selection
    treeControl = new NestedTreeControl<CurriculumNode>(node => node.children);
    dataSource1 = new MatTreeNestedDataSource<CurriculumNode>();
  page_size_options = environment.page_size_options;

  public Editor = Editor;
  public question_Qbank = false;
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

  is_loaded = true;
  imageSrc = {};
  QTypes: any;
  QBanks: any;
  question = {
    curriculum_id:'',
    question_type_id: '',
    q_bank_ids: [],
    question_text: '',
    topic: '',
    q_source: "",
    question_flag:'',
    q_source_value: null,
    difficulty_level_id: 1,
    questionUsageType: 1,
    explanation: '',
    option1: null,
    option2: null,
    option3: null,
    option4: null,
    correct_ans_ids: [],
    q_check_type: null,
    option_array : [1,2,3,4]
  }
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
  public curriculums = [];
  public topics: ReplaySubject<any> = new ReplaySubject<any>(1);
  opt1FileName = '';
  opt2FileName = '';
  opt3FileName = '';
  opt4FileName = '';
  file = '';
  fileName = '';

  myFiles = [];
    opt5FileName: any;
    opt6FileName: any;
    opt7FileName: any;
    opt8FileName: any;
    user = [];
  
  constructor(private http: CommonService,
    private toster: ToastrService,
    private router: Router,
  ) { }

  hasChild = (_: number, node: CurriculumNode) =>
  !!node.children && node.children.length > 0;
  qtype: any;
  ngOnInit(): void {
    this.user = this.http.getUser();
    this.getQTypes()
    this.getQBanks()
    this.changeQUsageType(1)
  }

  getQLists() {
    let param = { url: 'qbank' };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['qbanks']);
        this.is_loaded = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
    this.question.correct_ans_ids = [];
    this.question.q_check_type = null;
    let qtype = this.QTypes.find(i => i.id === e.value)['question_type'];
    
    
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
        this.question.q_check_type = 'audio'
        break;
      case 'Audio Clip with Multiple Options Selection':
        this.audio_multiple_option = true;
        this.question.q_check_type = 'audio'
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
        this.question.q_check_type = 'image'
        break;
      case 'Image with Multiple Options Selection':
        this.image_multiple_option = true;
        this.question.q_check_type = 'image'
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
      if(this.single_option || this.vidio_single_option || this.audio_single_option || this.image_single_option){
        this.question.correct_ans_ids = [];
      }
    if (e.source.checked) {
      this.question.correct_ans_ids.push(e.source.value);console.log(this.question.correct_ans_ids)
    }
    if (!e.source.checked) {
      var index = this.question.correct_ans_ids.indexOf(e.source.value);
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
      allowed_types = ['mp3']
    }

    let files = event.target.files;
    for (var i = 0; i < event.target.files.length; i++) {
      let ext = files[i].name.split('.').pop().toLowerCase();
      if (allowed_types.includes(ext)) {
        let size = files[i].size;
        size = Math.round(size / 1024);
        if(size > environment.file_upload_size){
            this.toster.error(
                ext +
                  ' Size of file (' +
                  files[i].name +
                  ') is too large max allowed size 2mb'
              );
              return false;
        }
        let fileId = event.target.id;
        let fileName = event.target.files[i]['name'];
        const reader = new FileReader();
        reader.readAsDataURL(files[0]); 
        reader.onload = (event) => { 
            this.imageSrc[fileId] = reader.result;
        }
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
            case 'opt5Img':
            this.opt5FileName = fileName;
            this.myFiles['opt5Img'] = event.target.files[i];
            break;
            case 'opt6Img':
            this.opt6FileName = fileName;
            this.myFiles['opt6Img'] = event.target.files[i];
            break;
            case 'opt7Img':
            this.opt7FileName = fileName;
            this.myFiles['opt7Img'] = event.target.files[i];
            break;
            case 'opt8Img':
            this.opt8FileName = fileName;
            this.myFiles['opt8Img'] = event.target.files[i];
            break;

          default:
            console.log("No such file exists!");
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
  addOption(index){
    this.question.option_array.push(this.question.option_array.length);
  }
  removeOption(index){
    this.question.option_array.splice(index, 1);
    this.question['option'+(index+1)] = '';
    this['opt'+(index+1)+'FileName'] = '';
    console.log(this.question.correct_ans_ids, "before");
    index = this.question.correct_ans_ids.indexOf(index+1);
    console.log(index, "index")
    if(index >= 0){
        this.question.correct_ans_ids.splice(index, 1);
        console.log(this.question.correct_ans_ids, 'after')
    }
  }
  createQList() {
    if(this.question_Qbank && this.question.q_bank_ids.length == 0){
        this.toster.error("Please select Question bank(s)", "Error", {closeButton: true});
        return false;
    }
      if(this.question.correct_ans_ids.length == 0 && (this.free_text == false && this.audio_clip_free_text  == false && this.video_clicp_free_text == false && this.image_free_text == false)){
          this.toster.error("Please select correct answer", "Error", {closeButton: true});
          return false;
      }
    let filesData = this.myFiles;
    const formData = new FormData();

    if (Object.keys(filesData).length > 0) {
      Object.keys(filesData).map(function (key) {
        formData.append(key, filesData[key]);
      });
    }
    var details = JSON.stringify(this.question);
    formData.append('details', details);
    //formData.append("option_array", JSON.stringify(this.option_array))
    let param = { url: 'qlists/create' };
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
  public openFileExplor(id){
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
