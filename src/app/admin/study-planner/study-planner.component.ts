import { Component, OnInit } from '@angular/core';
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
    constructor(private http: CommonService) { }
    ngOnInit(): void {
        this.getCourses();
    }
    getCourses(){
        let param = {url: "get-courses-or-qbanks", type:1};
        this.http.post(param).subscribe(res=>{
            this.courses = res['data']['list'];
            this.all_courses = res['data']['list'];
        });
    }
    searchCourses(search){
        let options = this.all_courses;
        this.courses = options.filter(item => item.curriculumn_name.toLowerCase().includes(search.toLowerCase()));
    }
    setDuration(){
        if(this.study_plan.course.length > 0){
            let param = {url: "get-courses-by-ids", ids: this.study_plan.course};
            this.http.post(param).subscribe(res=>{
                this.selected_courses = res['data']['courses'];
                for(let i=0; i<= this.study_plan.duration; i++){
                    let day = {day:i+1, courses: this.selected_courses};
                    this.study_plan.schdule[i] = day;
                }
            });
        }
    }
    showTaskTestModal(index){
        this.task_test_modal = true;
    }
    hideTaskTestModal(){
        this.task_test_modal = false;
    }
    showTaskAssignModal(){
        this.task_asign_modal = true;
    }
    hideTaskAssignModal(){
        this.task_asign_modal = false;
    }
    store(){
        console.log(this.study_plan.schdule)
        let param = {url:"study-plan/store", study_plan_name: this.study_plan.name, course: this.study_plan.course, duration: this.study_plan.duration};
        this.http.post(param).subscribe(res=>{

        })
    }
}
