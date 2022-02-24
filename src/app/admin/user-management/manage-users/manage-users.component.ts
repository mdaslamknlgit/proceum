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
  displayedColumns: string[] = ['id','name','email','role_name','phone','created_at','actions','status',];//,'Organization'

  displayedColumnsTwo: string[] = ['CB','id','name','email','phone','Unique ID','Blog Access','created_at',
    'actions','status',];//'Campus',//'role_name', //,'Organization','Year','Semester','Group'
  displayedColumnsThree: string[] = ['id','name','email','phone','Unique ID','created_at',];//'actions',//,'Year','Semester','Group'

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

  dataSourceThree = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginatorThree: MatPaginator;
  @ViewChild(MatSort) sortThree: MatSort;

  public organization_types = environment.ORGANIZATION_TYPES;

  public role = '';
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
  public mng_student_details_popup = false;
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
  public college_institute_id = 0;
  public user = [];
  public org_type = '';

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
    if(this.role_id == environment.ALL_ROLES.TEACHER){  /// Teacher Role ID
      this.getTeacherCollegeInstitute();
      this.is_college = false;
      this.is_university = false;
    }else{
      this.role = '2';
      if(this.role_id == environment.ALL_ROLES.UNIVERSITY_ADMIN){  /// University Admin Role ID
        this.is_college = true;
        this.is_university = false;
        this.organization_type_name = 'College';
        this.organization_list_id = this.user['partner_id'];
        this.organization_type_id = '1';
        this.getOrganizationList(1,1);
      }
      if(this.role_id == environment.ALL_ROLES.COLLEGE_ADMIN){  /// College Admin Role ID
        let i = this.displayedColumns.indexOf('Organization');
        let opr = i > -1 ? this.displayedColumns.splice(i, 1) : undefined;
        this.is_college = false;
        this.is_university = false;
        this.organization_type_name = 'College';
        this.organization_list_id = this.user['partner_id'];
        this.organization_type_id = '2';
        this.getYearSemsterGroup('',0,'year','');
      }
      if(this.role_id == environment.ALL_ROLES.INSTITUTE_ADMIN){  /// Institute Admin Role ID
        let i = this.displayedColumns.indexOf('Organization');
        let opr = i > -1 ? this.displayedColumns.splice(i, 1) : undefined;
        this.is_college = false;
        this.is_university = false;
        this.organization_type_name = 'Institute';
        this.organization_list_id = this.user['partner_id'];
        this.organization_type_id = '3';
        this.getYearSemsterGroup('',0,'year','');
      }
      if(this.role_id == environment.ALL_ROLES.UNIVERSITY_COLLEGE_ADMIN){  /// University College Admin Role ID
        let i = this.displayedColumns.indexOf('Organization');
        let opr = i > -1 ? this.displayedColumns.splice(i, 1) : undefined;
        this.is_college = false;
        this.is_university = false;
        this.organization_type_name = 'College';
        this.organization_list_id = this.user['partner_id'];
        this.college_id = this.user['partner_child_id'];
        this.organization_type_id = '1';
        this.getYearSemsterGroup('',0,'year','');
      }
      this.doFilter();
      this.getRoleList(this.user['role']);
      
    }
    this.domain = location.origin;
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
          this.getYearSemsterGroup('',0,'year','');          
        }else if(res['user_details']['college_id'] != null){
          this.college_id = this.college_institute_id = res['user_details']['college_id'];
          this.org_type = this.organization_type_id = '2';
          this.getYearSemsterGroup('',0,'year','');          
        }else if(res['user_details']['institute_id'] != null){
          this.organization_list_id = this.college_institute_id = res['user_details']['institute_id'];
          this.org_type = this.organization_type_id = '3';
          this.getYearSemsterGroup('',0,'year','');          
        }
        this.doFilter();
      }
    });
  }

  // public getAdminUsers() {
  //   let param = { url: 'get-user-list',offset: this.page,limit: this.pageSize, is_admin_specific_role : '1',role_id:this.role_id,organization: this.college_institute_id };
  //   this.http.post(param).subscribe((res) => {
  //     if (res['error'] == false) {
  //       if(this.role_id != 12){
  //         this.dataSource = new MatTableDataSource(res['data']);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //         this.totalSize = res['total_records'];
  //       }else if(this.role_id == environment.ALL_ROLES.TEACHER){
  //         this.dataSourceThree = new MatTableDataSource(res['data']);
  //         this.dataSourceThree.paginator = this.paginator;
  //         this.dataSourceThree.sort = this.sort;
  //         this.totalSize = res['total_records'];
  //       }
  //     } else {
  //       //this.toster.error(res['message'], 'Error');
  //     }
  //   });
  // }

  public getRoleList(role) {      // Added by Phanindra
    //let param1 = { url: 'get-roles',is_admin_specific_role : '1'};
    let param1 = { url: 'get-roles',role : role};
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
      organization: this.role_id != 12?this.organization_list_id:this.college_institute_id,
      college_id: this.college_id,
      year: this.year_id,
      semester: this.semester_id,
      group: this.group_id,
      is_admin_specific_role : '1',
      role_id:this.role_id
    };
    this.http.post(param).subscribe((res) => {    
      this.checkboxValue = false;
      if (res['error'] == false) {
        if(this.role_id == environment.ALL_ROLES.TEACHER){
          this.dataSourceThree = new MatTableDataSource(res['data']);
          this.dataSourceThree.paginator = this.paginator;
          this.dataSourceThree.sort = this.sort;
          this.totalSize = res['total_records'];
          return false;
        }
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
          this.totalSize = res['total_records'];
        }else{
          this.dataSource = new MatTableDataSource(res['data']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.totalSize = res['total_records'];
        }
      } else {
        if(this.role_id == environment.ALL_ROLES.TEACHER){
          this.dataSourceThree = new MatTableDataSource([]);
        }
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
      list_type_id: this.organization_type_id,
      organization: this.role_id != 12?this.organization_list_id:this.college_institute_id,
      college_id: this.college_id,
      year: this.year_id,
      semester: this.semester_id,
      group: this.group_id,
      role_id:this.role_id
    };
    
    this.http.post(param).subscribe((res) => {
      this.checkboxValue = false;
      if (res['error'] == false) {
        if(this.role_id == environment.ALL_ROLES.TEACHER){
          this.dataSourceThree = new MatTableDataSource(res['data']);
          this.totalSize = res['total_records'];
          return false;
        }
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
          this.totalSize = res['total_records'];
        } else{
          this.dataSource = new MatTableDataSource(res['data']);
          this.totalSize = res['total_records'];
        }        
      } else {
        //this.toster.info(res['message'], 'Error');
        if(this.role_id == environment.ALL_ROLES.TEACHER){
          this.dataSourceThree = new MatTableDataSource([]);
        }
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
    //console.log(this.organization_list_id+' => '+this.manage_students);
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
      this.getYearSemsterGroup(org_type,parent_id,slug,type);
    }
    this.doFilter();
  }

  getYearSemsterGroup(org_type,parent_id,slug,type){     
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
    +'&group='+this.group_id+'&is_admin_specific_role=1&user_id='+this.user_id+'&role_id='+this.role_id+'&type=download',"_blank");
    this.mng_student_popup = false;
  }
  
  downloadSelectStudents(){
    if(this.studentArray.length > 0){
      window.open(this.download_url+'?getUrl=1&role='+this.role+'&studentArray='+this.studentArray+'&user_id='+this.user_id
      +'&role_id='+this.role_id+'&type=download',"_blank");
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
        //this.getAdminUsers();
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
    
  }
  public allowBlogAccess(student_id){
    if(student_id != ''){
      let param = {
        url: 'blog-access-student',
        id: student_id,
        domain:location.origin,
      };
      this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        //this.getAdminUsers();
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
    }
  }
  public allowBlogAccessforAll(){
    let studentArrayBlog = [];
    this.studentListArray.forEach((opt, index) => {
      if(opt.is_selected == true){
        studentArrayBlog.push(index);
      }
    })
    if(studentArrayBlog.length > 0){
      let param = {
        url: 'blog-access-student',
        studentids:studentArrayBlog,
        domain:location.origin,
      };
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          this.toster.success(res['message'], 'Success', { closeButton: true });
        } else {
          this.toster.error(res['message'], 'Error', { closeButton: true });
        }
        // this.studentListArray = [];
        // this.checkboxValue = false;
        // this.checkUncheckAll('false');
      });
    }else{
      this.toster.error('Please Select Students', 'Error', { closeButton: true });
    }
  }
  navigateTo(url){
      let user = this.http.getUser();
      if(Object.values(environment.ALL_ADMIN_SPECIFIC_ROLES).includes(Number(user['role']))){
          url = "/admin/"+url;
      }
      //Later we must change this
      if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
        url = "/admin/"+url;
    }
      this.router.navigateByUrl(url);
  }

  resetFilters(){
    if(this.role_id == environment.ALL_ROLES.UNIVERSITY_ADMIN){  /// University Admin Role ID
      this.college_id = '';
      this.all_years.next();
    }else if(this.role_id == environment.ALL_ROLES.COLLEGE_ADMIN){  /// College Admin Role ID

    }else if(this.role_id == environment.ALL_ROLES.INSTITUTE_ADMIN){  /// Institute Admin Role ID
      
    }else if(this.role_id == environment.ALL_ROLES.INSTITUTE_ADMIN){  /// Institute Admin Role ID
      
    }else if(this.role_id == environment.ALL_ROLES.UNIVERSITY_COLLEGE_ADMIN){  /// University College Admin Role ID
    
    }else if(this.role_id == environment.ALL_ROLES.TEACHER){  /// Teacher Role ID
    
    }else{
      this.organization_type_id = '';
      this.organization_list_id = '';
      this.college_id = '';
      this.all_organization_list.next();
      this.all_college.next();
      this.all_years.next();
    }
    this.search_box = '';
    this.all_semesters.next();
    this.all_groups.next();
    this.year_id = '';
    this.semester_id = '';
    this.group_id = '';
    this.show_semester_dropdown = true;
    this.show_group_dropdown = true;
    this.doFilter();
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

  //Added by Phanindra 22-02-2022
  src : any = '../../../../assets/images/Demo-placeholder.jpeg';
  countrys = [];
  states = [];
  cities = [];
  public first_name = '';
  public last_name = '';
  public phone = '';
  public email = '';
  public uuid = '';
  public year = '';
  public semester = '';
  public group = '';
  public country_id = '';
  public state_id = '';
  public city_id = '';
  public country_name = '';
  public state_name = '';
  public city_name = '';
  public address1 = '';
  public address2 = '';
  public university = '';
  public college = '';
  public institute = '';
  public profile_pic = '';
  public last_login_time = '';
  
  public openDetailsModel(param:any){
    this.mng_student_details_popup = true;
    let user_id = param.id;
    let role = param.role;
    let params = {
      url: 'get-student-profile',
      id: user_id,
      role: role,
    };
    this.http.post(params).subscribe((res) => {
      this.first_name = res['data'].first_name;
      this.last_name = res['data'].last_name;
      this.phone = res['data'].phone;
      this.email = res['data'].email;
      this.uuid = res['data'].uuid;
      this.year = res['data'].year_name;
      this.semester = res['data'].sem_name;
      this.group = res['data'].grp_name;
      this.country_id = res['data'].country_id;
      this.state_id = res['data'].state_id;
      this.city_id = res['data'].city;
      this.address1 = res['data'].address_line_1;
      this.address2 = res['data'].address_line_2;
      this.university = res['data'].university_name;
      this.college = res['data'].college_name;
      this.institute = res['data'].institute_name;
      this.getCountries();
      this.getStates(res['data'].country_id);
      this.getCities(res['data'].state_id);
      this.profile_pic = res['data'].profile_pic ? res['data'].profile_pic : this.src;
    });
  }

  getCountries() {
    let param = { url: 'get-countries' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.countrys = res['data']['countries'];
        if (this.countrys != undefined) {
          let found = this.countrys.find(element => element.id === this.country_id);
          this.country_name = found.country_name;          
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  getStates(selected_country_id: number) {
    if (selected_country_id > 0) {
      let param = {
        url: 'get-states',
        country_id: selected_country_id,
      };
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          this.states = res['data']['states'];
          if (this.states != undefined) {
            let found = this.states.find(element => element.id === this.state_id);
            this.state_name = found.state_name;          
          }
        } else {
          let message = res['errors']['title']
            ? res['errors']['title']
            : res['message'];
          //this.toster.error(message, 'Error', { closeButton: true });
        }
      });
    }
  }

  getCities(selected_state_id: number) {
    let params = {
      url: 'get-cities',
      state_id: selected_state_id,
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.cities = res['data']['cities'];
        if (this.cities != undefined) {
          let found = this.cities.find(element => element.id === this.city_id);
          this.city_name = found.city_name;          
        }
      }
    });
  }
}
