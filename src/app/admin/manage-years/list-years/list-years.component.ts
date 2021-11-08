import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';

interface CurriculumNode {
  id?: number;
  name: any;
  curriculum_id?: number;
  selected?: boolean;
  indeterminate?: boolean;
  parentid?: number;
  is_curriculum_root?: boolean;
  children?: CurriculumNode[];
  has_children?: boolean;
  ok?: boolean;
}

@Component({
  selector: 'app-list-years',
  templateUrl: './list-years.component.html',
  styleUrls: ['./list-years.component.scss']
})
export class ListYearsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'organization_name',
    'partner_type',
    'actions',
    'status',
  ];
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public page = 0;
  public page_title = "Year";
  public slug = "year";
  popoverTitle = '';
  popoverMessage = '';
  public model_status = false;
  public edit_model_status = false;
  public self_or_other = "other"
  public show_radio = false;
  public organization_type = '';
  public name_of = '';
  public partner_id: any = null;
  public parent_id: number = null;
  public organization = '';
  public year_id = '';
  public semester_id = '';
  public group_id = '';
  public user_role = 3;
  public expand_course = true;
  public selected_courses:any;
  public courses_div = false;
  public courses_ids_csv = '';
  public courses_arr = [];
  public course_count = 0;
  universities = [];
  colleges = [];
  institutes = [];
  years = [];
  public organization_types = environment.ORGANIZATION_TYPES;
  all_universities: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_colleges: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_institutes: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_years: ReplaySubject<any> = new ReplaySubject<any>(1);
  
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Code starts here for course selection
  treeControl = new NestedTreeControl<CurriculumNode>(node => node.children);
  dataSourceForNestedTree = new MatTreeNestedDataSource<CurriculumNode>();
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router
    ) { }
  
    hasChild = (_: number, node: CurriculumNode) =>
    !!node.children && node.children.length > 0;

  setParent(data, parent) {
   
    if(data.children === undefined){
      data.has_children = false;
    }else{
      data.has_children = true;
    }
    data.parent = parent;
    if (data.children) {
      data.children.forEach(x => {
        this.setParent(x, data);
      });
    }
  }

  checkAllParents(node) {
    if (node.parent) {
      const descendants = this.treeControl.getDescendants(node.parent);
      node.parent.selected = descendants.every(child => child.selected);
      node.parent.indeterminate = descendants.some(child => child.selected);
      this.checkAllParents(node.parent);
    }
  }

  todoItemSelectionToggle(checked, node) {
    node.selected = checked;
    if (node.children) {
      node.children.forEach(x => {
        this.todoItemSelectionToggle(checked, x);
      });
    }
    this.checkAllParents(node);
  }

  setChildOk(text: string, node: any) {
    node.forEach(x => {
      x.ok = x.name.indexOf(text) >= 0;
      if (x.parent) this.setParentOk(text, x.parent, x.ok);
      if (x.children) this.setChildOk(text, x.children);
    });
  }
  
  setParentOk(text, node, ok) {
    node.ok = ok || node.ok || node.name.indexOf(text) >= 0;
    if (node.parent) this.setParentOk(text, node.parent, node.ok);
  }

  //For check the values
  getList2(node: any, result: any = null) {
    result = result || {};
    node.forEach(x => {
      result[x.name] = {};
      result[x.name].ok = x.ok;
      if (x.children) result[x.name].children = this.getList2(x.children);
    });
    return result;
  }
  //Another way to check the values, we can not use {{datasource.node}}
  getList(node: any) {
    return node.map(x => {
      const r: any = {
        name: x.name + ' - ' + x.ok,
        children: x.children ? this.getList(x.children) : null
      };
      if (!r.children) delete r.children;
      return r;
    });
  }

  submitCourses() {
    let result = [];let selected_ids = [];
    this.dataSourceForNestedTree.data.forEach(node => {
      result = result.concat(
        this.treeControl
          .getDescendants(node)
          .filter(x => x.selected && x.id).map(x => [x.id,x.curriculum_id,x.has_children,x.name,x.parentid])
      );
      selected_ids = selected_ids.concat(
        this.treeControl
          .getDescendants(node)
          .filter(x => x.selected && x.id).map(x => x.id)
      );
    });
    this.selected_courses = result.filter(function(node) {
      if(selected_ids.indexOf(node[4]) == -1){
        return node;
      }
    }).map(x => x[3]);
    //console.log(this.selected_courses);
    if(this.selected_courses){
      this.courses_div = true;
      this.courses_ids_csv = selected_ids.join();
      this.courses_arr = result;
    }else{
      this.courses_div = false;
      this.edit_model_status = false;
      this.courses_ids_csv = '';
      this.courses_arr = result;
    }
    
  }
  
  ngOnInit(): void {
    const user = JSON.parse(atob(localStorage.getItem('user')));
    this.show_radio = (user.role == 1) ? true : false;
    this.getData();
    this.getCurriculumnHierarchy();
  }

  public getData() {
    let param = { url: 'get-year-semester-group-by-slug','slug':'year','partner_id':''};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  getCurriculumnHierarchy(){
    let params = { url: 'get-curriculumn-hierarchy','previous_selected_ids' : this.courses_ids_csv};
    this.http.post(params).subscribe((res) => {      
      if (res['error'] == false) {
        this.course_count = res['data'].length;
        this.dataSourceForNestedTree.data = res['data'];
        this.dataSourceForNestedTree.data.forEach(x => {
          this.setParent(x, null);
        });
        if(this.courses_ids_csv != ''){
          //this.submitCourses();  
        }
      } else {
          this.course_count = 0;
          //this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }
  public getRow(id) {
    this.courses_ids_csv = ''; 
    let param = { url: 'get-year-semester-group-by-id','id':id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let item = res['data'];
        this.year_id = item.pk_id;
        this.partner_id = item.partner_id;
        this.parent_id = item.parent_id;
        this.slug = item.slug;
        this.name_of = item.name;
        this.organization = item.partner_id;
        this.self_or_other = (item.partner_id == null) ? 'self' : 'other';
        this.show_radio = (item.partner_id == null) ? false : true;
        this.organization_type = (item.partner_type == null) ? '' : item.partner_type.toString();
        this.onOrganizationTypeChange();
        if(item.subject_ids_csv != '' && item.subject_ids_csv != null){
          this.courses_ids_csv = item.subject_ids_csv;
          this.getCurriculumnHierarchy();
        }
        //Finally open the model
        this.model_status = true;
        
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }

  public onAddingForChange(){
    this.year_id = null;
    this.partner_id = null;
    this.parent_id = null;
    this.name_of = '';
    this.organization = '';
    this.organization_type = '';
    this.courses_ids_csv = '';
  }

  public doFilter() {
    let param = { url: 'get-year-semester-group-by-slug', search: this.search_box, slug: this.slug };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
      } else {
        this.dataSource = new MatTableDataSource([]);
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public getServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'get-year-semester-group-by-slug',
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
      slug: this.slug,
    };
    this.http.post(param).subscribe((res) => {
      //console.log(res['data']);
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }


  public changeStatus(package_id, status){
    let param = {
      url: 'year-semester-group-status',
      id: package_id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getData();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
    
  }

  deleteRecord(id){
    let param = {
      url: 'delete-year-semester-group',
      id: id,
    };
    this.http.post(param).subscribe((res) => {  
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getData();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }

  navigateTo(url){
      let user = this.http.getUser();
      if(user['role']== '1'){
          url = "/admin/"+url;
      }
      //Later we must change this
      if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
        url = "/admin/"+url;
    }
      this.router.navigateByUrl(url);
  }

  toggleModel() {
    this.show_radio = true;
    this.self_or_other = 'other';
    this.model_status = true;
    // (<HTMLFormElement>document.getElementById('create_form')).reset();
    // this.self_or_other = "other";
    //(<HTMLFormElement>document.getElementById('edit_discount_form')).reset();
  }


  onOrganizationTypeChange(){
    // this.year_id = '';
    // this.semester_id = '';
    // this.group_id = '';
    if(this.organization_type == '1'){ //University
      this.getUniversities();
    }else if(this.organization_type == '2'){ //College
      this.getColleges();
    }else if(this.organization_type == '3'){ //Institute
      this.getInstitutes();
    }
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

  createNew(){
    let error = false;
    if(this.name_of == ''){
      error = true;
    }
    this.submitCourses();
    if(this.courses_ids_csv == ''){
      error = true;
      this.toster.error("Select Subjects!", 'Error');
    }
    if(!error){
    let param = { 
      url: 'create-year-semester-group',
      name: this.name_of, 
      partner_id : this.organization, 
      parent_id : this.parent_id, 
      slug : 'year', 
      id : this.year_id,
      subject_ids_csv : this.courses_ids_csv,
      status : '1',
     };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        this.getData();
        this.model_status = false;
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
    }
  }
}

