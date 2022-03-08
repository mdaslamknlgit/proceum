import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { TranslateService } from '@ngx-translate/core';

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
  selector: 'app-manage-years-semesters-groups',
  templateUrl: './manage-years-semesters-groups.component.html',
  styleUrls: ['./manage-years-semesters-groups.component.scss']
})
export class ManageYearsSemestersGroupsComponent implements OnInit {
  displayedColumnsYears: string[] = [
    'id',
    'name',
    'organization_name',
    'partner_child_name',
    'actions',
    'status',
  ];
  displayedColumnsSemesters: string[] = [
    'id',
    'name',
    'year_name',
    'organization_name',
    'partner_child_name',
    'actions',
    'status',
  ];
  displayedColumnsGroups: string[] = [
    'id',
    'name',
    'year_name',
    'semester_name',
    'organization_name',
    'partner_child_name',
    'actions',
    'status',
  ];
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public page = 0;
  public add_or_edit = "Add New";
  public page_title = "";
  public slug = "year";
  popoverTitle = '';
  popoverMessage = '';
  public model_status = false;
  public edit_model_status = false;
  public self_or_other = "other"
  public show_radio = true;
  public organization_type = '';
  public name_of = '';
  public partner_id: any = null;
  public parent_id: number = null;
  public organization = '';
  public partner_parent_id = '';
  public partner_child_id = '';
  public year_id = '';
  public semester_id = '';
  public group_id = '';
  public user_role: any;
  public proceum_admin = false;
  public expand_course = true;
  public selected_courses: any;
  public courses_div = false;
  public courses_ids_csv = '';
  public courses_arr = [];
  public course_count = 0;
  public year_has_semester = false;
  public year_has_group = false;
  public show_semester_dropdown = false;
  public name_field_disabled = false;
  public partner_type_id: number;
  public child_type = 1;
  public id = 0;
  public user: any;

