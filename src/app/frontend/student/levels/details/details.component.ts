import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import * as Editor from '../../../../../assets/ckeditor5';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { ToastrService } from 'ngx-toastr';
import * as modelPlayer from '../../../../../assets/3d-model-viewer/js-3d-model-viewer.min';
declare var kPoint: any;
declare var VdoPlayer:any;
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('editor', { static: false }) editor: CKEditorComponent;
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  hrefZIP: string;
  public materials = [];
  public shwAns = false;
  public shwQst = true;
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
  public flash_cards = [];
  public active_mcq_index = 0;
  public active_flash_cards_index = 0;
  public checked_options = [];
  public validated_questions = [];
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
  public flashCardsArray = [];
  public flash_card_popup = false;
  public flash_index = 0;
  public is_loaded = false;
  public is_preview = false;
  public is_individual = 0;
  public editorConfig = {link: {addTargetToExternalLinks: true ,decorators: {openInNewTab: {mode: 'manual',label: 'Open in a new tab',defaultValue: true, attributes: {target: '_blank', rel: 'noopener noreferrer'}}}}}
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
    public pdf_file_path = '';
    public pdf_popup: boolean = false;
    public pdf_zoom = 1;
    public pdf_rotation = 0;
    public pdf_page = 0;
    pdfQuery = '';

    api_url = environment.apiUrl;
    student_structure_template = this.api_url.substring(0, this.api_url.length - 5) + '/master_feeds/ProceumPlayer.zip';
    AppSquadzVideos = [];
    isChecked = false;
    public model_status = false;
    user: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: CommonService,
    public sanitizer: DomSanitizer,
    private toster: ToastrService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.hrefZIP = environment.apiUrl + 'download-attachments/';
  }

  // getMaterials() {
  //   let params={url: 'get-all-materials',source:'student',selected_level_id: this.level_parent_id};
  //   this.http.post(params).subscribe((res: Response) => {
  //     if (res['error'] == false) {
  //       this.materials = res['data']['materials'];
  //     } else {
  //       this.materials = [];
  //     }
  //   });
  // }

  downlodAttachments(id){
    window.location.href = this.hrefZIP + id;
  }

    pdf_rotation_change(direction){
        if(direction == 'next')
            this.pdf_rotation = this.pdf_rotation+90;
        if(direction == 'prev')
            this.pdf_rotation = this.pdf_rotation-90;
    }
  ngOnInit(): void {
    this.user = this.http.getUser();
    this.activatedRoute.params.subscribe((param) => {
      this.curriculum_id = param.curriculum_id == undefined?0:param.curriculum_id;
      this.level_id = param.level_id != undefined ? param.level_id : 0;
      this.level_parent_id = param.level_parent_id != undefined ? param.level_parent_id : 0;
      this.content_id = param.content_id != undefined ? param.content_id : 0;
      this.is_preview = window.location.href.includes("content-preview")?true:false;
        if(window.location.href.includes("/purchased-courses/")){
            this.is_individual = 1;
        }
        if(window.location.href.includes("/subjects/")){
            this.is_individual = 2;
        }
      this.getLevelDetails();
      //this.getMaterials();
      this.getAppSquadz();
    });
    
  }
    navigateTo(bread){
        
        let user = this.user;
        if(this.is_individual == 0 && parseInt(user['role']) == environment.ALL_ROLES.STUDENT){
            let url = '/student/curriculums/'+this.curriculum_id + '/' + bread['level_id'] + '/' + bread['id'];
            this.router.navigateByUrl(url);
        }
        if(this.is_individual == 1  && (parseInt(user['role']) == environment.ALL_ROLES.INDIVIDUAL || parseInt(user['role']) == environment.ALL_ROLES.STUDENT)){
            let url = '/student/purchased-courses/'+this.curriculum_id + '/' + bread['level_id'] + '/' + bread['id'];
            this.router.navigateByUrl(url);
        }
        if(this.is_individual == 2 && parseInt(user['role']) == environment.ALL_ROLES.TEACHER){
            let url = '/teacher/subjects/'+this.curriculum_id + '/' + bread['level_id'] + '/' + bread['id'];
            this.router.navigateByUrl(url);
        }
    }
  getAppSquadz(){
    let form_data = {user_id: 1};
    let param = {url: 'data_model/courses/exam/get_video_data',form_data: form_data};
    this.http.AppSquadzPost(param).subscribe((res) => {
      console.log(res);
      if (res['status'] == true) {
        this.AppSquadzVideos = res['data']; 
      }
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
  public scene:any;
  playVideo(video){
    window.scroll(0,0);
      this.active_video_obj = video;
      if(!this.http.getUser()){
          this.router.navigateByUrl("/login");
        }
    this.video_title = video['module_title'];
    if(video['video_type'] == "3D_OBJECT"){
        this.timeline = undefined;
        if(this.player != undefined){
            this.player.pauseVideo();
        }
        this.video_type = "3D_OBJECT";
        setTimeout(()=>{   
        if(this.scene == undefined){
            const viewerElement = document.getElementById('threed_obj_dev');
            this.scene = modelPlayer.prepareScene(viewerElement);
        }     
        modelPlayer.clearScene(this.scene)
        modelPlayer.resetCamera(this.scene)
        modelPlayer.loadObject(this.scene, this.bucket_url+video['video_source'],null);
        },1000);
        //modelPlayer.loadObject(scene, this.bucket_url+this.active_video_obj['video_source']);
    }
    if(video['video_type'] == "KPOINT"){
        this.video_type = "KPOINT";        
        if(this.player == undefined){
            //console.log(video, 'kpoint-ini');
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
    if(video['video_type'] == "VIDEO_CIPHER" && false){
        this.timeline = undefined;
        if(this.player != undefined){
            this.player.pauseVideo();
        }
        this.video_type = "VIDEO_CIPHER";
        this.getOtp(video['video_source']);
    }
    if(video['video_type'] == "YOUTUBE"){
        this.timeline = undefined;
        if(this.player != undefined){
            this.player.pauseVideo();
        }
        this.video_type = "YOUTUBE";
        let embed_link = video['video_source'].replace("/watch?v=","/embed/");
        this.youtube_iframe = this.sanitizer.bypassSecurityTrustResourceUrl(embed_link);
    }
  }
    getOtp(video_url){
        let param1 = {"url": "vdocipher/get-otp", video_url: video_url};
        this.http.post(param1).subscribe(res=>{
            console.log(res)
            var video = new VdoPlayer({
                otp: res['data']['otp'],
                playbackInfo: res['data']['playbackInfo'],
                theme: "9ae8bbe8dd964ddc9bdb932cca1cb59a",
                // the container can be any DOM element on website
                container: document.querySelector("#embedBox"),
              });
              
              // you can directly call any methods of VdoPlayer class from here. e.g:
              // video.addEventListener(`load`, () => {
              //   video.play(); // this will auto-start the video
              //   console.log('loaded');
              // });
        });
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
  getVdoThumbinail(url){
    return "/assets/images/video-cipher.png";
  }
  getYtThumbinail(url){
      if(url == null || url == undefined){
          return false;
      }
    var iframe_src       = url;
    var youtube_video_id = iframe_src.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/);
    if(youtube_video_id == null)
        return false
    else
    youtube_video_id = youtube_video_id.pop();
    
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
          is_individual: this.is_individual
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
            this.flash_cards = data['flash_cards'];   
            this.materials = data['materials'];
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
            let i=0;
            this.videos.forEach((video, index) => {
                if(video['video_section'] == "INTRO") {
                    this.intro_video.push(video);
                    if(i==0){
                        this.playVideo(video);
                        i++;
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
                if((index+1) == this.videos.length && i==0){
                    if(this.two_d_videos[0] != undefined){
                        this.playVideo(video);
                    }
                    else if(this.board_lecture_videos[0] != undefined){
                        this.playVideo(video);
                    }
                    else if(this.clinical_videos[0] != undefined){
                        this.playVideo(video);
                    }
                    else if(this.procedural_videos[0] != undefined){
                        this.playVideo(video);
                    }
                    else if(this.three_d_videos[0] != undefined){
                        this.playVideo(video);
                    }
                }
            });
            setTimeout(()=>{
                if(this.intro_video.length == 0){
                    if(this.videos.length){
                        if(this.two_d_videos[0] != undefined){
                            this.playVideo(this.two_d_videos[0]);
                        }
                        else if(this.board_lecture_videos[0] != undefined){
                            this.playVideo(this.board_lecture_videos[0]);
                        }
                        else if(this.clinical_videos[0] != undefined){
                            this.playVideo(this.clinical_videos[0]);
                        }
                        else if(this.procedural_videos[0] != undefined){
                            this.playVideo(this.procedural_videos[0]);
                        }
                        else if(this.three_d_videos[0] != undefined){
                            this.playVideo(this.three_d_videos[0]);
                        }
                    }
                }
            },1000)
            this.setDefaultDiv();
            this.studentContent(this.content_id,this.level_parent_id)
          } else {
            this.breadcome = res['data']['breadcome'];
          }
        });
    }
    studentContent(contentid,levelid){
        let param = {url: 'add-notes-accessed',content_id: contentid,source_id:levelid};
        this.http.post(param).subscribe((res) => {
            
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
        else if(this.flash_cards != undefined && this.flash_cards.length > 0){
            this.showDiv(11);
        }
        else if(this.materials != undefined && this.materials.length > 0){
          this.showDiv(12);
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
        this.images = [];
          if(div == 4){
            if(this.content['images'].length > 0){
                this.content['images'].forEach(element => {
                    this.images.push(element.path);
                });
            }
          }
        this.fetchImages(0);
        this.active_div = div;    
    }
    scrollto(el) {
        var element = document.getElementById('content_div');
        var headerOffset = 130;
        var elementPosition = element.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });   
    }
    fetchImages(class_index){
        setTimeout(res=>{
        let class_name = document.getElementsByClassName("ck_editor_view");
        if(class_name != undefined){
            if(class_name[class_index] == undefined)return false;
            let images = class_name[class_index].getElementsByTagName("img");
            if(images != undefined){
                for(var i = 0, n = images.length; i < n; ++i) {
                    if(images[i].src != "") {
                        if(!this.images.includes(images[i].src))
                            this.images.push(images[i].src);
                        images[i].addEventListener("click", (e) =>  {
                            const target = e.target as HTMLSourceElement;
                            let index = this.images.indexOf(target.src);
                            this.openLibrary(index);
                            
                        });
                    }
                }
            }
        }
      },1000)
    }
    openLibrary(index){
        this.image_index = index;
        this.library_popup = true;
    }
    openFlashCardLibrary(index,flash_cards_index,flash_card_type){ // added by Phanindra
        this.flashCardsArray = this.flash_cards[flash_cards_index][flash_card_type].map((item) => {
          return item.path;
        });
        this.flash_index = index;
        this.flash_card_popup = true;
    }
    openPdf(path){
      console.log(path)
      this.pdf_popup = true;
      this.pdf_file_path = path
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
          this.getXtToken(this.mcqs[this.active_mcq_index]);
        }
        if (this.active_div == 7) {
          this.active_case_index = this.active_case_index + 1;
          this.getXtToken(this.cases[this.active_mcq_index]);
        }
        if (this.active_div == 10) {
          this.active_short_answer_index = this.active_short_answer_index + 1;
          this.getXtToken(this.short_answers[this.active_mcq_index]);
        }
        if (this.active_div == 11) {
          this.active_flash_cards_index = this.active_flash_cards_index + 1;
          this.getXtToken(this.flash_cards[this.active_mcq_index]);
        }
    }
    prevQuestion() {
        if (this.active_div == 1) {
          this.active_mcq_index = this.active_mcq_index - 1;
          this.getXtToken(this.mcqs[this.active_mcq_index]);
        }
        if (this.active_div == 7) {
          this.active_case_index = this.active_case_index - 1;
          this.getXtToken(this.cases[this.active_mcq_index]);
        }
        if (this.active_div == 10) {
          this.active_short_answer_index = this.active_short_answer_index - 1;
          this.getXtToken(this.short_answers[this.active_mcq_index]);
        }
        if (this.active_div == 11) {
          this.active_flash_cards_index = this.active_flash_cards_index - 1;
          this.getXtToken(this.flash_cards[this.active_mcq_index]);
        }
    }
    kpoint_iframe_url='';
    getXtToken(question){
        if(question['q_source'] == 'KPOINT'){
            let param = {"url": "get-kpoint-token"};
            this.xt = '';
            this.http.post(param).subscribe(res=>{
                this.xt = res['data']['xt'];
                this.kpoint_iframe_url = "https://proceum.kpoint.com/kapsule/"+question['q_source_value']+"/nv3/embedded?xt="+this.xt;
                
            });
        }
    }
    checkAnswer(event, option_id,question_id){
        if(event.checked == true){
            if(this.checked_options[question_id] == undefined){
                this.checked_options[question_id] = [];
            }
            this.checked_options[question_id].push(option_id);
        }
        else{
            let index = this.checked_options[question_id].indexOf(option_id);
            this.checked_options[question_id].splice(index,1);
        }
    }
    ValidateAnswer(question_id){
        this.validated_questions.push(question_id)
    }
    getOptionClass(question_id, correct_ans_ids, option_id){
        let answers = correct_ans_ids.split(',');
        if(this.validated_questions.includes(question_id) && answers.includes(''+option_id)){
            return "crrct_rdo";
        }
        else if(this.validated_questions.includes(question_id) && !answers.includes(''+option_id)){
            return "wrng_rdo";
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
        this.flash_cards = [];
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
    searchQueryChanged(newQuery: string) {
        if (newQuery !== this.pdfQuery) {
          this.pdfQuery = newQuery;
          this.pdfComponent.pdfFindController.executeCommand('find', {
            query: this.pdfQuery,
            highlightAll: true
          });
        } else {
          this.pdfComponent.pdfFindController.executeCommand('findagain', {
            query: this.pdfQuery,
            highlightAll: true
          });
        }
    }
    toggleModel() {
        this.model_status = !this.model_status;
    }
}
