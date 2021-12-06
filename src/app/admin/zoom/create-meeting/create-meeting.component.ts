import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
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
    institutes: any;
    year_id: string;
    semester_id: string;
    group_id: string;
    organization: string;
    partner_id: any;
    years: any;
    semesters: any;
    groups: any;
    public organization_types = environment.ORGANIZATION_TYPES;
    constructor(private http: CommonService, public translate: TranslateService) { 
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
      //To get all the Universities list
    getUniversities(){
        let param = { url: 'get-partners-list',partner_type_id : 1 };
        this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
            this.universities = res['data']['partners'];
            if(this.universities != undefined){
            this.all_universities.next(this.universities.slice()); 
            }
        } else {
            //this.toster.error(res['message'], 'Error');
        }
        });
    }

  filterUniversity(event) {
    let search = event;
    if (!search) {
      this.all_universities.next(this.universities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_universities.next(
      this.universities.filter(
        (university) => university.name.toLowerCase().indexOf(search) > -1
      )
    );
  }
  
  //To get all college list
  getColleges(){
    let param = { url: 'get-partners-list',partner_type_id : 2 };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.colleges = res['data']['partners'];
        if(this.colleges != undefined){
          this.all_colleges.next(this.colleges.slice()); 
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  filterCollege(event) {
    let search = event;
    if (!search) {
      this.all_colleges.next(this.colleges.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_colleges.next(
      this.colleges.filter(
        (college) => college.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  //To get all college list
  getInstitutes(){
    let param = { url: 'get-partners-list',partner_type_id : 3 };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.institutes = res['data']['partners'];
        if(this.institutes != undefined){
          this.all_institutes.next(this.institutes.slice()); 
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  filterInstitute(event) {
    let search = event;
    if (!search) {
      this.all_institutes.next(this.institutes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_institutes.next(
      this.institutes.filter(
        (institute) => institute.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  onOrganizationTypeChange(){
    this.year_id = '';
    this.semester_id = '';
    this.group_id = '';
    if(this.organization == '1'){ //University
      this.getUniversities();
    }else if(this.organization == '2'){ //College
      this.getColleges();
    }else if(this.organization == '3'){ //Institute
      this.getInstitutes();
    }
  }
  
  getYears(partner,parent_id){
    this.partner_id = partner;
    let param = { url: 'get-year-semester-group',partner_id : partner, parent_id : parent_id, slug : 'year' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.years = res['data'];
        if(this.years != undefined){
          this.all_years.next(this.years.slice()); 
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  getSemesters(){
    let param = { url: 'get-year-semester-group',partner_id : this.partner_id, parent_id : this.year_id, slug : 'semester' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.semesters = res['data'];
        if(this.semesters != undefined){
          this.all_semesters.next(this.semesters.slice()); 
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  getGroups(){
    let param = { url: 'get-year-semester-group',partner_id : this.partner_id, parent_id : this.semester_id, slug : 'group' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.groups = res['data'];
        if(this.groups != undefined){
          this.all_groups.next(this.groups.slice()); 
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }
}