  universities = [];
  colleges = [];
  institutes = [];
  years = [];
  semesters = [];
  public organization_types = environment.ORGANIZATION_TYPES;
  all_universities: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_colleges: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_institutes: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_years: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_semesters: ReplaySubject<any> = new ReplaySubject<any>(1);

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Code starts here for course selection
  treeControl = new NestedTreeControl<CurriculumNode>(node => node.children);
  dataSourceForNestedTree = new MatTreeNestedDataSource<CurriculumNode>();
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router,
    public translate: TranslateService
  ) { }
  

  hasChild = (_: number, node: CurriculumNode) =>
    !!node.children && node.children.length > 0;

  setParent(data, parent) {

    if (data.children === undefined) {
      data.has_children = false;
    } else {
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
    let result = []; let selected_ids = [];
    this.dataSourceForNestedTree.data.forEach(node => {
      result = result.concat(
        this.treeControl
          .getDescendants(node)
          .filter(x => x.selected && x.id).map(x => [x.id, x.curriculum_id, x.has_children, x.name, x.parentid])
      );
      selected_ids = selected_ids.concat(
        this.treeControl
          .getDescendants(node)
          .filter(x => x.selected && x.id).map(x => x.id)
      );
      //Trying to select all items if childs are selected or indetermine
      this.treeControl
        .getDescendants(node)
        .filter((x) => {
          if (x.selected && x.id) {
            this.todoItemSelectionToggle(x.selected, x);
          }
        })
    });
    this.selected_courses = result.filter(function (node) {
      if (selected_ids.indexOf(node[4]) == -1) {
        return node;
      }
    }).map(x => x[3]);
    //console.log(this.selected_courses);
    if (this.selected_courses) {
      this.courses_div = true;
      this.courses_ids_csv = selected_ids.join();
      this.courses_arr = result;
    } else {
      this.courses_div = false;
      this.edit_model_status = false;
      this.courses_ids_csv = '';
      this.courses_arr = result;
    }

  }

  ngOnInit(): void {
    this.translate.get('year').subscribe((data)=> {
      this.page_title = data;
    });
    this.translate.get('admin.year_sem_grp.add_new').subscribe((data)=> {
      this.add_or_edit = data;
    });
    const user = JSON.parse(atob(localStorage.getItem('user')));
    this.user = user;
    this.user_role = user.role;
    if (Object.values(environment.PROCEUM_ADMIN_SPECIFIC_ROLES).indexOf(Number(this.user_role)) > -1) {
      this.proceum_admin = true;
    } else {
      this.partner_parent_id = user.partner_id;
      this.parent_id = user.partner_id;
      this.partner_type_id = 1;
      if (Number(this.user_role) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.UNIVERSITY_ADMIN) {
        this.getPartnerChilds();
      }
      //Disable specific columns based on partner role
      if(Number(this.user_role) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.UNIVERSITY_ADMIN){
        this.displayedColumnsYears.splice(2, 1);
        this.displayedColumnsSemesters.splice(3, 1);
        this.displayedColumnsGroups.splice(4, 1);
      }else{
        this.displayedColumnsYears.splice(2, 2);
        this.displayedColumnsSemesters.splice(3, 2);
        this.displayedColumnsGroups.splice(4, 2);
      }
    }
    this.getData();
    if (this.slug == 'year') {
      this.getCurriculumnHierarchy();
    }
  }
  tabClick(tab) {
    //empty the table data first
    this.id = 0;
    this.search_box = '';
    this.dataSource = new MatTableDataSource([]);
    this.year_id = null;
    this.semester_id = null;
    this.group_id = null;
    this.partner_parent_id = null;
    this.parent_id = null;
    this.name_of = '';
    this.organization = '';
    this.organization_type = '';
    this.courses_ids_csv = '';
    this.self_or_other = 'other';
    //Years tab
    if (tab.index == 0) {
      this.slug = 'year';
      this.translate.get('year').subscribe((data)=> {
        this.page_title = data;
      });
      //this.page_title = 'Year';
    }
    //Semesters tab
    if (tab.index == 1) {
      this.slug = 'semester';
      this.translate.get('semester').subscribe((data)=> {
        this.page_title = data;
      });
      //this.page_title = 'Semester';
    }
    //Groups tab
    if (tab.index == 2) {
      this.slug = 'group';
      this.translate.get('group').subscribe((data)=> {
        this.page_title = data;
      });
      //this.page_title = 'Group';
    }
    //finally
    this.getData();
  }
  public getData() {
    let param = {
      url: 'get-year-semester-group-by-slug',
      slug: this.slug,
      partner_id: this.partner_parent_id,
      offset: 0,
      limit: 10
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if (this.paginator != undefined) {
          this.paginator.pageIndex = 0;
          this.paginator.firstPage();
        }
        this.dataSource = new MatTableDataSource(res['data']);
        this.totalSize = res['total_records'];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource();
      }

    });
  }

  getCurriculumnHierarchy() {
    let params = {
      url: 'get-curriculumn-hierarchy',
      previous_selected_ids: this.courses_ids_csv,
      flag: 'subject',
      partner_id: this.partner_parent_id,
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.course_count = res['data'].length;
        this.dataSourceForNestedTree.data = res['data'];
        this.dataSourceForNestedTree.data.forEach(x => {
          this.setParent(x, null);
        });
        if (this.courses_ids_csv != '') {
          this.submitCourses();
        }
      } else {
        this.course_count = 0;
        this.dataSourceForNestedTree.data = [];
        //this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }


  public getRow(id) {
    this.add_or_edit = 'Edit';
    this.translate.get('admin.year_sem_grp.edit').subscribe((data)=> {
      this.add_or_edit = data;
    });
    this.self_or_other = 'other';
    this.courses_ids_csv = '';
    let param = { url: 'get-year-semester-group-by-id', 'id': id, 'slug': this.slug };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let item = res['data'];
        this.partner_parent_id = item.partner_id;
        this.partner_child_id = item.partner_child_id;
        this.parent_id = item.parent_id;
        this.year_id = item.year_id;
        this.semester_id = item.semester_id;
        this.slug = item.slug;
        this.name_of = item.name;
        this.self_or_other = 'other';//(item.partner_id == null) ? 'self' : 'other';
        this.show_radio = false;
        this.organization_type = (item.partner_type == null) ? '' : item.partner_type.toString();
        this.year_has_semester = item.year_has_semester;
        this.year_has_group = item.year_has_group;
        this.id = item.pk_id;
        if (this.slug == 'year') {
          this.year_id = id;
        }
        if (this.slug == 'semester') {
          this.semester_id = id;
        }
        if (this.slug == 'group') {
          this.group_id = id;
        }
        this.organization_type = String(item.partner_type_id);
        this.partner_type_id = item.partner_type_id;

        let callPartnerChilds = true;
        this.getPartners(callPartnerChilds);
        if (this.slug == 'semester' || this.slug == 'group') {
          this.getYears(null);
        }
        if (this.slug == 'group') {
          this.getSemesters(this.year_id);
        }
        if (item.subject_ids_csv != '' && item.subject_ids_csv != null) {
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

  public onAddingForChange() {
    this.year_id = null;
    this.partner_parent_id = null;
    this.parent_id = null;
    this.name_of = '';
    this.organization = '';
    this.organization_type = '';
    this.courses_ids_csv = '';
  }

  public doFilter(event?: PageEvent) {
    let param = {
      url: 'get-year-semester-group-by-slug',
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
      slug: this.slug
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.totalSize = res['total_records'];
      } else {
        this.dataSource = new MatTableDataSource([]);
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
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.totalSize = res['total_records'];
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }


  public changeStatus(package_id, status) {
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

  deleteRecord(id) {
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

  navigateTo(url) {
    let user = this.http.getUser();
    if (user['role'] == '1') {
      url = "/admin/" + url;
    }
    //Later we must change this
    if (user['role'] == '3' || user['role'] == '4' || user['role'] == '5' || user['role'] == '6' || user['role'] == '7') {
      url = "/admin/" + url;
    }
    this.router.navigateByUrl(url);
  }

  toggleModel() {
    //empty the table data first
    //this.dataSource = new MatTableDataSource([]);
    this.id = 0;
    this.year_id = null;
    this.semester_id = null;
    this.group_id = null;
    this.parent_id = null;
    this.name_of = '';
    this.organization = '';
    this.organization_type = '';
    this.courses_ids_csv = '';
    if (Object.values(environment.PARTNER_ADMIN_SPECIFIC_ROLES).indexOf(Number(this.user['role'])) < 0) {
      this.partner_parent_id = '';
    }
    this.partner_child_id = '';
    this.self_or_other = 'other';
    this.show_radio = false;//true Changed to false on 05/1/2022
    this.add_or_edit = 'Add New';
    this.translate.get('admin.year_sem_grp.add_new').subscribe((data)=> {
      this.add_or_edit = data;
    });
    this.year_has_semester = false;
    this.year_has_group = false;
    this.show_semester_dropdown = false;

    //Call years for self
    if (this.slug != "year") {
      this.getYears(null);
    } else {
      this.courses_ids_csv = '';
      this.getCurriculumnHierarchy();
      /* if (this.courses_ids_csv != '') {
        this.submitCourses();
      } */
    }
    this.model_status = true;
  }


  onOrganizationTypeChange() {
    if (this.organization_type == '1') { //University
      this.partner_type_id = 1; //partner as Universities
      this.getPartners();
    } else if (this.organization_type == '2') { //College
      this.partner_type_id = 2; //partner as Collges
      this.getPartners();
    } else if (this.organization_type == '3') { //Institute
      this.partner_type_id = 3; //partner as Institutes
      this.getPartners();
    }
  }

  //To get all the Universities list
  getPartners(callPartnerChilds = false) {
    let param = { url: 'get-partners', partner_type_id: this.partner_type_id, status: 1 };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.universities = res['data']['partners'];
        if (this.universities != undefined) {
          this.all_universities.next(this.universities.slice());
        }
        this.getCurriculumnHierarchy();
        if (callPartnerChilds) {
          this.getPartnerChilds();
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  filterPartners(event) {
    let search = event;
    if (!search) {
      this.all_universities.next(this.universities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_universities.next(
      this.universities.filter(
        (university) => university.partner_name.toLowerCase().indexOf(search) > -1
      )
    );
  }
  filterPartnerChilds(event) {
    let search = event;
    if (!search) {
      this.all_colleges.next(this.colleges.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_colleges.next(
      this.colleges.filter(
        (college) => college.partner_name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  //To get all college list
  getPartnerChilds() {
    if (this.partner_type_id != 1) {
      this.all_colleges.next([]);
      return;
    }
    let param = {
      url: 'get-partner-childs',
      child_type: this.child_type,
      partner_id: this.partner_parent_id,
      status: 1
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.colleges = res['data']['partners'];
        if (this.colleges != undefined) {
          this.all_colleges.next(this.colleges.slice());
        }
      } else {
        this.colleges = [];
        this.all_colleges.next(this.colleges.slice());
        this.translate.get('admin.year_sem_grp.no_college_found').subscribe((data)=> {
          this.toster.error(data, "Error", { closeButton: true });
        });
        //this.toster.error("No colleges found", 'Error');
      }
    });
  }

  getYears(parent_id) {
    if (this.slug == 'year') return;
    let param = {
      url: 'get-year-semester-group',
      partner_id: this.partner_parent_id,
      partner_child_id: this.partner_child_id,
      parent_id: parent_id,
      slug: 'year'
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.years = res['data'];
        if (this.years != undefined) {
          this.all_years.next(this.years.slice());
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  filterYear(event) {
    let search = event;
    if (!search) {
      this.all_years.next(this.years.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_years.next(
      this.years.filter(
        (year) => year.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  getChildDropDownData(year_id) {
    let year_obj = this.years.find((year) => year.pk_id == year_id);
    if (year_obj.year_has_semester) {
      this.getSemesters(year_id);
      this.name_field_disabled = false;
    } else {
      if (this.slug == 'semester' && year_obj.year_has_semester == 0) {
        this.translate.get('admin.year_sem_grp.disabled_semester').subscribe((data)=> {
          this.toster.error(data, "Error", { closeButton: true });
        });
        //this.toster.error("Disabled creating semester to selected year!", 'Error');
        this.name_field_disabled = true;
        this.name_of = '';
      } else if (year_obj.year_has_group == 0) {
        this.translate.get('admin.year_sem_grp.disabled_group').subscribe((data)=> {
          this.toster.error(data, "Error", { closeButton: true });
        });
        //this.toster.error("Disabled creating groups to selected year!", 'Error');
        this.name_field_disabled = true;
        this.name_of = '';
      } else {
        this.name_field_disabled = false;
      }
    }
  }

  checkGroupCanCreate() {
    let year_obj = this.years.find((year) => year.pk_id == this.year_id);
    if (year_obj.year_has_group == 0) {
      this.translate.get('admin.year_sem_grp.create_disabled_year').subscribe((data)=> {
        this.toster.error(data, "Error", { closeButton: true });
      });
      //this.toster.error("Creating groups disabled to selected year!", 'Error');
      this.name_field_disabled = true;
      this.name_of = '';
    } else {
      this.name_field_disabled = false;
    }
  }

  getSemesters(parent_id) {
    let param = {
      url: 'get-year-semester-group',
      partner_id: this.partner_parent_id,
      partner_child_id: this.partner_child_id,
      slug: 'semester',
      parent_id: parent_id
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.semesters = res['data'];
        if (this.semesters != undefined) {
          this.all_semesters.next(this.semesters.slice());
        }
        if (this.semesters.length) {
          this.show_semester_dropdown = true;
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  filterSemester(event) {
    let search = event;
    if (!search) {
      this.all_semesters.next(this.semesters.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_semesters.next(
      this.semesters.filter(
        (year) => year.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  unsetIDs(flag) {
    if (flag == 1) {
      this.partner_child_id = '';
    } else {
      this.year_id = '';
      this.semester_id = '';
    }
  }

  createNew() {
    let error = false;
    if (this.name_of == '') {
      error = true;
    }
    if (this.slug == 'year') {
      this.submitCourses();
      if (this.courses_ids_csv == '') {
        error = true;
        this.translate.get('admin.year_sem_grp.sel_subject').subscribe((data)=> {
          this.toster.error(data, "Error", { closeButton: true });
        });
        //this.toster.error("Select Subjects!", 'Error');
      }
    }
    let parent_id = null;
    let id = this.id;
    if (this.slug == 'year') {
      parent_id = null;
      if (this.name_of == '') {
        error = true;
        this.translate.get('admin.year_sem_grp.year_req').subscribe((data)=> {
          this.toster.error(data, "Error", { closeButton: true });
        });
        //this.toster.error("Year name required!", 'Error');
      }
    }
    if (this.slug == 'semester') {
      parent_id = this.year_id;
      if (this.name_of == '') {
        error = true;
        this.translate.get('admin.year_sem_grp.sem_req').subscribe((data)=> {
          this.toster.error(data, "Error", { closeButton: true });
        });
        //this.toster.error("Semester name required!", 'Error');
      }
    }
    if (this.slug == 'group') {
      let year_obj = this.years.find((year) => year.pk_id == this.year_id);
      parent_id = (year_obj.year_has_semester) ? this.semester_id : this.year_id;
      if (this.name_of == '') {
        error = true;
        this.translate.get('admin.year_sem_grp.grp_req').subscribe((data)=> {
          this.toster.error(data, "Error", { closeButton: true });
        });
        //this.toster.error("Group name required!", 'Error');
      }
    }

    if (!error) {
      let param = {
        url: 'create-year-semester-group',
        name: this.name_of,
        partner_id: this.partner_parent_id,
        partner_child_id: (Number(this.partner_type_id) == 1)?this.partner_child_id:null,
        parent_id: parent_id,
        slug: this.slug,
        id: id,
        partner_type_id: this.partner_type_id,
        year_has_semester: this.year_has_semester,
        year_has_group: this.year_has_group,
        subject_ids_csv: this.courses_ids_csv,
        status: '1',
      };
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          this.toster.success(res['message'], 'Success');
          if (Object.values(environment.ALL_ADMIN_SPECIFIC_ROLES).indexOf(Number(this.user_role)) > -1) {
            this.partner_parent_id = null;
            this.partner_child_id = null;
          }
          this.getData();
          this.model_status = false;
        } else {
          this.toster.error(res['message'], 'Error');
        }
      });
    }
  }
}

