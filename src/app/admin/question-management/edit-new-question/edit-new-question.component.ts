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
    CKEditorComponent
} from '@ckeditor/ckeditor5-angular';
import {
    environment
} from 'src/environments/environment';
import * as Editor from '../../../../assets/ckeditor5/build/ckeditor';
import {
    UploadAdapter
} from '../../../classes/UploadAdapter';
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
    ActivatedRoute,
    Router
} from '@angular/router';
import {
    count
} from 'rxjs/operators';
import {
    ReplaySubject
} from 'rxjs';
import {
    DomSanitizer
} from '@angular/platform-browser';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
    selector: 'app-edit-new-question',
    templateUrl: './edit-new-question.component.html',
    styleUrls: ['./edit-new-question.component.scss']
})
export class EditNewQuestionComponent implements OnInit {
    
    displayedColumns: string[] = ['Sno', 'Course', 'Topic', 'Action']; 
    public video_types = environment.video_types;
    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, {
        static: false
    }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('documents') documents_input: ElementRef;
    page_size_options = environment.page_size_options;

    public Editor = Editor;
    liteEditorConfig = environment.liteEditorConfig;
    is_loaded = true
    question_id = null;
    public question_Qbank = false;
    QTypes: any;
    QBanks: any;
    question: any = {
        questionUsageType: '',
        curriculum_id: 0,
        question_type_id: '',
        question_flag: '',
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
        option_array: [],
        selected_topics:[],
        delete_topics:[]
    }
    q_type = '';
    public current_path = 'qlist';
    public audio = new Audio();
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
    public topics: ReplaySubject < any > = new ReplaySubject < any > (1);
    opt5FileName: any;
    opt6FileName: any;
    opt7FileName: any;
    opt8FileName: any;
    user = [];
    public bucket_url = '';
    imageSrc = {};
    selected_topic = '';
    selected_course = '';
    is_topic_exist = false;
    public selected_topics = [];
    public show_explanation = [];
    constructor(private http: CommonService, private router: Router, private domSanitizer: DomSanitizer,
        private toster: ToastrService,
        private activeRoute: ActivatedRoute,
    ) {}
    qtype: any;
    ngOnInit(): void {
        this.user = this.http.getUser();
        this.getQTypes()
        //this.getQBanks()
        this.activeRoute.params.subscribe((routeParams) => {
            this.question_id = routeParams.id;
            this.getQuestion()
        });
        this.getChildData();
    }

