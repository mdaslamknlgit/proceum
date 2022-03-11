import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit {
  constructor(private http: CommonService,public translate: TranslateService) {
    this.translate.setDefaultLang(this.http.lang);
  }
  public students_count = 0;
  public assessments_conducted = 0;
  public classes_conducted = 0;
  public user_id = 0;
  public role_id = 0;
  public user = [];
  public college_institute_id = 0;
  public college_id = '';
  public org_type = '';
  public organization_type_id = '';
  public organization_list_id = '';
  public levels = [];

  ngOnInit(): void {
    this.user = this.http.getUser();
    this.user_id = this.user['id'];
    this.role_id = this.user['role'];
    this.getTeacherCollegeInstitute();
    this.assessmentsConducted();
    this.classesConducted();
    this.mySubjectsList();
  }

  getTeacherCollegeInstitute(){
    let params = {
      url: 'assessment/get-teacher-details', user_id: this.user_id
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        if(res['user_details']['university_id'] != null){
          this.college_institute_id = res['user_details']['university_id'];
          this.college_id = res['user_details']['college_id'];
          this.org_type = this.organization_type_id = '1';
        }else if(res['user_details']['college_id'] != null){
          this.college_id = this.college_institute_id = res['user_details']['college_id'];
          this.org_type = this.organization_type_id = '2';
        }else if(res['user_details']['institute_id'] != null){
          this.organization_list_id = this.college_institute_id = res['user_details']['institute_id'];
          this.org_type = this.organization_type_id = '3';
        }
        this.studentsCount();
      }
    });
  }

  public studentsCount() {
    let param = { 
      url: 'get-user-list',
      offset: 0,
      limit: 10,
      role: '' ,
      search: '' ,
      list_type_id: this.organization_type_id,
      organization: this.role_id != 12?this.organization_list_id:this.college_institute_id,
      college_id: this.college_id,
      year: '',
      semester: '',
      group: '',
      is_admin_specific_role : '1',
      role_id:this.role_id
    };
    this.http.post(param).subscribe((res) => {    
      if (res['error'] == false) {
        this.students_count = res['total_records'];
      }
    });
  }

  public assessmentsConducted(){
    let param = { 
      url: 'assessment/get-list', 
      offset: 0,
      limit: 10,
      role:this.role_id,
      user:this.user_id,
      created_by_id:'',
      assessment_date: '',
      search_txt: ''
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.assessments_conducted = res['assessments_count'];
      }     
    });
  }

  public classesConducted(){
    let param = {url: 'class/list', type: '', limit: 10, offset: 0};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
          this.classes_conducted = res['data']['total_records'];
      }
    });
  }

  public mySubjectsList(){
    let param = {
      url: 'class/get-teacher-subjects',
      user_id: this.user['id'],
      search: '',
      offset: 0,
      limit: 30,
      tab: 'all',
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.levels = data['subjects'];
      }
    });
  }

}
