import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { GlobalApp } from '../../../global';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-partner-register',
  templateUrl: './partner-register.component.html',
  styleUrls: ['./partner-register.component.scss']
})
export class PartnerRegisterComponent implements OnInit {
  public is_show: boolean = false;
  public is_account_type: boolean = true;
  public is_individual: boolean = false;
  public is_institution: boolean = false;
  public is_university: boolean = false;
  public is_college: boolean = false;
  public is_coaching_institute: boolean = false;
  public university_college_error = 'University or College required';
  public password_error: string = 'Password is Required';
  public confirm_password_error: string = 'Confirm Password is Required';
  public email_check: boolean = true;
  public password_check: boolean = true;
  public confirm_check: boolean = true;
  public domain: string;
  confirm_hide: boolean = true;
  password_hide: boolean = true;
  public profile_pic: string = '';
  public address_details: boolean = false;
  public disabled: boolean = true;
  public isLoadedTopBar: boolean = false;
  public role_id = environment.ALL_ROLES.STUDENT;
  public show_semester = false;
  public show_group = false;
  public year_id: any;
  public semester_id: any;
  public group_id: any;
  public timer: any;
  //master data variables goes here
  universities = [];
  colleges = [];
  institutes = [];
  countrys = [];
  states = [];
  cities = [];
  years = [];
  semesters = [];
  groups = [];
  all_universities: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_colleges: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_institutes: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_countrys: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_states: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_cities: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_years: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_semesters: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_groups: ReplaySubject<any> = new ReplaySubject<any>(1);

  //idividual form bindings
  pStudentRegister: pStudentRegister = {
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    provider: '',
    id: '',
    password: '',
    confirm_pwd: '',
    register_type: '',
    college: '',
    university: '',
    other_college: '',
    other_university: '',
    qualification: '',
    profession: '',
    address_line_1: '',
    address_line_2: '',
    country_id: 0,
    state_id: '',
    city: '',
    zip_code: '',
    accepeted_terms: false,
  };

