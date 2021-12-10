import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-meeting',
    templateUrl: './create-meeting.component.html',
    styleUrls: ['./create-meeting.component.scss']
})
export class CreateMeetingComponent implements OnInit {
    public curriculum_id = 0;
    public curriculum_list = [];
    public curriculum_labels = [];
    public level_options = [];
    public all_level_options = [];
    public selected_level = [];
    public teachers = [];
    public subjects = [];
    public schedule_for = 'meeting';
    public selected_course = '';
    public selected_subject = 0;
    public meeting_topic = '';
    public teacher_id = '';
    public timezone = '';
    public start_time:any;
    public start_date:any;
    public duration = '';
    public countrys = [];
    public selected_country_id = '';
    public selected_state_id = '';
    public states = [];
    public universities = [];
    public colleges = [];
    public all_years: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_semesters: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_groups: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_universities: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_colleges: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_institutes: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_organization_list: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_college: ReplaySubject<any> = new ReplaySubject<any>(1);

    public total_years = [];
    public total_semesters = [];
    public total_groups = [];
    public total_universities = [];
    public total_colleges = [];
    public total_institutes = [];
    public total_organization_list = [];
    public total_college = [];
    institutes: any;
    organization: string;
    partner_id: any;
    years: any;
    semesters: any;
    groups: any;
    public organization_types = environment.ORGANIZATION_TYPES;
    public selected_name = '';
    public selected_value = '';
    public today_date = new Date();
    constructor(private http: CommonService, public translate: TranslateService, private toster: ToastrService, private router: Router) { 
        this.translate.setDefaultLang(this.http.lang);
    }
    ngOnInit(): void {
        this.getData();
        this.getcurriculums();
    }
    getData(){
        let param = {url: 'class/create-meeting'};
        this.http.post(param).subscribe(res=>{
            if(res['error']==false){
                this.teachers = res['data']['teachers'];
                this.countrys = res['data']['countrys'];
            }
        });
    }
    getcurriculums() {
        this.level_options = [];
        this.all_level_options = [];
        this.selected_level = [];
        this.selected_subject=0;
        this.curriculum_id = 0;
        this.curriculum_labels = [];
        let params = {
            url: 'get-courses-or-qbanks', type: 1
        };
        this.http.post(params).subscribe((res) => {
            if (res['error'] == false) {
                if (res['data']['list'].length > 0)
                    this.curriculum_list = res['data']['list'];
                else
                this.curriculum_list = [];
            }
        });
    }
    getLabels(){
        this.level_options = [];
        this.all_level_options = [];
        this.selected_level = [];
        this.selected_subject=0;
        let param = {
            url: 'get-curriculum-labels',
            curriculum_id: this.curriculum_id,
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
        this.selected_subject = this.selected_level[level_id];
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
    getStates(country_id){
        let param = {url: 'get-states', country_id: country_id};
        this.http.post(param).subscribe(res=>{
            if(res['error']==false){
                this.states = res['data']['states'];
            }
        });
    }
  public organization_type_name = '';
  public organization_list = '';
  public organization_list_id = '';
  public is_college = false;
  public college_id = '';
  public year_id = '';
  public semester_id = '';
  public group_id = '';
  public organization_type_id = '';
    onOrganizationTypeChange(){
        this.selected_name = '';
        this.selected_value = '';
        this.organization_list_id = '';
        this.year_id = '';
        this.semester_id = '';
        this.group_id = '';
        this.all_organization_list.next();
        this.all_years.next();
        this.all_semesters.next();
        this.all_groups.next();
        if(this.organization_type_id == '1'){ //University
        this.getOrganizationList(1,0);
        this.organization_type_name = 'University';
        }else if(this.organization_type_id == '2'){ //College
        this.getOrganizationList(2,0);
        this.organization_type_name = 'College';
        }else if(this.organization_type_id == '3'){ //Institute
        this.getOrganizationList(3,0);
        this.organization_type_name = 'Institute';
        }
    }
    //To get all the Universities list
    getOrganizationList(type,check){
        this.year_id = '';
        this.semester_id = '';
        this.group_id = '';
        this.is_college = false;    
        if(check == 0){ // Only University or College or Institute
        let param = { url: 'get-partners-list',partner_type_id : type };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
            this.organization_list = res['data']['partners'];
            if(this.organization_list != undefined){
                this.all_organization_list.next(this.organization_list.slice()); 
                this.total_organization_list = res['data']['partners']; 
            }
            } else {
            //this.toster.error(res['message'], 'Error');
            }   
        });
        } else { // University => college
        this.organization_list = '';
        let param = { url: 'get-partners-list',parent_id : this.organization_list_id };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.organization_list = res['data']['partners'];
                if(this.organization_list != undefined && res['data']['partners'] != ''){
                    this.all_college.next(res['data']['partners'].slice());
                    this.total_college = res['data']['partners'];
                    this.is_college = true; 
                    this.college_id = '';
                }          
            } else {
            //this.toster.error(res['message'], 'Error');
            }   
        });
        }
    }
    
  getCollege(partner,parent_id,slug){
    if(this.organization_type_id == '1'){ //University
      this.getOrganizationList(2,1);
      this.college_id = '';
    }
    this.getYearSemsterGroup(partner,parent_id,slug);
  }
    searchOrganizations(event){
        let search = event;
        if (!search) {
        this.all_organization_list.next(this.total_organization_list.slice());
        return;
        } else {
        search = search.toLowerCase();
        }
        this.all_organization_list.next(
        this.total_organization_list.filter(
            (res) => res.name.toLowerCase().indexOf(search) > -1
        )
        );
    }
    searchCollege(event){
        let search = event;
        if (!search) {
        this.all_college.next(this.total_college.slice());
        return;
        } else {
        search = search.toLowerCase();
        }
        this.all_college.next(
        this.total_college.filter(
            (res) => res.name.toLowerCase().indexOf(search) > -1
        )
        );
    }
  getYearSemsterGroup(partner,parent_id,slug){
    //console.log('partner => '+partner+', parent_id => '+parent_id+', slug => '+slug);    
    let param = { url: 'get-year-semester-group',partner_id : partner, parent_id : parent_id, slug : slug };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.years = res['data'];
        if(this.years != undefined){
          if(slug == 'year'){
            this.semester_id = '';
            this.group_id = '';
            this.all_years.next(this.years.slice());
            this.total_years=res['data'];
          }else if(slug == 'semester'){
            this.group_id = '';
            this.all_semesters.next(this.years.slice());
            this.total_semesters==res['data'];
          }else if(slug == 'group'){
            this.all_groups.next(this.years.slice());
            this.total_groups==res['data'];
          }           
        }
        //this.doFilter();
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }
    public students = [];
    public selected_students = [];
    public selected_student_ids = [];
    public all_students = [];
    public search_student = '';
    getStudents(){
        let param = {url:'class/get-students', organization_type_id: this.organization_type_id, 'selected_name':this.selected_name, 'selected_value': this.selected_value};
        this.http.post(param).subscribe((res) => {
            if(res['error'] == false){
                let students = res['data']['students'];
                this.students = [];
                this.all_students = [];
                students.forEach(element => {
                    this.students.push({id:element.id, name: element.first_name+'<'+element.email+'>'});
                    this.all_students.push({id:element.id, name: element.first_name+'<'+element.email+'>'});
                });
            }
            else{
                this.students = [];
                this.all_students = [];
            }
        })
    }
    searchStudents(search){
        let options = this.all_students;
        this.students = options.filter(
            item => item.name.toLowerCase().includes(search.toLowerCase())
        );
    }
    addStudents(){
        this.students.forEach(row=>{
            if(!this.selected_student_ids.includes(row['id'])){
                this.selected_student_ids.push(row['id']);
                this.selected_students.push({id:row['id'], name: row.name});
            }
        })
    }
    addStudent(row){
        if(!this.selected_student_ids.includes(row['id'])){
            this.selected_student_ids.push(row['id']);
            this.selected_students.push({id:row['id'], name: row.name});
        }
    }
    removeStudent(index){
        this.students.splice(index, 1);
    }
    removeSelectedStudent(index, id){
        let s_index = this.selected_student_ids.indexOf(id);console.log(s_index)
        if(s_index > -1){
            this.selected_student_ids.splice(s_index, 1);console.log(this.selected_student_ids)
        }
        this.selected_students.splice(index, 1);
    }
    createMeeting(){
        if(this.selected_students.length == 0){
            this.translate.get('admin.class.create.select_students_error_message').subscribe((data)=> {
                this.translate.get('error_text').subscribe((error_text)=> {
                    this.toster.error(data, error_text, {closeButton:true});
                });
            });
        }
        else{
            let param = {url:'class/store', schedule_for: this.schedule_for, course: this.selected_subject, meeting_topic: this.meeting_topic, teacher_id: this.teacher_id, timezone: this.timezone, start_date: this.start_date, start_time: this.start_time, duration: this.duration, students: this.selected_students};
            this.http.post(param).subscribe(res=>{
                if(res['error'] == false){
                    this.translate.get('success_text').subscribe((success_text)=> {
                        this.translate.get('admin.class.edit.create_success').subscribe((message)=> {
                            this.toster.success(message, success_text, {closeButton:true});
                        });
                    });
                    this.router.navigateByUrl('/admin/class/list');
                }
                else{
                    this.translate.get('something_went_wrong_text').subscribe((data)=> {
                        this.translate.get('error_text').subscribe((error_text)=> {
                            this.toster.error(data, error_text, {closeButton:true});
                        });
                    })
                }
            });
        }
    }
}
