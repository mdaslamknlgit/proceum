import {
    Component,
    OnInit,
    ViewChild,
    ElementRef
} from '@angular/core';
import {
    CommonService
} from 'src/app/services/common.service';
import {
    ToastrService
} from 'ngx-toastr';
import {
    environment
} from 'src/environments/environment';
import * as Editor from '../../../../assets/ckeditor5/build/ckeditor';
import {
    MatTableDataSource
} from '@angular/material/table';
import {
    MatPaginator,
    PageEvent
} from '@angular/material/paginator';
import {
    MatSort
} from '@angular/material/sort';
import {
    ReplaySubject
} from 'rxjs';
import {
    Router
} from '@angular/router';
import {
    DomSanitizer
} from '@angular/platform-browser';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
    selector: 'app-create-new-question',
    templateUrl: './create-new-question.component.html',
    styleUrls: ['./create-new-question.component.scss']
})

 
export class CreateNewQuestionComponent implements OnInit {    
    displayedColumns: string[] = ['Sno', 'Course', 'Topic', 'Action']; 
    public max_options = 20;
    public video_types = environment.video_types;
    public selected_topics = [];
    public dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, {
        static: false
    }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('documents') documents_input: ElementRef;
    //Code starts here for course selection
    page_size_options = environment.page_size_options;

