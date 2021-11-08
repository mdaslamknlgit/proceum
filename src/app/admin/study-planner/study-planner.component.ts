import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';




@Component({
  selector: 'app-study-planner',
  templateUrl: './study-planner.component.html',
  styleUrls: ['./study-planner.component.scss']
})
export class StudyPlannerComponent implements OnInit {
    public displayedColumns: string[] = ['SNo', 'Topic', 'MCQ', 'Cases', 'Shortans', 'Videos', 'Actions'];
    public study_plan = {name:'', course:[], duration:0, schdule:[]};
    public courses = [];
    public all_courses = [];
    public selected_courses = [];
    public task_test_modal = false;
    public task_asign_modal = false;
    public topics = [];
    public all_topics = [];
    public search_topics = '';
    public selected_topics = [];
    public selected_topics_list = [];
    public selected_day_index = 0;
    public active_tab_index = 0;
    public study_plan_id = 0;
    public pgae_title = 'Create Study Planner';
    public curriculum_labels = [];
    public level_options = [];
    public all_level_options = [];
    public selected_level = [];
    public selected_level_number = 0;
    constructor(private http: CommonService,private toster: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) { }
    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param) => {
            this.study_plan_id = param.id;
            if (this.study_plan_id != undefined) {
              this.pgae_title = 'Edit Study Planner';
              this.getStudyPlan();
            }
            else{
                this.study_plan_id = 0;
            }
          });
        this.getCourses();
    }
    getCourses(){
        let param = {url: "get-courses-or-qbanks", type:1};
        this.http.post(param).subscribe(res=>{
            this.courses = res['data']['list'];
            this.all_courses = res['data']['list'];
        });
    }
    getStudyPlan(){
        let param = {url: "study-plan/edit/"+this.study_plan_id};
        this.http.get(param).subscribe(res=>{
            if(res['error'] == false){
                let study_plan = res['data'];
                this.study_plan.name = study_plan['study_plan']['plan_name'];
                this.study_plan.duration = study_plan['study_plan']['duration_days'];
                this.study_plan.course = study_plan['selected_courses'].map(Number);
                this.study_plan.schdule = study_plan['schedule'];
                this.selected_courses = study_plan['courses'];
            }
            else{
                this.toster.error("Study Plan not found", "Error", {closeButton:true});
                this.router.navigateByUrl("admin/study-planner");
            }
        });
    }
    searchCourses(search){
        let options = this.all_courses;
        this.courses = options.filter(item => item.curriculumn_name.toLowerCase().includes(search.toLowerCase()));
    }
    setDuration(){
        if(this.study_plan.course.length > 0 && this.study_plan.duration>0){
            let param = {url: "get-courses-by-ids", ids: this.study_plan.course};
            this.http.post(param).subscribe(res=>{
                this.selected_courses = res['data']['courses'];
                this.study_plan.schdule = [];
                for(let i=0; i<= (this.study_plan.duration-1); i++){
                    let day = {pk_id:0, day:i+1, is_test_day:false, selected_courses: this.selected_courses, selected_topics:[], selected_topics_list:[]};
                    this.study_plan.schdule[i] = day;
                }
                if(this.study_plan.schdule.length>this.study_plan.duration){

                }
            });
        }
        else{
            this.study_plan.schdule = [];
        }
    }
    showTaskTestModal(index){
        this.selected_day_index = index;
        this.selected_topics = [];
        this.selected_topics_list = [];
        this.task_test_modal = true;
    }
    hideTaskTestModal(){
        this.task_test_modal = false;
    }
    showTaskAssignModal(){
        this.active_tab_index = 0;
        this.task_asign_modal = true;
        this.getActiveTabContent(false);
    }
    hideTaskAssignModal(){
        this.hideTaskTestModal();
        this.task_asign_modal = false;
    }
    getLabels(){
        this.level_options = [];
        this.all_level_options = [];
        this.selected_level = [];
        let param = {
            url: 'get-curriculum-labels',
            curriculum_id: this.study_plan.schdule[this.selected_day_index]['selected_courses'][this.active_tab_index]['pk_id'],
        };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
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
    getLevels(level_id) {
        this.selected_level_number = level_id;
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
    getActiveTabContent(tab){
        if(this.task_asign_modal==true || true){
            this.active_tab_index = tab?tab.index:0;
            if(this.study_plan.schdule[this.selected_day_index]["selected_topics"][this.active_tab_index] == undefined){
                this.study_plan.schdule[this.selected_day_index]["selected_topics"][this.active_tab_index] = [];
                this.study_plan.schdule[this.selected_day_index]["selected_topics"][this.active_tab_index]["selected_topics"] = [];
            }
            if(this.study_plan.schdule[this.selected_day_index]["selected_topics_list"][this.active_tab_index] == undefined){
                this.study_plan.schdule[this.selected_day_index]["selected_topics_list"][this.active_tab_index] = [];
                this.study_plan.schdule[this.selected_day_index]["selected_topics_list"][this.active_tab_index]["selected_topics_list"] = [];
            }
            // let param = {url: "get-topics-by-curriculum", curriculum_id: this.study_plan.schdule[this.selected_day_index]['selected_courses'][this.active_tab_index]['pk_id'], search:''};
            // this.http.post(param).subscribe(res=>{
            //     this.all_topics = res['data']['topics'];
            //     this.topics = res['data']['topics'];
            //     this.selected_topics = this.study_plan.schdule[this.selected_day_index]["selected_topics"][this.active_tab_index]["selected_topics"].map(Number);
            //     this.getSelectedTopics();
            //     this.getLabels();
            // });
            this.selected_topics = this.study_plan.schdule[this.selected_day_index]["selected_topics"][this.active_tab_index]["selected_topics"].map(Number);
            if(this.selected_topics.length > 0)
            {
                this.getTopicsList();
            }
            this.getLabels();
        }
    }
    searchTpoics(search){
        let options = this.all_topics;
        this.topics = options.filter(item => item.level_name.toLowerCase().includes(search.toLowerCase()));
    }
    getSelectedTopics(){
        let selected_level_pk_id = this.selected_level[this.selected_level_number];
        let param = {url: "study-plan/get-topics-by-id", selected_topics: this.selected_topics, selected_level_pk_id: selected_level_pk_id};
        this.http.post(param).subscribe(res=>{
            if(res['error'] == false){
                this.selected_topics = res['data']['topic_ids'].map(Number);
                this.getTopicsList();
            }
        });
        
    }
    getTopicsList(){
        let param = {url: "study-plan/get-selected-topics", topics: this.selected_topics, curriculum_id: this.selected_courses[this.active_tab_index]['pk_id']};
        this.http.post(param).subscribe(res=>{
            this.study_plan.schdule[this.selected_day_index]["selected_topics"][this.active_tab_index]["selected_topics"] = this.selected_topics;
            this.study_plan.schdule[this.selected_day_index]["selected_topics_list"].splice([this.active_tab_index], 1);
            this.study_plan.schdule[this.selected_day_index]["selected_topics_list"].splice([this.active_tab_index], 0, {selected_topics_list:res['data']['selected_topics']});
            this.study_plan.schdule[this.selected_day_index]['is_test_day'] = false;
            this.selected_topics_list[this.active_tab_index] = new MatTableDataSource(res['data']['selected_topics']);
        });
    }
    removeTopic(topic_id){
        let selected_topics = this.selected_topics;
        let index = selected_topics.indexOf(topic_id);
        if(index >= 0){
            selected_topics.splice(index, 1);
            this.selected_topics = selected_topics;
            this.getTopicsList();
        }
    }
    getTasksCount(topics){
        if(topics.length>0){
            let count = 0;
            topics.forEach((topic, index) => {
                count = topic['mcqs_count']+topic['cases_count']+topic['short_answer_count']+topic['videos_count']+count;
            });
            return count;
        }
    }
    assignTest(){
        if(this.selected_day_index > 0 && this.study_plan.schdule[this.selected_day_index-1]['is_test_day'] == true){
            this.toster.error("Test not allowed for this day", "Not Allowed", {closeButton:true});
            return false;
        }
        this.study_plan.schdule[this.selected_day_index]['is_test_day'] = true;
        this.study_plan.schdule[this.selected_day_index]["selected_topics"] = [];
        this.hideTaskTestModal();
    }
    store(){
        let param = {url:"study-plan/store", study_plan_id: this.study_plan_id, study_plan_name: this.study_plan.name, course: this.study_plan.course, duration: this.study_plan.duration, schedule: this.study_plan.schdule};
        this.http.post(param).subscribe(res=>{
            if(res['error']==false){
                this.toster.success(res['message'], "Success", {closeButton:true});
                this.router.navigateByUrl("/admin/study-planner");
            }
            else{
                this.toster.error(res['message'], "Error", {closeButton:true});
            }
        })
        
    }
}
