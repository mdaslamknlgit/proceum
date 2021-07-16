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
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('documents') documents_input: ElementRef;
    //Code starts here for course selection
    treeControl = new NestedTreeControl<CurriculumNode>(node => node.children);
    dataSource1 = new MatTreeNestedDataSource<CurriculumNode>();
  page_size_options = environment.page_size_options;

  public Editor = Editor;
  configEditor = {
    Plugins: [],
    placeholder: 'Provide Text',
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

  is_loaded = true

  QTypes: any;
  QBanks: any;
  question = {
    question_type_id: '',
    q_bank_ids: [],
    question_text: '',
    topic: '',
    q_source: "",
    q_source_value: null,
    difficulty_level_id: 1,
    explanation: '',
    option1: null,
    option2: null,
    option3: null,
    option4: null,
    correct_ans_ids: [],
    q_check_type: null

  }

  single_option = false;
  multiple_option = false;
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

  constructor(private http: CommonService,
    private toster: ToastrService
  ) { }

  hasChild = (_: number, node: CurriculumNode) =>
  !!node.children && node.children.length > 0;
  qtype: any;
  ngOnInit(): void {
    this.getQTypes()
    this.getQBanks()
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
    this.audio_single_option = false;
    this.audio_multiple_option = false;
    this.vidio_single_option = false;
    this.video_multiple_option = false;
    this.image_single_option = false;
    this.image_multiple_option = false;
    this.audio_clip_free_text = false;
    this.video_clicp_free_text = false;
    this.image_free_text = false;

    this.question.q_check_type = null;
    let qtype = this.QTypes.find(i => i.id === e.value)['question_type'];
    
    
    switch (qtype) {
      case 'Single Option Selection':
        this.single_option = true;
        break;
      case 'Multiple Options Selection':
        this.multiple_option = true;
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
    if (e.source.checked) {
      this.question.correct_ans_ids.push(e.source.value)
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

  createQList() {
    let filesData = this.myFiles;
    const formData = new FormData();

    if (Object.keys(filesData).length > 0) {
      Object.keys(filesData).map(function (key) {
        formData.append(key, filesData[key]);
      });
    }
    var details = JSON.stringify(this.question);
    formData.append('details', details);

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

}
