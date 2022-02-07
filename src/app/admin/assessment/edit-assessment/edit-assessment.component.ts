import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-edit-assessment',
  templateUrl: './edit-assessment.component.html',
  styleUrls: ['./edit-assessment.component.scss']
})
export class EditAssessmentComponent implements OnInit {
  public dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['Subject', 'Chapter', 'Topic', 'Count'];

  public assessment_id = null;
  public assessment_key = null;
  
  public assessment_types = [];
  public assessment_name = '';
  public assessment_type = '';
  public timezone = '';
  public start_date = '';
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
  public selected_student_ids = [];
  public all_students = [];
  public search_student = '';

  public user_id = 0;
  public role_id = 0;
  public college_institute_id = 0;
  public user = [];
  public org_type = '';
  constructor(private http: CommonService, public translate: TranslateService, private toster: ToastrService, private router: Router,private activeRoute: ActivatedRoute,) {
    this.translate.setDefaultLang(this.http.lang);
   }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((routeParams) => {
      this.assessment_id = routeParams.id;
      this.assessment_key = routeParams.key;
      this.getAssesment();
    });
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
        this.getYearSemsterGroup(2,0,'year');
      }
      if(this.role_id == environment.ALL_ROLES.INSTITUTE_ADMIN){  /// Institute Admin Role ID
        this.is_college = false;
        this.is_university = false;
        this.organization_type_name = 'Institute';
        this.organization_list_id = this.user['partner_id'];
        this.organization_type_id = '3';
        this.getYearSemsterGroup(3,0,'year');
      }
      if(this.role_id == environment.ALL_ROLES.UNIVERSITY_COLLEGE_ADMIN){  /// University College Admin Role ID
        this.is_college = false;
        this.is_university = false;
        this.organization_list_id = this.user['partner_id'];
        this.organization_type_id = '1';
        this.getYearSemsterGroup(1,0,'year');
      }      
    }
    this.assessmentTypes();
  }

  getAssesment(){
    //let param = { url: 'assessment/show/' + this.assessment_id, };
    let param = {url: 'assessment/show', assessment_id: this.assessment_id,assessment_key: this.assessment_key};
    this.http.post(param).subscribe((res) => {
      //console.log(res);
      if (res['error'] == false) {
        if(res['data']['topics'].length > 0){
          this.selected_topics = res['data']['topics'];
          this.dataSource = new MatTableDataSource(this.selected_topics);
          let assessmentDetails = res['data']['assessmentDetails'];
          this.assessment_name = assessmentDetails['assessment_name'];
          this.assessment_type = assessmentDetails['assessment_type'];
          this.timezone = assessmentDetails['timezone'];
          this.start_date = assessmentDetails['start_date'];
          this.start_time = assessmentDetails['start_time'];
          this.question_duration = assessmentDetails['time_per_question'];
          this.question_total = assessmentDetails['total_questions_count'];
          let students = res['data']['selectedStudents'];
          students.forEach(element => {
            if(!this.selected_student_ids.includes(element.student_id)){
            this.selected_students.push({id:element.student_id, name: element.first_name+'<'+element.email+'>'});
            this.selected_student_ids.push(element.student_id);
            }
        });
        }
      }else{
        this.router.navigateByUrl('/admin/assessment-list');
        this.toster.error(res['message'], "Error", { closeButton:true });
      }
    });
  }

  getTeacherCollegeInstitute(){
    let params = {
      url: 'assessment/get-teacher-details', user_id: this.user_id
    };
    this.http.post(params).subscribe((res) => {
      //console.log(res['user_details']);
      if (res['error'] == false) {
        if(res['user_details']['college_id'] != null){
          this.college_id = this.college_institute_id = res['user_details']['college_id'];
          this.getYearSemsterGroup('1',0,'year');
          this.org_type = '1';
        }
        if(res['user_details']['institute_id'] != null){
          this.organization_list_id = this.college_institute_id = res['user_details']['institute_id'];
          this.getYearSemsterGroup('3',0,'year');
          this.org_type = '3';
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
              this.total_organization_list = res['data']['partners']; 
          }
        } else {
          //this.toster.error(res['message'], 'Error');
        }   
    });
    } else { // University => college
      this.college_list = [];
      this.is_college = true;
      //let param = { url: 'get-partners-list',parent_id : this.organization_list_id };
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
      this.getOrganizationList(2,1);
      this.college_id = '';
      this.all_college.next();      
    }else{
      this.getYearSemsterGroup(org_type,parent_id,slug);
    }
  }

  getYearSemsterGroup(org_type,parent_id,slug){
    // let partner = '';
    // if(org_type == '1'){
    //   partner = this.college_id;
    // }
    // else if(org_type == '3'){
    //   partner = this.organization_list_id;
    // }
    // else if(this.role_id == 12){
    //   partner = String(this.college_institute_id);
    // }
    // let param = { url: 'get-year-semester-group',partner_id : partner, parent_id : parent_id, slug : slug };
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
      partner_child_id = "";
    }
    else if(this.role_id == environment.ALL_ROLES.TEACHER){
      partner = String(this.college_institute_id);
      org_type = this.org_type;
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
      this.all_organization_list.next(this.total_organization_list.slice());
    return;
    } else {
      search = search.toLowerCase();
    }
    this.all_organization_list.next(
      this.total_organization_list.filter(
          (total_organization_list) => total_organization_list.organization_name.toLowerCase().indexOf(search) > -1
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

  addStudent(row){
    if(!this.selected_student_ids.includes(row['id'])){
        this.selected_student_ids.push(row['id']);
        this.selected_students.push({id:row['id'], name: row.name});
    }
  }
  removeSelectedStudent(index, id){
    let s_index = this.selected_student_ids.indexOf(id);
    if(s_index > -1){
      this.selected_student_ids.splice(s_index, 1);
    }
    this.selected_students.splice(index, 1);
  }

  addStudents(){
    this.students.forEach(row=>{
        if(!this.selected_student_ids.includes(row['id'])){
            this.selected_student_ids.push(row['id']);
            this.selected_students.push({id:row['id'], name: row.name});
        }
    })
  }
  removeStudent(index){
      this.students.splice(index, 1);
  }

  EditAssessment(){
    if(this.question_total <= 0){
      this.translate.get('admin.assessment.edit.please_select_course_text').subscribe((data)=> {
        this.toster.error(data, "Error", {closeButton:true});
      });
      return;
    }else if(this.selected_students.length == 0){
      this.translate.get('admin.assessment.edit.select_students_error_message').subscribe((data)=> {
        this.translate.get('error_text').subscribe((error_text)=> {
          this.toster.error(data, error_text, {closeButton:true});
        });
      });        
    }
    else{
      let param = {url:'assessment/update', students: this.selected_students, assessment_id: this.assessment_id,assessment_key: this.assessment_key};
      this.http.post(param).subscribe(res=>{
        if(res['error'] == false){
            this.translate.get('success_text').subscribe((success_text)=> {
              this.translate.get('admin.assessment.edit.update_success').subscribe((message)=> {
                  this.toster.success(message, success_text, {closeButton:true});
              });
            });

            this.router.navigateByUrl('/admin/assessment-list');
        }
        else{
            this.router.navigateByUrl('/admin/assessment-list');
            this.toster.error(res['message'], "Error", { closeButton:true });
        }
      });
    }
  }

}
