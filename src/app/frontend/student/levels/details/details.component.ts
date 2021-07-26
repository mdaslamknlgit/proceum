import { Component, OnInit, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import * as Editor from '../../../../../assets/ckeditor5';

import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import * as modelPlayer from 'js-3d-model-viewer';
declare var kPoint: any;
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('editor', { static: false }) editor: CKEditorComponent;
  @ViewChild('editor2', { static: false }) editor2: CKEditorComponent;
  public view_type = 1;
  public title = '';
  public curriculum = [];
  public curriculum_id = 0;
  public level_id = 0;
  public level_parent_id = 0;
  public breadcome = [];
  public content_id = 0;
  public content_list = [];
  public content = [];
  public images = [];
  public active_div = 99;
  public main_content: any = [];
  public Editor = Editor;
  public Editor2 = Editor;
  public show_content_list = false;
  public buzz_words = false;
  public font_size = 14;
  public main_desc = '';
  public mcqs = [];
  public active_mcq_index = 0;
  public short_answers = [];
  public active_short_answer_index = 0;
  public cases = [];
  public active_case_index = 0;
  public highyields = [];
  public learning_notes = [];
  public bucket_url = '';
  public statistics = [];
  public videos = [];
  public intro_video = [];
  public two_d_videos = [];
  public board_lecture_videos = [];
  public clinical_videos = [];
  public procedural_videos = [];
  public three_d_videos = [];
  public video_title = 'Introduction video';
  public active_video_obj = [];
  public player:any;
  public display_videos = "INTRO";
  public video_type = 'KPOINT';
  public iframe_width = '420';
  public iframe_height = '315';
  public youtube_iframe:any;
  public xt = '';
  public timeline:any;
  public library_popup = false;
  public image_index = 0;
  public is_loaded = false;
  public is_preview = false;
  public editorConfig = {link: {decorators: {openInNewTab: {mode: 'manual',label: 'Open in a new tab',defaultValue: true, attributes: {target: '_blank', rel: 'noopener noreferrer'}}}}}
  public image_config = {
    btnClass: 'default', // The CSS class(es) that will apply to the buttons
    zoomFactor: 0.1, // The amount that the scale will be increased by
    containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
    wheelZoom: true, // If true, the mouse wheel can be used to zoom in
    allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to enter fullscreen mode
    allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
    btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
        zoomIn: 'fa fa-plus',
        zoomOut: 'fa fa-minus',
        rotateClockwise: 'fa fa-repeat',
        rotateCounterClockwise: 'fa fa-undo',
        next: 'fa fa-arrow-right',
        prev: 'fa fa-arrow-left',
        fullscreen: 'fa fa-arrows-alt',
    },
    btnShow: {
        zoomIn: true,
        zoomOut: true,
        rotateClockwise: true,
        rotateCounterClockwise: true,
        next: true,
        prev: true
    }
};
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: CommonService,
    private sanitizer: DomSanitizer,
    private toster: ToastrService,
    private renderer: Renderer2
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.curriculum_id = param.curriculum_id == undefined?0:param.curriculum_id;
      this.level_id = param.level_id != undefined ? param.level_id : 0;
      this.level_parent_id = param.level_parent_id != undefined ? param.level_parent_id : 0;
      this.content_id = param.content_id != undefined ? param.content_id : 0;
      this.is_preview = window.location.href.includes("content-preview")?true:false;
      this.getLevelDetails();
    });
    
  }
  ngAfterViewInit() {
    this.hideBuzzWords();
    document.documentElement.style.setProperty(
      '--ck-editor-font-size',
      this.font_size + 'px'
    );
  }
  //not using function
  initPlayer(param){
  setTimeout(()=>{
      if(this.player == undefined){
          this.player = kPoint.Player(document.getElementById("player-container"), {
             // "kvideoId"  : this.video_id,
              "videoHost" : "proceum.kpoint.com",
              "params"    : {"autoplay" : false,"hide": "search, share, like", "xt" : this.xt}
            });
            this.player.addEventListener(this.player.events.ready, () =>{
              this.player.pauseVideo();
            });
            console.log(this.player);
      }
      },1000);
}
  switchView(){
      this.view_type = this.view_type == 1?2:1;
      if(this.view_type == 1){
        this.iframe_width = '420';
        this.iframe_height = '315';
    }
    else{
        this.iframe_width = '100%';
        this.iframe_height = '600';
    }
  }
  
  playVideo(video){
      this.active_video_obj = video;
      if(!this.http.getUser()){
          this.router.navigateByUrl("/login");
        }
    this.video_title = video['module_title'];
    if(video['video_type'] == "3D_OBJECT"){
        this.video_type = "3D_OBJECT";
        // setTimeout(()=>{
        //     const viewerElement = document.getElementById('threed_obj_dev');
        // const scene = modelPlayer.prepareScene(viewerElement);
        // modelPlayer.loadObject(scene, 'http://192.10.250.150:4200/assets/sample.obj');
        // },3000);
        //modelPlayer.loadObject(scene, this.bucket_url+this.active_video_obj['video_source']);
    }
    if(video['video_type'] == "KPOINT"){
        this.video_type = "KPOINT";        
        if(this.player == undefined){
            console.log(video, 'kpoint-ini');
            setTimeout(()=>{
            this.player = kPoint.Player(document.getElementById("player-container"), {
                "kvideoId"  : video['video_source'],
                "videoHost" : "proceum.kpoint.com",
                "params"    : {"autoplay" : false, "hide": "search, share, like, toc", "xt" : this.xt}
              });
             this.getTimeline();
            },1000);
        }
        else{
            this.player.loadVideoById(video['video_source']);
            this.getTimeline();
        }
    }
    if(video['video_type'] == "YOUTUBE"){
        this.timeline = undefined;
        console.log(video, "youtube");
        if(this.player != undefined){
            this.player.pauseVideo();
        }
        this.video_type = "YOUTUBE";
        let embed_link = video['video_source'].replace("/watch?v=","/embed/");
        console.log(embed_link)
        this.youtube_iframe = this.sanitizer.bypassSecurityTrustResourceUrl(embed_link);
       // this.youtube_iframe = this.sanitizer.bypassSecurityTrustHtml('<iframe [width]="iframe_width" [height]="iframe_height" src="'+embed_link+'"></iframe>');
    }
  }
  getTimeline(){
    this.timeline = undefined;
    let param1 = {"url": "get-kpoint-token"};
    this.http.post(param1).subscribe(res=>{
        this.xt = res['data']['xt'];
        let param = {url: "kapsule/"+this.player.info.kvideoId+"/bookmarks?xt="+this.xt};
        this.http.kpointGet(param).subscribe(res=>{
        this.timeline = res;
    });
    })
  }
  seekTo(time){
      this.player.seekTo(time);
  }
  getThumbinail(url){
    var iframe_src       = url;
    var youtube_video_id = iframe_src.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/).pop();
    
    if (youtube_video_id.length == 11) {
        var video_thumbnail = this.sanitizer.bypassSecurityTrustResourceUrl("https://img.youtube.com/vi/"+youtube_video_id+"/0.jpg");
        return video_thumbnail
    }
  }
   millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
  }
  setFontSize(val) {
      if(val<1){
          return false;
      }
    let final_val = val == '+' ? this.font_size + 1 : this.font_size - 1;
    this.font_size = final_val;
    document.documentElement.style.setProperty(
      '--ck-editor-font-size',
      this.font_size + 'px'
    );
  }
  showBuzzwords() {
    this.buzz_words = true;
    document.documentElement.style.setProperty(
      '--ck-highlight-marker-yellow',
      'yellow'
    );
    document.documentElement.style.setProperty(
      '--ck-highlight-marker-blue',
      'blue'
    );
    document.documentElement.style.setProperty(
      '--ck-highlight-marker-pink',
      'pink'
    );
  }
  hideBuzzWords() {
    this.buzz_words = false;
    document.documentElement.style.setProperty(
      '--ck-highlight-marker-yellow',
      'white'
    );
    document.documentElement.style.setProperty(
      '--ck-highlight-marker-blue',
      'white'
    );
    document.documentElement.style.setProperty(
      '--ck-highlight-marker-pink',
      'white'
    );
  }
  onReady(eventData) {
    this.main_desc = this.content['main_content'];
  }
  setTitle(val) {
    return val;
  }
  getLevelDetails() {
    let param = {
      url: 'curriculum-level-details',
      curriculum_id: this.curriculum_id,
      level_id: this.level_id,
      level_parent_id: this.level_parent_id,
      content_id: this.content_id,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.is_loaded = true;
        this.statistics = data['statistics'];
        this.bucket_url = data['bucket_url'];
        this.curriculum = data['curriculum'];
        this.breadcome = res['breadcome'];
        this.content_list = data['content_list'];
        this.content = data['content'] ? data['content'] : [];
        if(!this.content['title']){
            this.toster.error("No Contents Found", "Error", {closeButton:true});
        }
        if(this.content['images'].length > 0){
            this.content['images'].forEach(element => {
                this.images.push(element.path);
            });
        }
        this.highyields = data['highyields'];
        this.learning_notes = data['learning_notes'];
        this.mcqs = data['mcqs'];
        this.short_answers = data['short_answers'];
        this.cases = data['cases'];
        this.main_content = this.sanitizer.bypassSecurityTrustHtml(
          this.content['main_content']
        );
        this.content_id = data['selected_content_id'];
        if (this.breadcome.length > 0) {
          this.breadcome.forEach((val) => {
            this.title = val['name'];
          });
        }
        this.videos = data['videos'];
        this.xt = data['xt'];
        this.videos.forEach(video => {
            if(video['video_section'] == "INTRO") {
                this.intro_video.push(video);
                //this.video_id = video['video_source'];
                if(this.player == undefined && video['video_type'] == 'KPOINT'){
                    this.playVideo(video);
                }
                else{
                    this.playVideo(video);
                }
            }
            if(video['video_section'] == "2D") {
                this.two_d_videos.push(video);
            }
            if(video['video_section'] == "3D") {
                this.three_d_videos.push(video);
            }
            if(video['video_section'] == "CLINICAL_ESSENTIALS") {
                this.clinical_videos.push(video);
            }
            if(video['video_section'] == "PROCEDURAL") {
                this.procedural_videos.push(video);
             }
            if(video['video_section'] == "BOARD_LECTURES") {
                this.board_lecture_videos.push(video);
            }
            this.setDefaultDiv()
        })
      } else {
        this.breadcome = res['data']['breadcome'];
      }
    });
  }
    setDefaultDiv(){
        if(this.content['learning_obj_content']!=undefined && this.content['learning_obj_content'].trim() != ''){
            this.showDiv(3);
        }
        else if(this.content['main_content']!=undefined && this.content['main_content'].trim() != ''){
            this.showDiv(0);
        }
        else if(this.learning_notes.length > 0){
            this.showDiv(2);
        }
        else if(this.highyields.length > 0){
            this.showDiv(6);
        }
        else if(this.mcqs != undefined && this.mcqs.length > 0){
            this.showDiv(1);
        }
        else if(this.short_answers != undefined && this.short_answers.length > 0){
            this.showDiv(10);
        }
        else if(this.cases != undefined && this.cases.length > 0){
            this.showDiv(7);
        }
        else if(this.content['external_ref_content'] != undefined && this.content['external_ref_content'].trim() != ''){
            this.showDiv(8);
        }
        else if(this.content['images'] !=undefined && this.content['images'].length>0){
            this.showDiv(4);
        }
        else if(this.content['attachments'] !=undefined && this.content['attachments'].length>0){
            this.showDiv(5);
        }
    }
  showDiv(div) {
    this.active_div = div;
  }
  openLibrary(index){
      this.image_index = index;
    this.library_popup = true;
  }
  manageStatistics(type) {
    let param = {
      url: 'manage-statistics',
      type: type,
      source_id: this.content_id,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.statistics = res['data']['statistics'];
        // this.toster.success(res['message'], 'Info', { closeButton: true });
      } else {
        this.toster.info('Something went wrong. Please try again.', 'Error', {
          closeButton: true,
        });
      }
    });
  }
  nextQuestion() {
    if (this.active_div == 1) {
      this.active_mcq_index = this.active_mcq_index + 1;
    }
    if (this.active_div == 7) {
      this.active_case_index = this.active_case_index + 1;
    }
    if (this.active_div == 10) {
      this.active_short_answer_index = this.active_short_answer_index + 1;
    }
  }
  prevQuestion() {
    if (this.active_div == 1) {
      this.active_mcq_index = this.active_mcq_index - 1;
    }
    if (this.active_div == 7) {
      this.active_case_index = this.active_case_index - 1;
    }
    if (this.active_div == 10) {
      this.active_short_answer_index = this.active_short_answer_index - 1;
    }
  }
  selectOption(value) {
    if (this.active_div == 1) {
      this.mcqs[this.active_mcq_index]['selected_option'] = value;
    }
    if (this.active_div == 7) {
      this.cases[this.active_case_index]['selected_option'] = value;
    }
    if (this.active_div == 10) {
      this.short_answers[this.active_short_answer_index]['selected_option'] =
        value;
    }
  }
  viewContent(content_id) {
    this.content = [];
    this.mcqs = [];
    this.short_answers = [];
    this.cases = [];
    this.show_content_list = !this.show_content_list;
    this.router.navigateByUrl(
      '/student/curriculum/details/' +
        this.curriculum_id +
        '/' +
        this.level_id +
        '/' +
        this.level_parent_id +
        '/' +
        content_id
    );
  }
}
