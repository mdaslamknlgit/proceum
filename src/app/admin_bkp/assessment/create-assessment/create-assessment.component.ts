import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject } from 'rxjs';

export interface PeriodicElement {
  Subject: string;
  Chapter: string;
  Topic: string;
  Count: string;
  Action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {Subject: 'Subject', Chapter: 'Chapter', Topic: 'Topic', Count: 'Count', Action: 'Action'},
];



@Component({
  selector: 'app-create-assessment',
  templateUrl: './create-assessment.component.html',
  styleUrls: ['./create-assessment.component.scss']
})
export class CreateAssessmentComponent implements OnInit {
  public dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['Subject', 'Chapter', 'Topic', 'Count', 'Action'];
  //dataSource = ELEMENT_DATA;

  public curriculum_id = 0;
  public curriculum_list = [];
  public curriculum_labels = [];
  public level_options = [];
  public all_level_options = [];
  public selected_level = [];
  public selected_subject = 0;

  public assessment_types = [];//environment.ASSESSMENT_TYPES;
  public assessment_name = '';
  public assessment_type = '';
  public timezone = '';
  public start_date = '';
  public minDate = new Date();
  public start_time = '';
  public question_duration = '';
  public questions_count = 0;
  public total_count = 0;
  public question_total = 0;

  public selected_topics = [];
  public is_topic_exist = false;
  public selected_topic = '';
  public selected_course = '';
  public level_id = 0;

  public organization_types = environment.ORGANIZATION_TYPES;
  public selected_name = '';
  public selected_value = '';
  public organization_list_id = '';
  public year_id = '';
  public semester_id = '';
  public group_id = '';
  public organization_type_id = '';
  public organization_type_name = '';
  public is_university = true;
  public is_college = false;
  public organization_list = [];
  public college_list = [];

  public all_years: ReplaySubject<any> = new ReplaySubject<any>(1);
  public all_semesters: ReplaySubject<any> = new ReplaySubject<any>(1);
  public all_groups: ReplaySubject<any> = new ReplaySubject<any>(1);
  public all_universities: ReplaySubject<any> = new ReplaySubject<any>(1);
  public all_colleges: ReplaySubject<any> = new ReplaySubject<any>(1);
  public all_institutes: ReplaySubject<any> = new ReplaySubject<any>(1);
  public all_organization_list: ReplaySubject<any> = new ReplaySubject<any>(1);
  public all_college: ReplaySubject<any> = new ReplaySubject<any>(1);

  public total_organization_list = [];
  public total_college = [];
  public total_years = [];
  public total_semesters = [];
  public total_groups = [];
  public college_id = '';
  years: any;
  public show_semester_dropdown = true;
  public show_group_dropdown = true;

  public students = [];
  public selected_students = [];
  public selected_students_list = [];
  public selected_student_ids = [];
  public all_students = [];
  public search_student = '';
  public search_selected_student = '';

  public user_id = 0;
  public role_id = 0;
  public college_institute_id = 0;
  public user = [];
  public org_type = '';
  constructor(private http: CommonService, public translate: TranslateService, private toster: ToastrService, private router: Router,) {
    this.translate.setDefaultLang(this.http.lang);
   }

  ngOnInit(): void {
    this.user = this.http.getUser();
    this.user_id = this.user['id'];
    this.role_id = this.user['role'];
    if(this.role_id == environment.ALL_ROLES.TEACHER){  /// Teacher Role ID
      this.getTeacherCollegeInstitute();
      this.is_college = false;
      this.is_university = false;
    }else{
      if(this.role_id == environment.ALL_ROLES.UNIVERSITY_ADMIN){  /// University Admin Role ID
        this.is_college = true;
        this.is_university = false;
        this.organization_type_name = 'College';
        this.college_id = this.user['partner_id'];
        this.organization_type_id = '1';
        this.getOrganizationList(1,1);
      }
      if(this.role_id == environment.ALL_ROLES.COLLEGE_ADMIN){  /// College Admin Role ID
        this.is_college = false;
        this.is_university = false;
        this.organization_type_name = 'College';
        this.organization_list_id = this.user['partner_id'];
        this.organization_type_id = '2';
        this.getYearSemsterGroup('',0,'year');
      }
      if(this.role_id == environment.ALL_ROLES.INSTITUTE_ADMIN){  /// Institute Admin Role ID
        this.is_college = false;
        this.is_university = false;
        this.organization_type_name = 'Institute';
        this.organization_list_id = this.user['partner_id'];
        this.organization_type_id = '3';
        this.getYearSemsterGroup('',0,'year');
      }
      if(this.role_id == environment.ALL_ROLES.UNIVERSITY_COLLEGE_ADMIN){  /// University College Admin Role ID
        this.is_college = false;
        this.is_university = false;
        this.organization_list_id = this.user['partner_id'];
        this.organization_type_id = '1';
        this.getYearSemsterGroup('',0,'year');
      }      
    }
    this.assessmentTypes();
    this.getcurriculums();

    let d = new Date();
    d.setDate(d.getDate() + 1);
    this.minDate = new Date();
  }

