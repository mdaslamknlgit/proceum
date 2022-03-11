import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class LoginHistoryComponent implements OnInit {
  public api_url:string;
  displayedColumns: string[] = ['pk_id','first_name','email','latitude','longitude','country_name','city_name','platform_name','device_type','browser','ip_v4_address','login_time','logout_time'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
    
  public role;
  public manage_students = '';
  public organization_type_id = '';
  public organization_type_name = '';
  public organization_list = [];
  public college_list = [];
  public organization_list_id = '';
  public is_college = false;
  public is_university = true;
  public college_id = '';
  public year_id = '';
  public semester_id = '';
  public group_id = '';

  public partner_id = '';
  public domain = '';
  public std_role = environment.ALL_ROLES.STUDENT;
  public indv_role = environment.ALL_ROLES.INDIVIDUAL;
  public tchr_role = environment.ALL_ROLES.TEACHER;
  roles = [];
  years = [];
  semesters = [];
  groups = [];
  all_roles: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_organization_list: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_college: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_years: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_semesters: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_groups: ReplaySubject<any> = new ReplaySubject<any>(1);  
  public show_semester_dropdown = true;
  public show_group_dropdown = true;
  public promote_semester_dropdown = true;
  public promote_group_dropdown = true;

  public num_rows: number = 0;
  public page = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public sort_by: any;
  public search_txt ="";
  public from_date='';
  public to_date='';
  public fromDate='';
  public toDate='';
  public maxDate= new Date();
  public tomindate:any;
  public is_todate:boolean=true;
  public is_submit:boolean=true;
  public user_id:any;
  public organization_types = environment.ORGANIZATION_TYPES;
  public role_id = 0;
  public param_role = 0;
  public college_institute_id = 0;
  public user = [];
  public org_type = '';
  public role_specific = false;
  public ysg = false;
  constructor(private http: CommonService, public dialog: MatDialog,public datepipe: DatePipe, public translate: TranslateService) {}
  ngOnInit(): void {
    this.api_url = environment.apiUrl;
    let user = this.http.getUser();
    this.user_id = user.id;
    this.getRoleList(this.user['role']);
    this.getLoginHistory();
  }

  getLoginHistory() {
    let role_gt = [this.std_role,this.indv_role,this.tchr_role];
    let param = { url: 'get-login-history',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,"search_txt":this.search_txt,"from_date":"","to_date":"","roles":role_gt};
    this.http.post(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['login_history']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.num_rows = res['login_history_count'];
      
    });
  }

  public getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
    this.applyFilters( );
  }

  applyFilters(){
    let role_gt=[];
    let fromDate =this.from_date?this.datepipe.transform(this.from_date, 'yyyy-MM-dd'):""; 
    let toDate =this.to_date?this.datepipe.transform(this.to_date, 'yyyy-MM-dd'):"";
    if(this.role == undefined || this.role == ''){
      role_gt = [this.std_role,this.indv_role,this.tchr_role];
    }else{
      role_gt = [this.role];
    }
    let param = { url: 'get-login-history',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,"search_txt":this.search_txt,"from_date":fromDate,"to_date":toDate,"roles":role_gt,"university_id":this.organization_list_id,"college_id":this.college_id,"year_id":this.year_id,"semester_id":this.semester_id,"group_id":this.group_id};
    this.http.post(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['login_history']);
      this.dataSource.sort = this.sort;
      this.num_rows = res['login_history_count'];
    });
  }

  resetFilters(){
    this.search_txt="";
    this.from_date="";
    this.to_date="";
    this.fromDate = "";
    this.toDate="";
    this.organization_type_id = '';
    this.organization_list_id = '';
    this.college_id = '';
    this.all_organization_list.next();
    this.all_college.next();
    this.all_years.next();
    this.applyFilters();
  }

  sortData(event) {
		this.sort_by = event;
		if (this.sort_by.direction != '')
			this.applyFilters( );
	}

  fromdateChabge(){
    this.tomindate=new Date(this.from_date)
    this.to_date="";
    this.is_submit=true;
    this.is_todate=false;
    this.fromDate =this.from_date?this.datepipe.transform(this.from_date, 'yyyy-MM-dd'):""; 
  }

  todateChabge(){
    this.toDate=this.to_date?this.datepipe.transform(this.to_date, 'yyyy-MM-dd'):""; 
    this.is_submit=false;
  }

  getRoleList(role) {
    let role_gt = [this.std_role,this.indv_role,this.tchr_role];
    let param1 = { url: 'get-specific-roles',role : role_gt};
    this.http.post(param1).subscribe((res) => {
      if (res['error'] == false) {
        this.roles = res['data']['roles'];
        this.roles.filter((x) => {
          if(x.id == this.param_role){
            this.role = String(this.param_role);
          }
        });
        if(this.roles != undefined){
          this.all_roles.next(this.roles.slice());
        }
        this.is_submit=false;
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  selectRole(){
    if(this.role == this.indv_role){
      this.role_specific=false;
      this.ysg = false;
    }
    else if(this.role == this.std_role){
      this.role_specific=true;
      this.ysg = true;
    }
    else{
      this.role_specific=true;
      this.ysg = false;
    }
    this.search_txt="";this.from_date="";this.to_date="";this.fromDate = "";this.toDate="";this.organization_type_id="";this.organization_list_id="";this.college_id="";this.year_id="";this.semester_id="";this.group_id="";
  }

  onOrganizationTypeChange(){
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
    this.is_college = false;
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
    }
  }

  //To get all the Universities list
  getOrganizationList(type,check){
    if(check == 0){ // Only University or College or Institute
      this.is_college = false;
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
      //let param = { url: 'get-partners-list',parent_id : this.organization_list_id };
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

  getCollege(org_type,parent_id,slug,type){
    this.is_submit=false;
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
    // this.doFilter();
  }

  getYearSemsterGroup(org_type,parent_id,slug){
    let partner = '';let partner_child_id = 0;
    if(org_type == '1'){
      if(this.is_college == true){
        partner_child_id = Number(this.college_id);
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
      partner_child_id = Number(this.college_id);
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
      partner_child_id = this.user_id;
    }
    else if(this.role_id == environment.ALL_ROLES.TEACHER){
      //partner = String(this.college_institute_id);
      partner = this.user['partner_id'];
      org_type = this.org_type;
      if(this.org_type == '1'){
        partner_child_id = Number(this.college_id);
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
    //console.log(param);
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.years = res['data'];
        if(this.years != undefined){
           if(slug == 'year'){
              this.year_id = '';
              this.semester_id = '';
              this.group_id = '';
              this.all_semesters.next();
              this.all_groups.next();
              this.all_years.next(this.years.slice());
            }else if(slug == 'semester'){
              this.group_id = '';
              this.semester_id = '';
              this.all_groups.next();
              this.all_semesters.next(this.years.slice());
              this.show_semester_dropdown = true;
              if(this.years.length == 0){
                this.getYearSemsterGroup(org_type,parent_id,'group');
                this.show_semester_dropdown = false;
              }
            }else if(slug == 'group'){
              this.all_groups.next(this.years.slice());
              this.show_group_dropdown = true;
              if(this.years.length == 0){
                this.show_group_dropdown = false;
              }
            }
            // this.doFilter();
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  filterPartners(event) {
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

  filterCollege(event) {
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
}