    public Editor = Editor;
    public question_Qbank = false;
    public audio = new Audio();
    public show_explanation = [];
    liteEditorConfig = environment.liteEditorConfig;
    is_loaded = true;
    imageSrc = {};
    QTypes: any;
    QBanks: any;
    question = {
        curriculum_id: '',
        question_type_id: '',
        q_bank_ids: [],
        question_text: '',
        topic: '',
        q_source: "",
        question_flag: '',
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
        option_array: [1, 2, 3, 4],
        selected_topics:[],
        new_options:{}
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
    public topics: ReplaySubject < any > = new ReplaySubject < any > (1);
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
    selected_topic = '';
    selected_course = '';
    is_topic_exist = false;

    constructor(private http: CommonService, private domSanitizer: DomSanitizer, private toster: ToastrService, private router: Router) {}
    qtype: any;
    ngOnInit(): void {
        this.user = this.http.getUser();
        this.getQTypes()
        //this.getQBanks()
        this.changeQUsageType(1);
        this.getChildData();
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
    getcurriculums(type, val) {
        this.question.curriculum_id = '';
        let params = {
            url: 'get-courses-or-qbanks', type: type, assessment_type:val == 1?1:0,
        };
        
        this.http.post(params).subscribe((res) => {
            this.topics.next([]);
            this.question.topic = '';
            if (res['error'] == false) {
                if (res['data']['list'].length > 0)
                    this.curriculums = res['data']['list'];
                else
                this.curriculums = [];
            }
        });
    }
    getLabels(){
        this.level_options = [];
        this.all_level_options = [];
        this.selected_level = [];
        this.level_id=0;
        let param = {
            url: 'get-curriculum-labels',
            curriculum_id: this.question.curriculum_id,
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
    public curriculum_labels = [];
    public level_options = [];
    public all_level_options = [];
    public selected_level = [];
    public level_id = 0;
    getLevels(level_id) {
        this.level_id = level_id;
        this.question.topic = this.selected_level[level_id];
        this.is_topic_exist = false;
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
    setCourseText(args){ 
        this.curriculums.forEach(res=>{
            if(res['pk_id'] == args)
            this.selected_course = res['curriculumn_name'];
        })
    }
    addTopic(){
         
        this.selected_topics.forEach(res => {
            if(res['course_qbank'] == this.question.curriculum_id && res['topic'] == this.question.topic){
                this.toster.error("Topic exists", "Error", {closeButton:true});
                this.is_topic_exist = true;
                return false;
            }
        })
        if(this.is_topic_exist != true){
            let param = {url: "get-topic-path", curriculum_id: this.question.curriculum_id, topic_id: this.question.topic};
            this.http.post(param).subscribe((res) => {
                if (res['error'] == false) {
                    let data = {pk_id:0, course_qbank:this.question.curriculum_id, course_qbank_text: this.selected_course, topic:this.question.topic, topic_text: res['data']['path'], is_delete:0};
                    this.selected_topics.push(data);
                    this.dataSource = new MatTableDataSource(this.selected_topics);
                    this.question.curriculum_id = '';
                    this.selected_course = '';
                    this.question.topic = '';
                    this.selected_topic = '';
                    this.level_options = [];
                    this.all_level_options = [];
                    this.selected_level = [];
                    this.level_id=0;
                    this.curriculum_labels = [];    
                }
            });
        }
    }
    removeTopic(index){
        this.selected_topics.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.selected_topics);
    }
    //not using
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
        this.option_images = {};
        this.option_images_paths = {};
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
        this.myFiles = [];
        this.removeAudio();
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
                this.fileName = "";
                this.audio_single_option = true;
                this.question.q_check_type = 'audio'
                break;
            case 'Audio Clip with Multiple Options Selection':
                this.fileName = "";
                this.audio_multiple_option = true;
                this.question.q_check_type = 'audio'
                break;
            case 'Audio Clip with Freetype Text Input':
                this.fileName = "";
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
                this.fileName = "";
                this.image_single_option = true;
                this.question.q_check_type = 'image'
                break;
            case 'Image with Multiple Options Selection':
                this.fileName = "";
                this.image_multiple_option = true;
                this.question.q_check_type = 'image';
                break;
            case 'Image with Freetype Text Input':
                this.fileName = "";
                this.image_free_text = true;
                break;
            default:
                console.log("No such type exists!");
                break;
        }

    }


    onCorrectAnsChange(e) {
        if (this.single_option || this.vidio_single_option || this.audio_single_option || this.image_single_option) {
            this.question.correct_ans_ids = [];
        }
        if (e.source.checked) {
            this.question.correct_ans_ids.push(e.source.value);
            console.log(this.question.correct_ans_ids)
        }
        if (!e.source.checked) {
            var index = this.question.correct_ans_ids.indexOf(e.source.value);
            if (index !== -1) {
                this.question.correct_ans_ids.splice(index, 1);
            }
        }
    }

    onFileChange(event) {
        this.removeAudio();
        let allowed_types = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];
        if (this.image_single_option || this.image_multiple_option || this.image_free_text) {
            allowed_types = [
                'jpg', 'jpeg', 'bmp', 'gif', 'png'
            ];
        }
        if (this.audio_single_option || this.audio_multiple_option || this.audio_clip_free_text) {
            allowed_types = ['mp3']
        }

        let files = event.target.files;
        for (var i = 0; i < event.target.files.length; i++) {
            let ext = files[i].name.split('.').pop().toLowerCase();
            if (allowed_types.includes(ext)) {
                let size = files[i].size;
                size = Math.round(size / 1024);
                if (size > environment.file_upload_size) {
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
                if(fileId == 'file'){
                    this.myFiles.splice(this.myFiles.indexOf("file"), 1);
                    this.fileName = fileName;
                    this.myFiles['file'] = event.target.files[i];
                }
                for(let option=1;option<=this.question.option_array.length;option++){
                    if(option == 1 && fileId == 'opt1Img'){
                        this.myFiles.splice(this.myFiles.indexOf("file"), 1);
                        this['opt'+option+'FileName'] = fileName;
                        this.myFiles['opt'+option+'Img'] = event.target.files[i];
                    }
                    if(fileId == 'opt'+option+'Img'){
                        this['opt'+option+'FileName'] = fileName;
                        this.myFiles['opt'+option+'Img'] = event.target.files[i];
                    }
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
    playAudio(src) {
        if (!src)
            return false;
        this.audio.src = src;
        this.audio.load();
        this.audio.play();
    }
    pauseAudio() {
        this.audio.pause();
    }
    removeAudio() {
        this.fileName = '';
        this.audio.pause();
        this.audio.remove();
    }
    addOption(index) {
        this.question.option_array.push(this.question.option_array.length+1);
    }
    removeOption(index) {
        this.question.option_array.splice(index, 1);
        this.question['option' + (index + 1)] = '';
        this['opt' + (index + 1) + 'FileName'] = '';
        index = this.question.correct_ans_ids.indexOf(index + 1);
        if (index >= 0) {
            this.question.correct_ans_ids.splice(index, 1);
        }
    }
    createQList() {
        // if (this.question_Qbank && this.question.q_bank_ids.length == 0) {
        //     this.toster.error("Please select Question bank(s)", "Error", {
        //         closeButton: true
        //     });
        //     return false;
        // }
        if (this.question.correct_ans_ids.length == 0 && (this.free_text == false && this.audio_clip_free_text == false && this.video_clicp_free_text == false && this.image_free_text == false)) {
            this.toster.error("Please select correct answer", "Error", {
                closeButton: true
            });
            return false;
        }
        if (this.selected_topics.length == 0) {
            this.toster.error("Please select atleast one topic", "Error", {
                closeButton: true
            });
            return false;
        }
        this.question.selected_topics = this.selected_topics;
        this.question.new_options = this.option_images_paths;
        let filesData = this.myFiles;
        const formData = new FormData();

        if (Object.keys(filesData).length > 0) {
            Object.keys(filesData).map(function(key) {
                formData.append(key, filesData[key]);
            });
        }
        var details = JSON.stringify(this.question);
        formData.append('details', details);
        //formData.append("option_array", JSON.stringify(this.option_array))
        let param = {
            url: 'qlists/create'
        };
        this.http.imageUpload(param, formData).subscribe((res) => {
            if (res['error'] == false) {
                this.toster.success(res['message'], 'Success', {
                    closeButton: true
                });
                this.navigateTo("questions-mgt/questions-list");
                //window.history.back()
            } else {
                let message = res['errors']['topic'] ?
                    res['errors']['topic'] :
                    res['errors'];
                this.toster.error(message, 'Error', {
                    closeButton: true
                });
            }
        });
    }
    
    public changeQUsageType(val) {
        this.question_Qbank = false;
        this.selected_topics = [];
        this.dataSource = new MatTableDataSource([]);
        if (val == 1) {
            this.getcurriculums(2,val);
            this.question_Qbank = true;
        }else if (val == 3) {
            this.getcurriculums(2,val);
            this.question_Qbank = true;
        } else {
            this.question.q_bank_ids = []
            this.getcurriculums(1,val);
        }
    }
    public openFileExplor(id) {
        document.getElementById('opt' + id + 'Img').click();
    }
    public library_popup: boolean = false;
    public library_purpose = '';
    public active_tab = '';
    public option_images = {};
    public option_images_paths = {};
    public active_option = '';
    private subscription:Subscription;
    getChildData() {
        this.subscription = this.http.child_data.subscribe((res) => {
          if (this.library_purpose == 'images') {
            let obj = { file_path: res['file_path'], path: res['path'] };console.log(obj)
            this.toster.success('Files Added.', 'File', { closeButton: true });
              this.option_images[this.active_option] = res['path'];
              this.option_images_paths[this.active_option] = res['file_path'];
          }
        });
      }
    CloseModal() {
        this.library_popup = false;
    }
    openAssetsLibrary(tab, option) {
        this.active_option = option;
        this.library_purpose = "images";
        this.active_tab = tab;
        this.library_popup = true;
    }
    removeFile(file){
        this.option_images[file] = '';
        this.option_images_paths[file] = '';
    }
    navigateTo(url) {
        let user = this.user;
        if (user['role'] == '1') {
            url = "/admin/" + url;
        }
        if (user['role'] == '3' || user['role'] == '4' || user['role'] == '5' || user['role'] == '6' || user['role'] == '7') {
            url = "/reviewer/" + url;
        }
        this.router.navigateByUrl(url);
    }
    validateVideo() {
        if (this.question.q_source_value != '' && this.question.q_source == 'KPOINT') {
            this.validateKpointId(this.question.q_source_value);
        }
        if (this.question.q_source_value != '' && this.question.q_source == 'YOUTUBE') {
            this.validateYouTubeUrl(this.question.q_source_value);
        }
    }
    validateKpointId(id) {
        if (id.length == 40) {
            let param1 = {
                "url": "get-kpoint-token"
            };
            this.http.post(param1).subscribe(res => {
                let xt = res['data']['xt'];
                let param = {
                    video_id: id,
                    xt: xt,
                    url: "kapsule/" + id + "?xt=" + xt
                };
                this.http.kpointGet(param).subscribe(res => {},
                    error => {
                        if (error['error']['error']['code'] == 9003) {
                            this.question.q_source_value = '';
                            this.toster.error("Invalid kpoint id", "Error", {
                                closeButton: true,
                            });
                        }
                        if (error['error']['error']['code'] == 9001) {
                            this.question.q_source_value = '';
                            this.toster.error("Invalid kpoint id", "Error", {
                                closeButton: true,
                            });
                        }
                    }
                );
            })
        } else {
            this.question.q_source_value = '';
            this.toster.error("Invalid kpoint id", "Error", {
                closeButton: true,
            });
            return false;
        }
    }
    validateYouTubeUrl(url) {
        if (url != undefined || url != '') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                return true;
            } else {
                this.question.q_source_value = '';
                this.toster.error("Invalid Youtube Url", "Error", {
                    closeButton: true,
                });
            }
        }
    }
    ngOnDestroy() { 
        this.subscription.unsubscribe();
    }
}