import { Component, OnInit, ViewChild} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
    selector: 'app-analysis-report',
    templateUrl: './analysis-report.component.html',
    styleUrls: ['./analysis-report.component.scss']
})  
export class AnalysisReportComponent implements OnInit {
    displayedColumns: string[] = ['s_no', 'assessment_name', 'date_time', 'conducted_by', 'students_appeared', 'students_passed', 'questions', 'actions'];

    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    public organization_types = environment.ORGANIZATION_TYPES;
    public all_organization_list: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_universities: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_colleges: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_institutes: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_years: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_semesters: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_groups: ReplaySubject<any> = new ReplaySubject<any>(1);
    public all_college: ReplaySubject<any> = new ReplaySubject<any>(1);

    public pageSize = environment.page_size;
    public page_size_options = environment.page_size_options;
    public page = 0;
    public is_university = true;
    public is_college = false;
    public organization_type_id = '';
    public organization_type_name = '';
    public selected_name = '';
    public selected_value = '';
    public organization_list_id = '';
    public college_id = '';
    public year_id = '';
    public semester_id = '';
    public group_id = '';

    public organization_list = [];
    public college_list = [];

    public user_id = 0;
    public role_id = 0;
    public user = [];
    public org_type = '';
    years: any;
    public total_years = [];
    public total_semesters = [];
    public total_groups = [];
    public show_semester_dropdown = true;
    public show_group_dropdown = true;
    public totalSize = 0;

    constructor(private http: CommonService, private toster: ToastrService) { }
    ngOnInit(): void {
        this.user = this.http.getUser();
        this.user_id = this.user['id'];
        this.role_id = this.user['role'];
        this.page = 0;
    }

    public doFilter() {
        this.dataSource = new MatTableDataSource();
        this.totalSize = 0;
        let param = {
        url: 'assessment/get-list',
        offset: this.page,
        limit: this.pageSize,
        list_type_id: this.organization_type_id,
        organization: this.organization_list_id,
        college_id: this.college_id,
        year_id: this.year_id,
        semester_id: this.semester_id,
        group_id: this.group_id,
        is_admin_specific_role: '1',
        role_id: this.role_id
        };
        this.http.post(param).subscribe((res) => {
            this.dataSource = new MatTableDataSource(res['assessments']);
            //this.dataSource.paginator = this.paginator;
            //this.dataSource.sort = this.sort;
            this.totalSize = res['assessments_count'];
        });
    }

    public getServerData(event?: PageEvent) {
        this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
        this.doFilter();
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

        this.doFilter();
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
            //partner_child_id = String(this.college_institute_id);//this.user['partner_child_id'];
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
              this.doFilter();           
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
}
