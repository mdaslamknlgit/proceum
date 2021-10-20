import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-study-planner-student',
  templateUrl: './study-planner-student.component.html',
  styleUrls: ['./study-planner-student.component.scss']
})
export class StudyPlannerStudentComponent implements OnInit {
    public show_details_modal = false;
    public courses = [];
    public selected_courses = [];
    public selected_course = [];
    public selected_day_index = 0;
    public study_plan = {name:'', course:[], duration:0, schdule:[]};
    public study_plan_id = 6;
    public pageSize = environment.page_size;
    public page_size_options = environment.page_size_options;
    public totalSize = 0;
    public page: number = 0;
    public plans_list = [];
    public topics = [];
  constructor(private http: CommonService,private toster: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.getPlansList();
    }
    getPlansList(){
        let param = {
            url: 'study-plan/list',
            offset: 0,
            limit: this.pageSize
        };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.plans_list = res['data']['plans_list'];
                if(this.plans_list.length>0){
                    this.getStudyPlan(this.plans_list[0]['id']);
                }
                this.totalSize = res['data']['total_records'];
            }
        });
    }
    getStudyPlan(study_plan_id){
        this.study_plan_id = study_plan_id;
        let param = {url: "study-plan/get-study-plan/"+study_plan_id};
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
                this.toster.error(res['message'], "Error", {closeButton:true});
                this.study_plan.schdule = [];
            }
        });
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
    showDetails(topics, course, course_index, day_index){
        if(topics[course_index]['selected_topics'][0].length==0){
            return false;
        }
        console.log(topics, course);
        console.log(course_index);
        this.selected_day_index = day_index;
        this.selected_course = course;
        let param = {url: "study-plan/get-topics", topics:topics[course_index]['selected_topics'], curriculum_id: course['pk_id']};
        this.http.post(param).subscribe(res=>{
            if(res['error'] == false){
                this.topics = res['data']['selected_topics'];
            }
            else{
                this.toster.error(res['message'], "Error", {closeButton:true});
                this.study_plan.schdule = [];
            }
        });
        this.show_details_modal = true;
    }
    hideDetails(){
        this.show_details_modal = false;
    }
    getTest(day){alert(day)
        let param = {url: "study-plan/get-test-questions", day:day, plan_id: this.study_plan_id};
        this.http.post(param).subscribe(res=>{
            if(res['error'] == false){
                
            }
            else{
                this.toster.error(res['message'], "Error", {closeButton:true});
                this.study_plan.schdule = [];
            }
        });
    }
}
