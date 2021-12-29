import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';


@Component({
  selector: 'app-exam-prepmode',
  templateUrl: './exam-prepmode.component.html',
  styleUrls: ['./exam-prepmode.component.scss']
})
export class ExamPrepmodeComponent implements OnInit {
    public displayedColumns: string[] = ['Sno', 'Topic', 'q_count', 'Action'];
    //public qbank_id = 0;
    public exam_type = 1;//1 for study mode 2 for exam mode 3 for live mode
    public duration = 1;
    public difficulty_level = 0;
    public filter_array = {qbank_id:0, level_id:0, topic:0};
    public curriculum_labels = [];
    public level_options = [];
    public all_level_options = [];
    public selected_level = [];
    public questions_count = 0;
    public selected_q_count = 0;
    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: CommonService, public sanitizer: DomSanitizer, private toster: ToastrService) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param) => {
            this.filter_array.qbank_id = param.qbank_id;
            this.getLabels(1);
        });
    }
    getLabels(type){
        this.questions_count = 0;
        this.selected_q_count = 0;
        this.selected_topics = [];
        this.dataSource = new MatTableDataSource([]);
        this.is_topic_exist = false;
        this.level_options = [];
        this.all_level_options = [];
        this.selected_level = [];
        this.filter_array.level_id=0;
        let param = {
            url: 'get-curriculum-labels',
            curriculum_id: this.filter_array.qbank_id,
            flag: ''
        };
        if(type!=1){
            param = {
                url: 'get-curriculum-by-label-flag',
                curriculum_id: this.filter_array.qbank_id,
                flag: 'subject'
            };
        }
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
            let data = res['data'];
            if(type!=1){
                this.level_options[data['level_number']] = data['level_1'];
                this.all_level_options[data['level_number']] = data['level_1'];
            }
            else{
                this.level_options[1] = data['level_1'];
                this.all_level_options[1] = data['level_1'];
            }
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
    getLevels(level_id) {
        this.filter_array.level_id = this.selected_level[level_id];
        let param = {
        url: 'get-levels-by-level',
        step_id: this.selected_level[level_id],
        get_q_count:true,
        difficulty_level: this.difficulty_level
        };
        this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
            let data = res['data'];
            this.questions_count = data['q_count'];
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
    removeTopic(index){
        this.selected_topics.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.selected_topics);
    }
    public is_topic_exist = false;
    public selected_topics = [];
    public dataSource = new MatTableDataSource();
    addTopic(){
         
        this.selected_topics.forEach(res => {
            if(res['topic'] == this.filter_array.level_id){
                this.toster.error("Topic exists", "Error", {closeButton:true});
                this.is_topic_exist = true;
                return false;
            }
        })
        if(this.is_topic_exist != true){
            let param = {url: "get-topic-path", curriculum_id: this.filter_array.qbank_id, topic_id: this.filter_array.level_id};
            this.http.post(param).subscribe((res) => {
                if (res['error'] == false) {
                    let data = {pk_id:0, topic:this.filter_array.level_id, topic_text: res['data']['path'], is_delete:0, q_count: this.selected_q_count};
                    this.selected_topics.push(data);
                    this.dataSource = new MatTableDataSource(this.selected_topics);   
                }
            });
        }
    }
    /* View in fullscreen */
    elem: any;
 openFullscreen() {
    this.elem = document.documentElement;
    if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();this.startTest();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();this.startTest();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        
        this.elem.webkitRequestFullscreen();this.startTest();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();this.startTest();
      }
}
    startTest(){
        if(this.exam_type == 1){
            if(this.filter_array.level_id > 0){
                this.router.navigateByUrl("/student/qbank/study-mode/"+this.filter_array.qbank_id+"/"+this.filter_array.level_id);
            }
        }
        else if(this.exam_type == 2){
            let param = {url: "qbank/create-exam", qbank_id: this.filter_array.qbank_id, exam_type: this.exam_type, duration: this.duration, difficulty_level: this.difficulty_level, selected_topics: this.selected_topics};
            this.http.post(param).subscribe((res) => {
                if (res['error'] == false) {
                    this.router.navigateByUrl("/student/qbank/exam-mode/"+this.filter_array.qbank_id+"/"+res['data']['exam_id']);
                }
            });
        }
        else if(this.exam_type == 3){
            let param = {url: "qbank/create-exam", qbank_id: this.filter_array.qbank_id, exam_type: this.exam_type, duration: this.duration, difficulty_level: this.difficulty_level, selected_topics: this.selected_topics};
            this.http.post(param).subscribe((res) => {
                if (res['error'] == false) {
                    this.router.navigateByUrl("/student/qbank/live-mode/"+this.filter_array.qbank_id+"/"+res['data']['exam_id']);
                }
            });
        }
    }
}
