import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

interface CurriculumNode {
  id?: number;
  name: string;
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
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  treeControl = new NestedTreeControl<CurriculumNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CurriculumNode>();
  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  //Define vars;
  public user_id = 0; //edit record id
  public role = '';
  public first_name = '';
  public last_name = '';
  public email = '';
  public password = '';
  public confirm_password = '';
  public phone = '';
  public address_line_1 = '';
  public address_line_2 = '';
  public country_id: any = '';
  public state_id: any = '';
  public city: any = '';
  public pincode = '';
  public university_id:any = '';
  public college_id = '';
  public institute_id = '';
  public if_student: boolean = false;
  public if_teacher: boolean = false;
  public year_id: any = '';
  public semester_id: any = '';
  public group_id: any = '';
  public uuid = '';
  public qualification = '';
  public subject_csv = '';
  public domain = '';
  public organization = '';
  public edit_model_status = false;
  public courses_arr = [];
  public courses_div = false;
  public show_semester = false;
  public show_group = false;
  public selected_courses = [];
  public show_organization_type = false;
  public show_partners_dropdown = false;
  public partner_type_id: number;
  public partner_id: any;
  public child_type = 1;
  p
  countrys = [];
  states = [];
  cities = [];
  roles = [];
  years = [];
  semesters = [];
  groups = [];
  universities = [];
  colleges = [];
  institutes = [];
  user = [];
  public organization_types = environment.ORGANIZATION_TYPES;



  all_countrys: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_states: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_cities: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_roles: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_years: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_semesters: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_groups: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_universities: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_colleges: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_institutes: ReplaySubject<any> = new ReplaySubject<any>(1);

  ngOnInit(): void {
    this.domain = location.origin;
    this.user = this.http.getUser();
    if(this.user['partner_id']){
      this.university_id = this.user['partner_id'];
    }
    this.getRoles(this.user['role']);
    this.activatedRoute.params.subscribe((param) => {
      this.user_id = param.id;      
      if (this.user_id != undefined) {
        this.getUser();
      }
      else {
        this.user_id = 0;
        this.getCurriculumnHierarchy();
      }

    });
    this.getCountries();

  }

  onUserTypeChange() {
    this.show_organization_type = false;
    this.show_partners_dropdown = true;
    if (Number(this.user['role']) == environment.PROCEUM_ADMIN_SPECIFIC_ROLES.SUPER_ADMIN) {
      this.show_organization_type = true;
      this.organization = "";
    }
    if (Number(this.user['role']) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.UNIVERSITY_ADMIN) {
      this.organization = '1';
      this.child_type = 1;
      this.university_id = this.user['partner_id'];
      this.getPartnerChilds(this.user['partner_id']);
    }
    if (Number(this.user['role']) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.COLLEGE_ADMIN) {
      this.college_id = this.user['partner_id'];
      this.show_partners_dropdown = false;
      this.organization = '2';
    }
    if (Number(this.user['role']) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.INSTITUTE_ADMIN) {
      this.institute_id = this.user['partner_id'];
      this.show_partners_dropdown = false;
      this.organization = '3';
    }
    if (Number(this.user['role']) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.UNIVERSITY_COLLEGE_ADMIN) {
      this.university_id = this.user['partner_id'];
      this.show_partners_dropdown = false;
      this.organization = '1';
    }
    if (Number(this.user['role']) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.UNIVERSITY_ADMIN && Number(this.role) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.UNIVERSITY_ADMIN) {
      this.university_id = this.user['partner_id'];
      this.show_partners_dropdown = false;
      this.organization = '1';
    }
    
    /* if(Number(this.role) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.COLLEGE_ADMIN){
      this.show_partners_dropdown = false;
    } */
  }

