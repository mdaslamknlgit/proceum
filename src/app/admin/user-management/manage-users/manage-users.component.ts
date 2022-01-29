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
  public domain = '';
  
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
  promote_all_years: ReplaySubject<any> = new ReplaySubject<any>(1);
  promote_all_semesters: ReplaySubject<any> = new ReplaySubject<any>(1);
  promote_all_groups: ReplaySubject<any> = new ReplaySubject<any>(1);
  public mng_student_popup = false;
  public show_semester_dropdown = true;
  public show_group_dropdown = true;
  public promote_semester_dropdown = true;
  public promote_group_dropdown = true;

  public studentArray = [];
  public studentListArray = [];
  public promote_year_id = '';
  public promote_semester_id = '';
  public promote_group_id = '';
  checkboxValue: boolean = false;
  api_url : string;
  download_url : string;
  student_structure_template : string;
  
  public user_id = 0;
  public role_id = 0;
  public user = [];

  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router
    ) { 
      this.api_url = environment.apiUrl;
      this.download_url = this.api_url + 'download-students-data';
    }

  ngOnInit(): void {
    this.user = this.http.getUser();
    this.user_id = this.user['id'];
    this.role_id = this.user['role'];
    this.domain = location.origin;
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
    let param1 = { url: 'get-roles',is_admin_specific_role : '1'};
    this.http.post(param1).subscribe((res) => {
      if (res['error'] == false) {
        this.roles = res['data']['roles'];
        if(this.roles != undefined){
          this.all_roles.next(this.roles.slice());
        }
        this.student_structure_template = this.api_url.substring(0, this.api_url.length - 5) + res['student_structure_template'];
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public doFilter() {
    if(this.role != '2'){
      this.manage_students = '';
    }
    this.page = 0;
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
    
    this.http.post(param).subscribe((res) => {    
      this.checkboxValue = false;
      if (res['error'] == false) {
        if(this.role == '2'){
          this.dataSourceTwo = new MatTableDataSource(res['data']);
          this.dataSourceTwo.paginator = this.paginator;
          this.dataSourceTwo.sort = this.sort;
          let student_list = res['data'];
          this.studentListArray = [];
          if (student_list.length > 0) {
            student_list.forEach((res) => {
              this.studentListArray[res['id']] = {
                content_id: res['id'],
                is_selected: false,
              };
            });
          }
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
      this.checkboxValue = false;
      if (res['error'] == false) {
        if(this.role == '2'){
          this.dataSourceTwo = new MatTableDataSource(res['data']);
          let student_list = res['data'];
          this.studentListArray = [];
          if (student_list.length > 0) {
            student_list.forEach((res) => {
              this.studentListArray[res['id']] = {
                content_id: res['id'],
                is_selected: false,
              };
            });
          }
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

  public uploadFiles(event) {
    let files = event.target.files;
    if (files.length == 0) return false; 
    
    if(files && files.length > 0) {
      let file : File = files.item(0);
      let reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
                   
          //Create formdata object
          const uploadData = new FormData();
          uploadData.append("organization_type_id", this.organization_type_id);
          uploadData.append("organization" , this.organization_list_id);
          uploadData.append("college_id" , this.college_id);
          uploadData.append("year", this.year_id);
          uploadData.append("semester", this.semester_id);
          uploadData.append("group", this.group_id);
          uploadData.append("domain", this.domain);
          uploadData.append("import_file", files[0], files[0].name);
          
          let param = { url: 'import-students-data' };
          return this.http.import(param, uploadData).subscribe((res) => {
              if (res['error'] == false) {
                this.toster.success(res['message'], 'Success', { closeButton: true });
                this.doFilter();
                this.mng_student_popup = false;
              } else {
                this.toster.error(res['message'], 'Error', { closeButton: true });
              }
            });
        }
    }   
  }

  // public studentStructureTemplate(){
  //   window.open(this.student_structure_template,"_blank");
  // }

  public onManageStudentChange() {
    if(this.organization_list_id == '' && this.manage_students == '1'){
      this.toster.error('Please Select University / College / Institute', 'Error', { closeButton: true });
      return;
    }else if(this.manage_students == '3'){
      if(this.organization_list_id == ''){
        this.toster.error('Please Select University / College / Institute', 'Error', { closeButton: true });
        return;
      }else if(this.year_id == ''){
        this.toster.error('Please Select Year', 'Error', { closeButton: true });
        return;
      }
    }else if(this.manage_students == '1'){
      // let parent_id = '';
      // let partner = '';
      // if(this.organization_type_id != ''){
      //   partner = this.organization_list_id;
      // }else if(this.college_id != ''){
      //   parent_id = this.college_id;
      //   partner = this.organization_list_id;
      // }
      this.promote_all_years.next();
      this.promote_all_semesters.next();
      this.promote_all_groups.next();
      this.promote_year_id = '';
      this.promote_group_dropdown = true;
      this.promote_semester_dropdown = true;
      this.getYearSemsterGroup(this.organization_type_id,0,'year','promote');
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
      this.is_college = true;
    }
    // else if(this.organization_type_id == '2'){ //College
    //   this.getOrganizationList(2,0);
    //   this.organization_type_name = 'College';
    // }
    else if(this.organization_type_id == '3'){ //Institute
      this.getOrganizationList(3,0);
      this.organization_type_name = 'Institute';
      this.is_college = false;
    }
  }

  //To get all the Universities list
  getOrganizationList(type,check){
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

  getCollege(org_type,parent_id,slug,type){
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
      this.getYearSemsterGroup(org_type,parent_id,slug,type);
    }
    this.doFilter();
  }

  getYearSemsterGroup(org_type,parent_id,slug,type){     
    let partner = '';
    if(org_type == '1'){
      partner = this.college_id;
    }
    else{
      partner = this.organization_list_id;
    }
    //console.log('org_type => '+org_type+', partner => '+partner+', parent_id => '+parent_id+', slug => '+slug);   
    let param = { url: 'get-year-semester-group',partner_id : partner, parent_id : parent_id, slug : slug };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.years = res['data'];
        if(this.years != undefined){
          if(type == 'promote'){
            if(slug == 'year'){    
              this.promote_semester_id = '';
              this.promote_group_id = '';        
              this.promote_all_years.next(this.years.slice());
            }else if(slug == 'semester'){
              this.promote_group_id = '';
              this.promote_all_semesters.next(this.years.slice());
              this.promote_semester_dropdown = true;
              if(this.years.length == 0){
                this.getYearSemsterGroup(org_type,parent_id,'group',type);
                this.promote_semester_dropdown = false;
              }
            }else if(slug == 'group'){
              this.promote_all_groups.next(this.years.slice());
              this.promote_group_dropdown = true;
              if(this.years.length == 0){
                this.promote_group_dropdown = false;
              } 
            } 
          }else{
            if(slug == 'year'){            
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
                this.getYearSemsterGroup(org_type,parent_id,'group',type);
                this.show_semester_dropdown = false;
              }
            }else if(slug == 'group'){
              this.all_groups.next(this.years.slice());
              this.show_group_dropdown = true;
              if(this.years.length == 0){
                this.show_group_dropdown = false;
              }            
            }
            this.doFilter(); 
          }          
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  checkUncheckAll(event){
    this.studentArray = [];
    if(event.checked == true){
      this.studentListArray.forEach((value) => {
        this.studentListArray[value['content_id']]['is_selected'] = event.checked;
        this.studentArray.push(value['content_id']);
      });
    }else{
      this.studentListArray.forEach((value) => {
        this.studentListArray[value['content_id']]['is_selected'] = event.checked;
      });
    }
  }
  
  isAllSelected(event,student_id){ 
    if(event.checked == true){
      this.studentArray.push(student_id);
    }else{
      const index2 = this.studentArray.indexOf(student_id);
      if (index2 > -1) {
        this.studentArray.splice(index2, 1);
      }
    }
  }

  downloadAllStudents(){
    window.open(this.download_url+'?getUrl=1&role='+this.role+'&search='+this.search_box+'&list_type_id='+this.organization_type_id
    +'&organization='+this.organization_list_id+'&college_id='+this.college_id+'&year='+this.year_id+'&semester='+this.semester_id
    +'&group='+this.group_id+'&is_admin_specific_role=1&type=download',"_blank");
    this.mng_student_popup = false;
  }
  
  downloadSelectStudents(){
    if(this.studentArray.length > 0){
      // let param = {
      //   url: 'download-students-data/',
      //   studentArray: this.studentArray,
      // };
      // this.http.get(param).subscribe((res) => {

      // });
      window.open(this.download_url+'?getUrl=1&role='+this.role+'&studentArray='+this.studentArray+'&type=download',"_blank");
      this.studentArray = [];
      this.checkboxValue = false;
      this.checkUncheckAll('false');
      this.mng_student_popup = false;
    }else{
      this.toster.error('Please Select atleast one Student.!', 'Error', { closeButton: true });
    }
  }

  public PromoteStudentSubmit(){
    if(this.studentArray.length > 0){
      let param = { url: 'promote-user-details',
      studentArray:this.studentArray,
      year_id: this.promote_year_id,
      semester_id: this.promote_semester_id,
      group_id: this.promote_group_id };
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          this.toster.success(res['message'], 'Success', { closeButton: true });
          this.studentArray = [];
          this.checkboxValue = false;
          this.checkUncheckAll('false');
          this.promote_all_years.next();
          this.promote_all_semesters.next();
          this.promote_all_groups.next();
          this.doFilter();
          this.mng_student_popup = false;
        } else {
          this.toster.error(res['message'], 'Error', { closeButton: true });
        }
      });
    }else{
      this.toster.error('Please Select atleast one Student.!', 'Error', { closeButton: true });
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
        this.toster.error(res['message'], 'Error', { closeButton: true });
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

  resetFilters(){
    this.all_organization_list.next();
    this.all_college.next();
    this.all_years.next();
    this.all_semesters.next();
    this.all_groups.next();
    this.organization_type_id = '';
    this.organization_list_id = '';
    this.college_id = '';
    this.year_id = '';
    this.semester_id = '';
    this.group_id = '';
    this.doFilter();
  }
}
