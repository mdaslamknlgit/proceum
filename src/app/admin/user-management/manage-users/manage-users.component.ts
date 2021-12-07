import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'role_name',
    'phone',
    'created_at',
    'actions',
    'status',
  ];

  displayedColumnsTwo: string[] = [
    'CB',
    'id',
    'name',
    'email',
    //'role_name',
    'phone',
    'Unique ID',
    'Organization',
    //'Campus',
    'Year',
    'Semester',
    'Group',
    'created_at',
    'actions',
    'status',
  ];
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public page = 0;
  popoverTitle = '';
  popoverMessage = '';
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTwo = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginatorTwo: MatPaginator;
  @ViewChild(MatSort) sortTwo: MatSort;

  public organization_types = environment.ORGANIZATION_TYPES;

  public role = '';
  public manage_students = '';
  public organization_type_id = '';
  public organization_type_name = '';
  public organization_list = '';
  public organization_list_id = '';
  public is_college = false;
  public college_id = '';
  public year_id = '';
  public semester_id = '';
  public group_id = '';

  public partner_id = '';
  
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
  public mng_student_popup = false;

  public studentArray = [];
  masterSelected:boolean = false;
  api_url : string;

  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router
    ) { 
      this.api_url = environment.apiUrl + 'download-students-data';
    }

  ngOnInit(): void {
    this.getAdminUsers();
    this.getRoleList();
  }

  public getAdminUsers() {
    let param = { url: 'get-user-list',offset: this.page,limit: this.pageSize, is_admin_specific_role : '1' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.totalSize = res['total_records'];
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public getRoleList() {      // Added by Phanindra
    let param1 = { url: 'get-admin-specific-roles',is_admin_specific_role : '1'};
    this.http.post(param1).subscribe((res) => {
      if (res['error'] == false) {
        this.roles = res['data']['roles'];
        if(this.roles != undefined){
          this.all_roles.next(this.roles.slice());
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public doFilter() {
    let param = { 
      url: 'get-user-list',
      offset: this.page,
      limit: this.pageSize,
      role: this.role ,
      search: this.search_box ,
      list_type_id: this.organization_type_id,
      organization: this.organization_list_id,
      college_id: this.college_id,
      year: this.year_id,
      semester: this.semester_id,
      group: this.group_id,
      is_admin_specific_role : '1'
    };
    //console.log(param);
    
    this.http.post(param).subscribe((res) => {    
      
      if (res['error'] == false) {
        if(this.role == '2'){
          this.dataSourceTwo = new MatTableDataSource(res['data']);
          this.dataSourceTwo.paginator = this.paginator;
          this.dataSourceTwo.sort = this.sort;
        }else{
          this.dataSource = new MatTableDataSource(res['data']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        this.totalSize = res['total_records'];        
      } else {
        if(this.role == '2'){
          this.dataSourceTwo = new MatTableDataSource([]);
        }else{
          this.dataSource = new MatTableDataSource([]);
        }        
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public getServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'get-user-list', 
      is_admin_specific_role : '1',
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
      role: this.role,
      organization: this.organization_list_id,
      college_id: this.college_id,
      year: this.year_id,
      semester: this.semester_id,
      group: this.group_id,
    };
    
    this.http.post(param).subscribe((res) => {
      //console.log(res);
      if (res['error'] == false) {
        if(this.role == '2'){
          this.dataSourceTwo = new MatTableDataSource(res['data']);
        } else{
          this.dataSource = new MatTableDataSource(res['data']);
        }        
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        if(this.role == '2'){
          this.dataSourceTwo = new MatTableDataSource([]);
        } else{
          this.dataSource = new MatTableDataSource([]);
        }
      }
    });
  }

  public onManageStudentChange() {
    if(this.organization_list_id == '' && this.manage_students == '1'){
      this.toster.error('Please Select University / College / Institute', 'Error');
      return;
    }else if(this.manage_students == '1'){
      let parent_id = '';
      let partner = '';
      if(this.organization_list_id != ''){
        partner = parent_id = this.organization_list_id;
      }else if(this.college_id != ''){
        parent_id = this.college_id;
      }
      this.getYearSemsterGroup(partner,parent_id,'year');
    }
    this.mng_student_popup = true;
  }

  onOrganizationTypeChange(){
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
      this.organization_list = '';
      let param = { url: 'get-partners-list',parent_id : this.organization_list_id };
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          this.organization_list = res['data']['partners'];
          if(this.organization_list != undefined && res['data']['partners'] != ''){
            this.all_college.next(this.organization_list.slice());
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
          }else if(slug == 'semester'){
            this.group_id = '';
            this.all_semesters.next(this.years.slice());
          }else if(slug == 'group'){
            this.all_groups.next(this.years.slice());
          }           
        }
        this.doFilter();
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  checkUncheckAll(){
    console.log('OKATTT');
    // for (var i = 0; i < this.dataSourceTwo.length; i++) {
    //   this.dataSourceTwo[i].isSelected = this.masterSelected;
    // }
    // this.getCheckedItemList();
  }

  // Get List of Checked Items
  // getCheckedItemList(){
  //   this.studentArray = [];
  //   for (var i = 0; i < this.dataSourceTwo.length; i++) {
  //     if(this.dataSourceTwo[i].isSelected)
  //     this.studentArray.push(this.dataSourceTwo[i]);
  //   }
  // }

  
  isAllSelected(event,student_id){ 
    this.studentArray.push(student_id);
  }

  downloadAllStudents(){
    window.open(this.api_url+'?getUrl=1&role='+this.role+'&search='+this.search_box+'&list_type_id='+this.organization_type_id
    +'&organization='+this.organization_list_id+'&college_id='+this.college_id+'&year='+this.year_id+'&semester='+this.semester_id
    +'&group='+this.group_id+'&is_admin_specific_role=1',"_blank");
  }
  
  downloadSelectStudents(){
    if(this.studentArray.length > 0){
      // let param = {
      //   url: 'download-students-data/',
      //   studentArray: this.studentArray,
      // };
      // this.http.get(param).subscribe((res) => {

      // });
      //window.location.href = this.api_url+'?studentArray='+this.studentArray;
      window.open(this.api_url+'?getUrl=1&role='+this.role+'&studentArray='+this.studentArray,"_blank");
      this.studentArray = [];
      this.mng_student_popup = false;
    }else{
      this.toster.error('Please Select atleast one Student.!', 'Error');
    }
  }

  public changeStatus(package_id, status){
    let param = {
      url: 'user-status',
      id: package_id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getAdminUsers();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
    
  }

  navigateTo(url){
      let user = this.http.getUser();
      if(user['role'] == '1' || user['role'] == '8' || user['role'] == '9' || user['role'] == '10'){
          url = "/admin/"+url;
      }
      //Later we must change this
      if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
        url = "/admin/"+url;
    }
      this.router.navigateByUrl(url);
  }
}
