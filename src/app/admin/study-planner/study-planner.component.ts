import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'}];



@Component({
  selector: 'app-study-planner',
  templateUrl: './study-planner.component.html',
  styleUrls: ['./study-planner.component.scss']
})
export class StudyPlannerComponent implements OnInit {
    displayedColumns: string[] = ['SNo', 'Topic', 'MCQ', 'Cases', 'Shortans', 'Videos', 'Actions'];
    dataSource = ELEMENT_DATA;
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
            this.courses = res['data']['list'];
            this.all_courses = res['data']['list'];
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
                for(let i=0; i<= (this.study_plan.duration-1); i++){
                    let day = {pk_id:0, day:i+1, is_test_day:false, selected_courses: this.selected_courses, selected_topics:[], selected_topics_list:[]};
                    this.study_plan.schdule[i] = day;
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
            let param = {url: "get-topics-by-curriculum", curriculum_id: this.study_plan.schdule[this.selected_day_index]['selected_courses'][this.active_tab_index]['pk_id'], search:''};
            this.http.post(param).subscribe(res=>{
                this.all_topics = res['data']['topics'];
                this.topics = res['data']['topics'];
                this.selected_topics = this.study_plan.schdule[this.selected_day_index]["selected_topics"][this.active_tab_index]["selected_topics"];
                this.getSelectedTopics();
            });
        }
    }
    searchTpoics(search){
        let options = this.all_topics;
        this.topics = options.filter(item => item.level_name.toLowerCase().includes(search.toLowerCase()));
    }
    getSelectedTopics(){
        if(this.selected_topics.length > 0)
        {
            let param = {url: "study-plan/get-selected-topics", topics: this.selected_topics, curriculum_id: this.selected_courses[this.active_tab_index]['pk_id']};
            this.http.post(param).subscribe(res=>{
                this.study_plan.schdule[this.selected_day_index]["selected_topics"][this.active_tab_index]["selected_topics"] = this.selected_topics;
                //this.study_plan.schdule[this.selected_day_index]["selected_topics_list"][this.active_tab_index]["selected_topics_list"] = res['data']['selected_topics'];
                this.study_plan.schdule[this.selected_day_index]["selected_topics_list"].splice([this.active_tab_index], 1);
                this.study_plan.schdule[this.selected_day_index]["selected_topics_list"].splice([this.active_tab_index], 0, {selected_topics_list:res['data']['selected_topics']});
                this.study_plan.schdule[this.selected_day_index]['is_test_day'] = false;
                this.selected_topics_list[this.active_tab_index] = new MatTableDataSource(res['data']['selected_topics']);
            });   
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
        this.study_plan.schdule[this.selected_day_index]['is_test_day'] = true;
        this.study_plan.schdule[this.selected_day_index]["selected_topics"] = [];
        this.hideTaskTestModal();
    }
    store(){
        let schedule = this.study_plan.schdule;
        console.log(schedule);
        schedule.forEach(res=>{
            console.log(res)
        });
        setTimeout(res=>{
            let param = {url:"study-plan/store", study_plan_name: this.study_plan.name, course: this.study_plan.course, duration: this.study_plan.duration, schedule: this.study_plan.schdule, study_plan:this.study_plan, schedule_json: JSON.stringify(this.study_plan.schdule)};
            this.http.post(param).subscribe(res=>{

        })
        },1000)
        
    }
}