  constructor(
    private http: AuthService,
    private route: Router,
    private toastr: ToastrService,
    public app: GlobalApp
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('p_id') == undefined || localStorage.getItem('p_id') == ''){
      //this.route.navigateByUrl('/');
      //alert(localStorage.getItem('p_id'))
    }
    this.domain = location.origin;
    this.getCountries();
  }

  validateindividualsBasicDetails() {
    //Contact number validation
    if (!Number(this.pStudentRegister.contact_number) || (this.pStudentRegister.contact_number.length < 10 || this.pStudentRegister.contact_number.length > 13)) {
      return false;
    }

    //email
    if (!this.validateEmail(this.pStudentRegister.email)) {
      return false;
    }

    //Password validation
    if (this.pStudentRegister.password.length < 6) {
      return false;
    }

    //Password validation
    if (this.pStudentRegister.password !== this.pStudentRegister.confirm_pwd) {
      return false;
    }
    if ((this.pStudentRegister.first_name != '' && this.pStudentRegister.email != '' && this.pStudentRegister.last_name != '' &&
      this.pStudentRegister.contact_number != '' && this.pStudentRegister.password != '' && this.pStudentRegister.password.length > 5 && this.pStudentRegister.confirm_pwd != '') &&
      (this.year_id != '')) {
      return true;
      //this.individual_address_details = true;
    } else {
      return false;
    }
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

  doPartnerStudentRegistraion() {
    let validate = this.validateindividualsBasicDetails();
    if (!validate) {
      return false;
    }

    if (this.pStudentRegister.address_line_1 == '' || this.pStudentRegister.country_id == '' || this.pStudentRegister.state_id == '' || this.pStudentRegister.city == '' || this.pStudentRegister.zip_code == '') {
      this.address_details = true;
      return;
    }

    if (!this.pStudentRegister.accepeted_terms) {
      this.toastr.error("Please accept terms & conditions", 'Error', {
        closeButton: true,
        timeOut: 5000,
      });
      return;
    }

    let params = {
      url: 'partner-student-register',
      first_name: this.pStudentRegister.first_name,
      last_name: this.pStudentRegister.last_name,
      email: this.pStudentRegister.email,
      contact_number: this.pStudentRegister.contact_number,
      year_id: this.year_id,
      semester_id: this.semester_id,
      group_id: this.group_id,
      partner_id: localStorage.getItem('p_id'),
      partner_type_id: localStorage.getItem('p_type'),
      college_id: this.pStudentRegister.college,
      password: this.pStudentRegister.password,
      confirm_pwd: this.pStudentRegister.confirm_pwd,
      address_line_1: this.pStudentRegister.address_line_1,
      address_line_2: this.pStudentRegister.address_line_2,
      country_id: this.pStudentRegister.country_id,
      state_id: this.pStudentRegister.state_id,
      city: this.pStudentRegister.city,
      register_type: 'partner_student',
      zip_code: this.pStudentRegister.zip_code,
      accepeted_terms: this.pStudentRegister.accepeted_terms,
      domain: this.domain,
    }
    this.http.register(params).subscribe((res: Response) => {
      //console.log(res);
      if (res.error) {
        this.is_show = false;
        this.toastr.error(res.message, 'Error', {
          closeButton: true,
          timeOut: 5000,
        });
      } else {
        this.is_show = true;
        console.log(this.domain)
      }
    });
  }

  confirmFun() {
    this.confirm_hide = !this.confirm_hide;
  }

  passwordFun() {
    this.password_hide = !this.password_hide;
  }

  async getPartnerChilds(callFromEmail = 0) {
    if (localStorage.getItem('p_type') != '1') {
      return false;
    }
    if (callFromEmail) {
      if (this.colleges.length > 0) {
        return false;
      }
    }
    //clearTimeout(this.timer);
    //this.timer = setTimeout(() => {
      let param = {
        url: 'get-colleges',
        child_type: 1,
        partner_id: localStorage.getItem('p_id'),
        status: 1
      };
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
    //},5000);

  }

  filterPartnerCollege(event) {
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


  //Upload profile pic
  uploadImage(event) {
    let allowed_types = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];
    const uploadData = new FormData();
    let files = event.target.files;
    let file = files[0];
    if (files.length == 0) return false;
    let ext = file.name.split('.').pop().toLowerCase();
    if (allowed_types.includes(ext)) {
      uploadData.append('upload', file);
    } else {
      this.toastr.error(
        ext +
        ' Extension not allowed file (' +
        files.name +
        ') not uploaded'
      );
      return false;
    }
    let param = { url: 'upload-picture' };
    this.http.imageUpload(param, uploadData).subscribe((res) => {
      console.log(res);
      if (res['error'] == false) {
        //this.toastr.success('Files successfully uploaded.', 'File Uploaded');
        this.profile_pic = res['url'];
      }
    });
  }

  validateEmail(email) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }

  allAlphabetsWithSpaces(event) {
    // var k;  
    // k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    // return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
    var inp = String.fromCharCode(event.keyCode);

    if (/^[a-zA-Z ]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  getYears(partner_child_id = null) {
    let param = {
      url: 'get-year-semester-group-register',
      partner_id: localStorage.getItem('p_id'),
      partner_child_id: partner_child_id,
      slug: 'year',
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

  getChildDropDownData(year_id, partner_id, partner_child_id) {
    this.show_semester = false;
    this.show_group = false;
    let year_obj = this.years.find((year) => year.pk_id == year_id);
    if (year_obj.year_has_semester) {
      this.getSemesters(partner_id, partner_child_id, Boolean(year_obj.year_has_group));
    } else if (year_obj.year_has_group) {

      this.getGroups(year_id, partner_id, partner_child_id);
    }
  }

  getSemesters(partner_id = 0, partner_child_id, call_child_func = false) {
    let param = {
      url: 'get-year-semester-group-register',
      partner_id: partner_id,
      partner_child_id: partner_child_id,
      parent_id: this.year_id,
      slug: 'semester',
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.semesters = res['data'];
        if (this.semesters != undefined) {
          this.all_semesters.next(this.semesters.slice());
          this.show_semester = true;
          if (call_child_func) {
            this.getGroups(partner_id, partner_child_id, this.semester_id);
          }
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  getGroups(parent_id, partner_id = 0, partner_child_id) {
    let year_obj = this.years.find((year) => year.pk_id == this.year_id);
    if (!year_obj.year_has_group) {
      return false;
    }
    if (year_obj.year_has_semesters) {
      parent_id = this.semester_id;
    } else {
      parent_id = this.year_id;
    }

    let param = {
      url: 'get-year-semester-group-register',
      partner_id: partner_id,
      partner_child_id: partner_child_id,
      parent_id: parent_id,
      slug: 'group',
    };
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

}


export interface pStudentRegister {
  first_name: string;
  last_name: string;
  email: string;
  contact_number: any;
  provider: any;
  id: any;
  password: any;
  confirm_pwd: any;
  register_type: any;
  university: any;
  college: any;
  qualification: any;
  profession: any;
  address_line_1: any,
  address_line_2: any,
  country_id: any,
  state_id: any,
  city: any,
  zip_code: any,
  accepeted_terms: boolean,
  other_college: any,
  other_university: any,
}

export interface Response {
  error: boolean;
  token: any;
  message: string;
  role?: any;
  errors?: any;
  register_type?: any;
}