  getRoles(role) {
    let param = { url: 'get-roles', role: role };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.roles = res['data']['roles'];
        if (this.roles != undefined) {
          this.all_roles.next(this.roles.slice());
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  getCountries() {
    let param = { url: 'get-countries' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.countrys = res['data']['countries'];
        if (this.countrys != undefined) {
          this.all_countrys.next(this.countrys.slice());
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  filterCountries(event) {
    let search = event;
    if (!search) {
      this.all_countrys.next(this.countrys.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_countrys.next(
      this.countrys.filter(
        (country) => country.country_name.toLowerCase().indexOf(search) > -1
      )
    );
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
          this.all_states.next(this.states.slice());
        } else {
          let message = res['errors']['title']
            ? res['errors']['title']
            : res['message'];
          //this.toster.error(message, 'Error', { closeButton: true });
        }
      });
    }
  }

  filterStates(event) {
    let search = event;
    if (!search) {
      this.all_states.next(this.states.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_states.next(
      this.states.filter(
        (state) => state.state_name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  getCities(selected_state_id: number) {
    let params = {
      url: 'get-cities',
      state_id: selected_state_id,
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.cities = res['data']['cities'];
        this.all_cities.next(this.cities.slice());
      }
    });
  }

  filterCities(event) {
    let search = event;
    if (!search) {
      this.all_cities.next(this.cities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_cities.next(
      this.cities.filter(
        (city) => city.city_name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  validateEmail(email) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
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
        this.getPartnerChilds(this.university_id);
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
        (university) => university.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  //To get all college list
  getPartnerChilds(partner_id) {
    this.partner_id = partner_id;
    let param = { url: 'get-partner-childs', child_type: this.child_type, partner_id: this.partner_id, status: 1 };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.colleges = res['data']['partners'];
        if (this.colleges != undefined) {
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
        (college) => college.organization_name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  //To get all college list
  getInstitutes() {
    let param = { url: 'get-partners-list', partner_type_id: 3 };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.institutes = res['data']['partners'];
        if (this.institutes != undefined) {
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

  onOrganizationTypeChange() {
    this.year_id = '';
    this.semester_id = '';
    this.group_id = '';
    if (this.role == '') {
      this.toster.error(`Please select role`, 'Error');
      this.organization = '';
      return;
    }
    if (Number(this.role) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.UNIVERSITY_COLLEGE_ADMIN && this.organization != '1') {
      let diabledRole = this.roles.filter((role) => role.id == Number(this.role));
      this.role = ''; this.organization = '';
      this.toster.error(`${diabledRole[0].role_name} role only applicable for Organization Type University`, 'Error');
      return;
    }
    if (Number(this.role) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.COLLEGE_ADMIN && this.organization != '2') {
      let diabledRole = this.roles.filter((role) => role.id == Number(this.role));
      this.role = ''; this.organization = '';
      this.toster.error(`${diabledRole[0].role_name} role only applicable for Organization Type College`, 'Error');
      return;
    }
    if (Number(this.role) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.INSTITUTE_ADMIN && this.organization != '3') {
      let diabledRole = this.roles.filter((role) => role.id == Number(this.role));
      this.role = ''; this.organization = '';
      this.toster.error(`${diabledRole[0].role_name} role only applicable for Organization Type Institute`, 'Error');
      return;
    }

    if (this.organization == '1') { //University 
      if (environment.DISABLED_USER_ROLES_FOR_ORGANIZATION.includes(Number(this.role))) {
        let diabledRole = this.roles.filter((role) => role.id == Number(this.role));
        this.role = ''; this.organization = '';
        this.toster.error(`Proceum can not create a User with ${diabledRole[0].role_name} role for the selected organization type`, 'Error');
        return;
      }
      this.partner_type_id = 1; //partner as Universities
      this.getPartners();
    } else if (this.organization == '2') { //College
      if (environment.DISABLED_USER_ROLES_FOR_ORGANIZATION.includes(Number(this.role))) {
        let diabledRole = this.roles.filter((role) => role.id == Number(this.role));
        this.role = ''; this.organization = '';
        this.toster.error(`Proceum can not create a User with ${diabledRole[0].role_name} role for the selected organization type`, 'Error');
        return;
      }
      this.partner_type_id = 2; //partner as Collges
      this.getPartners();
    } else if (this.organization == '3') { //Institute
      if (environment.DISABLED_USER_ROLES_FOR_ORGANIZATION.includes(Number(this.role))) {
        let diabledRole = this.roles.filter((role) => role.id == Number(this.role));
        this.role = ''; this.organization = '';
        this.toster.error(`Proceum can not create a User with ${diabledRole[0].role_name} role for the selected organization type`, 'Error');
        return;
      }
      this.partner_type_id = 3; //partner as Institutes
      this.getPartners();
    } else if (this.organization == '4') {
      if (environment.DISABLED_USER_ROLES_FOR_PROCEUM.includes(Number(this.role))) {
        let diabledRole = this.roles.filter((role) => role.id == Number(this.role));
        this.organization = '';
        this.toster.error(`Proceum can not create a User with ${diabledRole[0].role_name} role`, 'Error');
      }
    }

  }

  getYears(colleg_id, parent_id, call_child_fun = false) {
    let param = { url: 'get-year-semester-group', partner_id: colleg_id, parent_id: parent_id, slug: 'year', partner_type_id: this.partner_type_id };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.years = res['data'];
        if (this.years != undefined) {
          this.all_years.next(this.years.slice());
          if (call_child_fun) {
            this.getChildDropDownData(colleg_id, this.year_id);
          }
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  getChildDropDownData(college_id, year_id) {
    this.show_semester = false;
    this.show_group = false;
    let year_obj = this.years.find((year) => year.pk_id == year_id);
    if (year_obj.year_has_semester) {
      this.getSemesters(college_id, Boolean(year_obj.year_has_group));
    } else if (year_obj.year_has_group) {

      this.getGroups(college_id, year_id);
    }
  }

  getSemesters(college_id = 0, call_child_func = false) {
    let param = { url: 'get-year-semester-group', partner_id: college_id, parent_id: this.year_id, slug: 'semester', partner_type_id: this.partner_type_id };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.semesters = res['data'];
        if (this.semesters != undefined) {
          this.all_semesters.next(this.semesters.slice());
          this.show_semester = true;
          if (call_child_func) {
            this.getGroups(college_id, this.semester_id);
          }
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  getGroups(college_id = 0, parent_id) {
    let year_obj = this.years.find((year) => year.pk_id == this.year_id);
    if (!year_obj.year_has_group) {
      return false;
    }
    if (year_obj.year_has_semesters) {
      parent_id = this.semester_id;
    } else {
      parent_id = this.year_id;
    }

    let param = { url: 'get-year-semester-group', partner_id: college_id, parent_id: parent_id, slug: 'group', partner_type_id: this.partner_type_id };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.groups = res['data'];
        if (this.groups != undefined) {
          this.all_groups.next(this.groups.slice());
          this.show_group = true;
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  submitFrom() {
    if (this.role == '' || this.first_name == '' || this.phone == '' || this.address_line_1 == '' || this.country_id == '' || this.state_id == '' || this.city == '' || this.pincode == '') {
      return;
    }
    //check password and confirm pass matched
    if (this.user_id == 0 && (this.password.length < 6 || (this.password != this.confirm_password))) {
      return;
    }
    if (!this.validateEmail(this.email)) {
      return;
    }
    if (Number(this.role) == environment.ALL_ROLES.STUDENT) {
      if (this.organization == '' || (this.university_id == '' && this.college_id == '' && this.institute_id == '') || this.year_id == '') {
        return;
      }
    }
    if (Number(this.role) == environment.ALL_ROLES.TEACHER) {
      if (this.qualification == '') {
        return;
      }
      if (this.subject_csv == '') {
        this.toster.error("Please select subjects!", 'Error', { closeButton: true });
        return;
      }
    }

    //If everything clear, send data to backend
    let form_data = {
      user_id: this.user_id,
      role: this.role,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password,
      confirm_password: this.confirm_password,
      phone: this.phone,
      address_line_1: this.address_line_1,
      address_line_2: this.address_line_2,
      country_id: this.country_id,
      state_id: this.state_id,
      city: this.city,
      pincode: this.pincode,
      university_id: this.university_id,
      college_id: this.college_id,
      institute_id: this.institute_id,
      year_id: this.year_id,
      semester_id: this.semester_id,
      group_id: this.group_id,
      uuid: this.uuid,
      qualification: this.qualification,
      subject_csv: this.subject_csv,
      organization: this.organization,
      domain: this.domain,
    };
    
    let params = { url: 'create-user', form_data: form_data };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.navigateTo('manage-users');
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });

  }

  getUser() {
    let data = { url: 'get-user', user_id: this.user_id };
    this.http.post(data).subscribe((res) => {
      if (res['error'] == false) {
        let user_data = res['data'];
        this.user_id = user_data.user_id;
        this.role = user_data.role;
        this.first_name = user_data.first_name;
        this.last_name = user_data.last_name;
        this.email = user_data.email;
        this.password = user_data.password;
        this.confirm_password = user_data.confirm_password;
        this.phone = user_data.phone;
        this.address_line_1 = user_data.address_line_1;
        this.address_line_2 = user_data.address_line_2;
        this.country_id = user_data.country_id;
        this.state_id = user_data.state_id;
        this.getStates(this.country_id);
        this.city = user_data.city;
        this.getCities(this.state_id);
        this.pincode = user_data.pincode;
        this.university_id = user_data.university_id;
        this.college_id = user_data.college_id;
        this.institute_id = user_data.institute_id;
        this.year_id = user_data.year_id;
        this.semester_id = user_data.semester_id;
        this.group_id = user_data.group_id;
        this.uuid = user_data.uuid;
        this.qualification = user_data.qualification;
        this.subject_csv = user_data.subject_csv;

        if (user_data.university_id && user_data.college_id) {
          this.organization = '1';
          this.partner_type_id = 1;
          let callPartnerChilds = true;
          this.getPartners(callPartnerChilds);
          this.partner_id = this.university_id;
        }
        else if (user_data.college_id) {
          this.organization = '2';
          this.partner_type_id = 2;
          this.getPartners();
          this.partner_id = this.college_id;
        }
        else if (user_data.institute_id) {
          this.organization = '3';
          this.partner_type_id = 3;
          this.getPartners();
          this.partner_id = this.institute_id;
        } else {
          this.organization = '4';//proceum
          //this.getYears(this.college_id, 0, true);
          /* this.getChildDropDownData(this.college_id,this.year_id);
          this.getGroups(Number(this.college_id),this.year_id); */
        }
        if (Number(this.role) == environment.ALL_ROLES.STUDENT) {
          this.getYears(this.college_id, 0, true);
        }
        this.getCurriculumnHierarchy();
      }
    });
  }

  navigateTo(url) {
    let user = this.http.getUser();
    this.router.navigateByUrl(url);
    if (Object.values(environment.ALL_ADMIN_SPECIFIC_ROLES).indexOf(Number(user['role'])) > -1) {
      url = "/admin/" + url;
      this.router.navigateByUrl(url);
    }
  }

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

  // submitCourses() {
  //   let result = [];
  //   this.dataSource.data.forEach(node => {
  //     result = result.concat(
  //       this.treeControl
  //         .getDescendants(node)
  //         .filter(x => x.selected && x.id).map(x => [x.id,x.curriculum_id,x.has_children])
  //     );
  //   });
  //   this.courses_arr = result;
  //   if(this.courses_arr){
  //     let params = { url: 'get-selected-courses','courses_arr': this.courses_arr};
  //     this.http.post(params).subscribe((res) => {
  //       if (res['error'] == false) {
  //         //console.log(res['data']);
  //         this.courses_div = true;
  //         this.selected_courses = res['data']['selected_courses'];
  //         this.edit_model_status = false;
  //         this.subject_csv = res['data']['course_ids_csv'];
  //       }else{
  //         this.courses_div = false;
  //         this.selected_courses = [];
  //         this.edit_model_status = false;
  //         this.subject_csv = '';
  //       }
  //     });
  //   }
  // }

  submitCourses() {
    let result = []; let selected_ids = [];
    this.dataSource.data.forEach(node => {
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
    if (this.selected_courses) {
      this.courses_div = true;
      this.edit_model_status = false;
      this.subject_csv = selected_ids.join();
      this.courses_arr = result;
    } else {
      this.courses_div = false;
      this.edit_model_status = false;
      this.subject_csv = '';
      this.courses_arr = result;
    }
    //console.log(this.subject_csv);
  }

  getCurriculumnHierarchy() {
    let params = { url: 'get-curriculumn-hierarchy', 'courses_ids_csv': this.subject_csv, 'flag': 'subject' };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource.data = res['data'];
        this.dataSource.data.forEach(x => {
          this.setParent(x, null);
        });
        //Call below function for selected items should show on div
        if (this.subject_csv != "") {
          this.submitCourses();
        }
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }

}