  getTeacherCollegeInstitute(){
    let params = {
      url: 'assessment/get-teacher-details', user_id: this.user_id
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        if(res['user_details']['university_id'] != null){
          this.college_id = this.college_institute_id = res['user_details']['college_id'];
          this.org_type = '1';
          this.getYearSemsterGroup('',0,'year');          
        }else if(res['user_details']['college_id'] != null){
          this.college_id = this.college_institute_id = res['user_details']['college_id'];
          this.org_type = '2';
          this.getYearSemsterGroup('',0,'year');          
        }else if(res['user_details']['institute_id'] != null){
          this.organization_list_id = this.college_institute_id = res['user_details']['institute_id'];
          this.org_type = '3';
          this.getYearSemsterGroup('',0,'year');          
        }
      }
    });
  }

  assessmentTypes(){
    this.assessment_types = [];
    let params = {
      url: 'assessment/get-types', status: 1
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        if (res['data']['list'].length > 0)
          this.assessment_types = res['data']['list'];
        else
          this.assessment_types = [];
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
      url: 'assessment/get-curriculums-list', usage_type: 2, addon_type: 2, assessment_type: 1
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        if (res['data']['list'].length > 0){
          this.curriculum_list = res['data']['list'];
        }          
        else{
          this.curriculum_list = [];
          this.translate.get('admin.assessment.create.qbank_list_err').subscribe((data)=> {
            this.toster.error(data, "Error", {closeButton:true});
          });
        }
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
    this.is_topic_exist = false;
    this.selected_subject = this.selected_level[level_id];
    let param = {
      url: 'get-levels-by-level',
      step_id: this.selected_level[level_id],
      get_q_count:true,
      assessment:true,
      assessment_value: 1
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
          let data = res['data'];
          this.total_count = data['q_count'];
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
    this.curriculum_list.forEach(res=>{
        if(res['pk_id'] == args)
        this.selected_course = res['curriculumn_name'];
    })
  }
  addQuestionCount(){
    if(this.questions_count <= 0){
      this.translate.get('admin.assessment.create.questions_count_error_msg').subscribe((data)=> {
        this.toster.error(data, "Error", {closeButton:true});
      });
      return;
    }
    if(this.total_count < this.questions_count){
      this.translate.get('admin.assessment.create.questions_count_error_msg1').subscribe((data)=> {
        this.toster.error(data, "Error", {closeButton:true});
      });
      return;
    }
    this.selected_topics.forEach(res => {
      if(res['course_qbank'] == this.curriculum_id && res['topic'] == this.selected_subject){
          this.translate.get('admin.assessment.create.topic_exists_error_msg').subscribe((data)=> {
            this.toster.error(data, "Error", {closeButton:true});
          });
          this.is_topic_exist = true;
          return false;
      }
    })
    if(this.is_topic_exist != true){
      let param = {url: "get-topic-path", curriculum_id: this.curriculum_id, topic_id: this.selected_subject};
      this.http.post(param).subscribe((res) => {
          if (res['error'] == false) {
              if(this.questions_count > 0){
                let data = {pk_id:0, course_qbank:this.curriculum_id, course_qbank_text: this.selected_course, topic:this.selected_subject, topic_text: res['data']['path'], is_delete:0, questions_count:this.questions_count};
                this.selected_topics.push(data);
                this.dataSource = new MatTableDataSource(this.selected_topics);
                this.question_total = Number(this.questions_count)+Number(this.question_total);
                // this.curriculum_id = 0;
                // this.selected_course = '';
                // this.selected_topic = '';
                // this.level_options = [];
                // this.all_level_options = [];
                // this.selected_level = [];
                // this.level_id=0;
                // this.curriculum_labels = [];   
                this.questions_count = 0;
                // this.total_count = 0;
              } 
          }
      });
    }
  }

  removeTopic(index){
    let cnt = this.selected_topics[index]['questions_count'];
    this.selected_topics.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.selected_topics);
    this.question_total = Number(this.question_total)-Number(cnt);
  }

  onOrganizationTypeChange(){
    this.selected_name = '';
    this.selected_value = '';
    this.organization_list_id = '';
    this.college_id = '';
    this.year_id = '';
    this.semester_id = '';
    this.group_id = '';
    this.all_organization_list.next();
    this.all_college.next();
    this.all_years.next();
    this.all_semesters.next();
    this.all_groups.next();
    if(this.organization_type_id == '1'){ //University
      this.getOrganizationList(1,0);
      this.organization_type_name = 'University';
      this.is_college = true;
    }
    else if(this.organization_type_id == '2'){ //College
      this.getOrganizationList(2,0);
      this.organization_type_name = 'College';
    }
    else if(this.organization_type_id == '3'){ //Institute
      this.getOrganizationList(3,0);
      this.organization_type_name = 'Institute';
      this.is_college = false;
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
          }
        } else {
          //this.toster.error(res['message'], 'Error');
        }   
    });
    } else { // University => college
      this.college_list = [];
      this.is_college = true;
      let param = { url: 'get-partner-childs',child_type : type, partner_id : this.organization_list_id}
      this.http.post(param).subscribe((res) => {
          if (res['error'] == false) {
              this.college_list = res['data']['partners'];
              if(this.college_list != undefined && res['data']['partners'] != ''){
                  this.all_college.next(this.college_list.slice());
                  this.college_id = '';
              }          
          } else {
          //this.toster.error(res['message'], 'Error');
          }   
      });
    }
  }

  getCollege(org_type,parent_id,slug){
    this.show_semester_dropdown = true;
    this.show_group_dropdown = true;
    this.year_id = '';
    this.semester_id = '';
    this.group_id = '';
    this.all_years.next();
    this.all_semesters.next();
    this.all_groups.next();
    if(org_type == '1'){ //University
      this.getOrganizationList(1,1);
      this.college_id = '';
      this.all_college.next();      
    }else{
      this.getYearSemsterGroup(org_type,parent_id,slug);
    }
  }

  getYearSemsterGroup(org_type,parent_id,slug){
    let partner = '';let partner_child_id = "";
    if(org_type == '1'){
      if(this.is_college == true){
        partner_child_id = this.college_id;
        partner = this.organization_list_id;
      }else{
        partner = this.organization_list_id;
      }
    }
    else if(org_type == '2'){
      partner = this.organization_list_id;
    }
    else if(org_type == '3'){
      partner = this.organization_list_id;
    }
    else if(this.role_id == environment.ALL_ROLES.UNIVERSITY_ADMIN){
      partner = String(this.user_id);
      org_type = 1;
      partner_child_id = this.college_id;
    }
    else if(this.role_id == environment.ALL_ROLES.COLLEGE_ADMIN){
      partner = String(this.user_id);
      org_type = 2;
    }
    else if(this.role_id == environment.ALL_ROLES.INSTITUTE_ADMIN){
      partner = String(this.user_id);
      org_type = 3;
    }
    else if(this.role_id == environment.ALL_ROLES.UNIVERSITY_COLLEGE_ADMIN){
      partner = this.user['partner_id'];
      org_type = 1;
      partner_child_id = this.user['partner_child_id'];
    }
    else if(this.role_id == environment.ALL_ROLES.TEACHER){
      partner = this.user['partner_id'];
      org_type = this.org_type;
      if(this.org_type == '1'){        
        partner_child_id = String(this.college_institute_id);//this.user['partner_child_id'];
      }
    } 
    let param = {
      url: 'get-year-semester-group',
      partner_id : partner,
      parent_id : parent_id,
      slug : slug,
      partner_type_id: org_type,
      partner_child_id: partner_child_id
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.years = res['data'];
        if(this.years != undefined){
          if(slug == 'year'){
            this.semester_id = '';
            this.group_id = '';
            this.all_semesters.next();
            this.all_groups.next();
            this.all_years.next(this.years.slice());
            this.total_years=res['data'];
          }else if(slug == 'semester'){
            this.group_id = '';
            this.semester_id = '';
            this.all_groups.next();
            this.all_semesters.next(this.years.slice());
            this.total_semesters==res['data'];
            this.show_semester_dropdown = true;
            if(this.years.length == 0){
              this.getYearSemsterGroup(org_type,parent_id,'group');
              this.show_semester_dropdown = false;
            }
          }else if(slug == 'group'){
            this.all_groups.next(this.years.slice());
            this.total_groups==res['data'];
            this.show_group_dropdown = true;
            if(this.years.length == 0){
              this.show_group_dropdown = false;
            }
          }           
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  searchOrganizations(event){
    let search = event;
    if (!search) {
      this.all_organization_list.next(this.organization_list.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_organization_list.next(
      this.organization_list.filter(
        (organization_list) => organization_list.organization_name.toLowerCase().indexOf(search) > -1
      )
    );
  }
  searchCollege(event){
    let search = event;
    if (!search) {
      this.all_college.next(this.college_list.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_college.next(
      this.college_list.filter(
        (college_list) => college_list.partner_name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  getStudents(){
    let param = {url:'class/get-students', organization_type_id: this.organization_type_id, 'selected_name':this.selected_name, 'selected_value': this.selected_value};
    this.http.post(param).subscribe((res) => {
        if(res['error'] == false){
            let students = res['data']['students'];
            this.students = [];
            this.all_students = [];
            students.forEach(element => {
                this.students.push({id:element.id, name: element.first_name+ ' ' +'<'+element.email+'>'});
                this.all_students.push({id:element.id, name: element.first_name+ ' ' +'<'+element.email+'>'});
            });
        }
        else{
            this.translate.get('no_records_found_text').subscribe((data)=> {
              this.toster.error(data, "Error", {closeButton:true});
            });
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

  searchSelectedStudents(search){
    let options = this.selected_students_list;
    this.selected_students = options.filter(
        item => item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  addStudent(row){
    if(!this.selected_student_ids.includes(row['id'])){
        this.selected_student_ids.push(row['id']);
        this.selected_students_list.push({id:row['id'], name: row.name});
        this.selected_students.push({id:row['id'], name: row.name});
    }
  }
  removeSelectedStudent(index, id){
    let s_index = this.selected_student_ids.indexOf(id);
    if(s_index > -1){
      this.selected_student_ids.splice(s_index, 1);
    }
    this.selected_students.splice(index, 1);
    this.selected_students_list.splice(index, 1);
  }

  addStudents(){
    this.students.forEach(row=>{
        if(!this.selected_student_ids.includes(row['id'])){
            this.selected_student_ids.push(row['id']);
            this.selected_students_list.push({id:row['id'], name: row.name});
            this.selected_students.push({id:row['id'], name: row.name});
        }
    })
  }
  removeStudent(index){
      this.students.splice(index, 1);
  }

  CreateAssessment(){
    if(this.question_total <= 0){
      this.translate.get('admin.assessment.create.please_select_course_text').subscribe((data)=> {
        this.toster.error(data, "Error", {closeButton:true});
      });
      return;
    }else if(this.question_total > 300){
      this.translate.get('admin.assessment.create.question_count_error_msg').subscribe((data)=> {
        this.toster.error(data, "Error", {closeButton:true});
      });
      return;
    }else if(this.selected_students.length == 0){
      this.translate.get('admin.assessment.create.select_students_error_message').subscribe((data)=> {
        this.translate.get('error_text').subscribe((error_text)=> {
          this.toster.error(data, error_text, {closeButton:true});
        });
      });
      return;        
    }
    else{
      let param = {url:'assessment/store',assessment_name: this.assessment_name,assessment_type: this.assessment_type,timezone: this.timezone,
      start_date: this.start_date, start_time: this.start_time,duration: this.question_duration,question_total:this.question_total,
      course:this.selected_topics,students: this.selected_students,assessment_value: 1,role:this.role_id,user:this.user_id,domain:location.origin}; //course: this.selected_subject,
      this.http.post(param).subscribe(res=>{
          if(res['error'] == false){
            this.translate.get('success_text').subscribe((success_text)=> {
              this.translate.get('admin.assessment.create.create_success').subscribe((message)=> {
                  this.toster.success(message, success_text, {closeButton:true});
              });
            });
            if(this.role_id == 12){
              this.router.navigateByUrl('/teacher/assessment-list');
            }else{
              this.router.navigateByUrl('/admin/assessment-list');
            } 
          }
          else{
            this.translate.get('something_went_wrong_text').subscribe((data)=> {
              this.translate.get('error_text').subscribe((error_text)=> {
                  this.toster.error(data, error_text, {closeButton:true});
              });
            })
              //this.toster.error(res['message'], "Error", { closeButton:true });
          }
      });
    }
  }

}