    getQuestion() {
        let param = {
            url: 'qlists/show/' + this.question_id,
        };
        this.http.get(param).subscribe((res) => {
            if (res['error'] == false) {
                this.bucket_url = res['bucket_url'];
                if(res['question_topics'].length > 0){
                    this.selected_topics = res['question_topics'];
                    this.dataSource = new MatTableDataSource(this.selected_topics);
                }
                let options = res['q_options'];
                let questionData = res['question'];
                this.question.question_flag = questionData['question_flag'];
                this.question.curriculum_id = Number(questionData['curriculum_id']);console.log(this.question.curriculum_id)
                if (this.question.curriculum_id > 0) {
                    this.getTopics(this.question.curriculum_id, '');
                }
                this.question.questionUsageType = Number(questionData['question_for']);
                if (this.question.questionUsageType == 3) {
                    this.question_Qbank = true;
                    this.getcurriculums(2);
                }
                else{
                    this.getcurriculums(1);
                }
                if (questionData.q_bank_ids) {
                    this.question.q_bank_ids = Array.from(questionData.q_bank_ids.split(","), Number);
                } else {
                    this.question.q_bank_ids = [];
                }
                this.question.question_text = questionData.question_text;
                this.question.topic = questionData.topic;
                this.question.explanation = questionData.explanation;
                this.question.question_type_id = res['q_type']['pk_id'];
                this.question.difficulty_level_id = questionData.difficulty_level_id;
                var correct_ans_ids_string = questionData.correct_ans_id + '';
                let correct_ans_ids = [];
                if (correct_ans_ids_string.includes(',')) {
                    correct_ans_ids = correct_ans_ids_string.split(",").map(Number);
                } else {
                    correct_ans_ids.push(Number(correct_ans_ids_string));
                }
                this.question.correct_ans_ids = correct_ans_ids;
                this.question.q_source = questionData.q_source;
                this.question.q_source_value = questionData.q_source_value;
                for (let i = 1; i <= options.length; i++) {
                    this.question.option_array.push(i);
                }
                if (options.length > 0) {
                    for (var i = 0; options.length > i; i++) {
                        this.question['option_explanation_' + (i + 1)] = options[i]['option_explanation'];
                        if (correct_ans_ids.includes(options[i]['pk_id'])) {
                            this.question['option'+(i + 1)+'_crt_ans'] = 'checked';
                        }
                        this.question['option'+(i + 1)+'_value'] = options[i]['pk_id'];
                        this['opt'+(i + 1)+'FileName'] = options[i]['option_image'];
                        this.option_images['opt'+(i + 1)+'Img'] = options[i]['option_image'];
                        this.option_images_paths['opt'+(i + 1)+'Img'] = options[i]['option_image'];
                        this.question['option'+(i + 1)] = options[i]['option_text'];
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
                        this.option_images['file'] = questionData['q_source_value'];
                        this.option_images_paths['file'] = questionData['q_source_value'];
                        this.image_single_option = true;
                        break;
                    case 'Image with Multiple Options Selection':
                        this.fileName = questionData['q_source_value'];
                        this.image_multiple_option = true;
                        this.option_images['file'] = questionData['q_source_value'];
                        this.option_images_paths['file'] = questionData['q_source_value'];
                        break;
                    case 'Image with Freetype Text Input':
                        this.image_free_text = true;
                        this.fileName = questionData['q_source_value'];
                        this.option_images['file'] = questionData['q_source_value'];
                        this.option_images_paths['file'] = questionData['q_source_value'];
                        break;
                    default:
                        console.log("No such type exists!");
                        break;
                }
            }
        });
    }


    getQLists() {
        let param = {
            url: 'qbank'
        };
        this.http.get(param).subscribe((res) => {
            if (res['error'] == false) {
                this.dataSource = new MatTableDataSource(res['data']['qbanks']);
                if (this.is_loaded == true || true) {
                    this.is_loaded = false;
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
            } else {
                this.toster.error(res['message'], 'Error', {
                    closeButton: true
                });
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
    getTopics(curriculum_id, search) {
        this.question.q_bank_ids = [];
        this.question.q_bank_ids.push(curriculum_id);
        let params = {
            url: 'get-topics-by-curriculum',
            curriculum_id: curriculum_id,
            search: search
        };
        this.http.post(params).subscribe((res) => {
            if (res['error'] == false) {
                //this.topics.next([]);
                if (res['data']['topics'].length > 0)
                    this.topics.next(res['data']['topics'].slice());
                else
                    this.topics.next([]);
            }
        });
    }
    getcurriculums(type) {
        let params = {
            url: 'get-courses-or-qbanks', type: type
        };
        this.http.post(params).subscribe((res) => {
            //this.topics.next([]);
            //this.question.topic = '';
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
    // public level_names = [];
    // setTopicText(args, level_id){ 
    //     this.level_options[level_id].forEach(res2=>{
    //         if(res2['pk_id'] == args)
    //         {
    //             if(this.selected_topic != ''){
    //                 this.selected_topic += ' / '+res2['level_name'];
    //             }
    //             else
    //                 this.selected_topic = res2['level_name'];
    //         }
    //     })
    // }
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
        if(this.selected_topics[index]['pk_id'] > 0)
        {
            this.question.delete_topics.push(this.selected_topics[index]['pk_id']);
        }
        console.log(this.question.delete_topics);
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
        if ((this.single_option || this.audio_single_option || this.vidio_single_option || this.image_single_option) && (e.source.value)) {
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
                    //this.imageSrc[fileId] = this.domSanitizer.bypassSecurityTrustUrl(''+reader.result);
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
    updateQList(q_data) {
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
        q_data = q_data.value;
        let filesData = this.myFiles;
        const formData = new FormData();
        if (Object.keys(filesData).length > 0) {
            Object.keys(filesData).map(function(key) {
                formData.append(key, filesData[key]);
            });
        }

        if (this.question.single_crt_ans) {
            this.question.correct_ans_ids[0] = this.question.single_crt_ans
        }
        var details = JSON.stringify(this.question);
        formData.append('details', details);

        let param = {
            url: "qlists/update/" + this.question_id
        };
        this.http.imageUpload(param, formData).subscribe((res) => {
            if (res['error'] == false) {
                this.toster.success(res['message'], 'Success', {
                    closeButton: true
                });
                this.navigateTo('questions-mgt/questions-list')
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
        if (val == 3) {
            this.getcurriculums(2);
            this.question_Qbank = true;
        } else {
            this.getcurriculums(1);
            this.question.q_bank_ids = []
        }
    }
    public openFileExplor(id) {
        console.log(id)
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
            let obj = { file_path: res['file_path'], path: res['path'] };
            this.toster.success('Files Added.', 'File', { closeButton: true });
              this.option_images[this.active_option] = res['file_path'];
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
        this.audio.pause();
        this.audio.remove();
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