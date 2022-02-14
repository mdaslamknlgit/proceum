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
    public study_plan_id = 0;
    public pageSize = environment.page_size;
    public page_size_options = environment.page_size_options;
    public totalSize = 0;
    public page: number = 0;
    public plans_list = [];
    public topics = [];
    public user_data = [];
    public is_loaded = false;
  constructor(private http: CommonService,private toster: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param) => {
            this.study_plan_id = param.plan_id;
            if(this.study_plan_id != null && this.study_plan_id >0)
                this.getStudyPlan(this.study_plan_id);
        });
        
        this.user_data = this.http.getUser();
        this.getPlansList();
    }
    getPlansList(){
        this.is_loaded = false;
        let param = {
            url: 'study-plan/individual-list',
            offset: 0,
            limit: this.pageSize
        };console.log(this.user_data['role'])
        if(parseInt(this.user_data['role']) == environment.ALL_ROLES.STUDENT){
            param.url = "study-plan/list";
        }
        this.http.post(param).subscribe((res) => {
            this.is_loaded = true;
            if (res['error'] == false) {
                this.plans_list = res['data']['plans_list'];
                if(this.plans_list.length>0 && this.study_plan_id == null || this.study_plan_id == 0){
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
    startTest(day){
        this.router.navigateByUrl('/student/study-planner/test/'+day+"/"+this.study_plan_id);
    }
    markAsDayComplete(day){
        let param = {url: "study-plan/day-complete", day: day, student_id: this.user_data['id'], plan_id: this.study_plan_id};
        this.http.post(param).subscribe(res=>{
            if(res['error'] == false){
                this.toster.success(res['message'], "Success", {closeButton:true});
                this.study_plan.schdule[day-1]['is_done'] = true;
            }
            else{
                this.toster.error(res['message'], "Error", {closeButton:true});
            }
        });
    }
}
