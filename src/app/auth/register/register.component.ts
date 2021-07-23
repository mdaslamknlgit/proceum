import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material/stepper';
import { ReplaySubject } from 'rxjs';
import {FormControl} from '@angular/forms';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
  //variables goes here
  myControl = new FormControl();
  isLinear = false; //for stepper
  is_second:boolean=false;
  socialUser: SocialUser;
  public is_login: boolean = false;
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
  public address_details:boolean = false;
  public disabled:boolean = true;
  //master data variables goes here
  universities = [];
  colleges = [];
  institutes = [];
  countrys = [];
  states = [];
  all_universities: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_colleges: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_institutes: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_countrys: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_states: ReplaySubject<any> = new ReplaySubject<any>(1);

  //idividual form bindings
  individualRegister: IndividualRegister = {
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
    qualification : '',
    profession : '',
    address_line_1:'',
    address_line_2:'',
    country_id:0,
    state_id:'',
    city:'',
    zip_code:'',
    accepeted_terms:false,
  };

  //institution form bindings
  institutionResgister: InstitutionResgister = {
    university_name:'',
    university_code:'',
    university_primary_contact:'',
    university_secondary_contact:'',
    university_contact_person:'',
    university_email:'',

    college_name:'',
    college_code:'',
    college_primary_contact:'',
    college_university:'',
    college_contact_person:'',
    college_email:'',

    institute_name:'',
    institute_primary_contact:'',
    institute_contact_person:'',
    institute_email:'',
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    provider: '',
    id: '',
    password: '',
    confirm_pwd: '',
    register_type: '',
    college : '',
    qualification : '',
    profession : '',
    address_line_1:'',
    address_line_2:'',
    country_id:'',
    state_id:'',
    city:'',
    zip_code:'',
    accepeted_terms:false,
  }
  
  constructor(
    private http: AuthService,
    private route: Router,
    private toastr: ToastrService,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    this.domain = location.origin;
    this.getSocialAuth();
    this.getCountries();
    this.getPartnersListForUniversity();
    this.getPartnersListForColleges();
    
  }
  
  //Activate html form institution types
  radioChange(institution_type: string, form) {
    form.resetForm();
    this.profile_pic = '';
    this.individualRegister.accepeted_terms = false;
    this.institutionResgister.accepeted_terms = false;
    if (institution_type == '1') {
      this.institutionResgister.register_type = 'university';
      this.is_university = true;
      this.is_college = false;
      this.is_coaching_institute = false;
    } else if (institution_type == '2') {
      this.institutionResgister.register_type = 'college';
      this.is_university = false;
      this.is_college = true;
      this.is_coaching_institute = false;
    } else if(institution_type == '3'){
      this.institutionResgister.register_type = 'institute';
      this.is_university = false;
      this.is_college = false;
      this.is_coaching_institute = true;
    }
  }

  //Activate html form based on registration type
  registrationForm(registration_type: string) {
    this.profile_pic = '';
    this.address_details = false;
    this.is_university = false;
    this.is_college = false;
    this.is_coaching_institute = false;
    if (registration_type == 'individual') {
      this.is_account_type = false;
      this.is_individual = true;
      this.is_institution = false;
    } else if (registration_type == 'institution') {
      this.institutionResgister.register_type = 'university';
      this.is_university = true;
      this.is_account_type = false;
      this.is_individual = false;
      this.is_institution = true;
    } else {
      this.is_account_type = true;
      this.is_individual = false;
      this.is_institution = false;
    }
  }

  //Social auth
  getSocialAuth(){
    this.socialAuthService.authState.subscribe((user) => {
      if (user && this.is_login == false) {
        this.is_login = true;
        this.socialUser = user;
        this.individualRegister.first_name = this.socialUser.firstName;
        this.individualRegister.last_name = this.socialUser.lastName;
        this.individualRegister.email = this.socialUser.email;
        this.individualRegister.password = 'Proceum@123';
        this.individualRegister.confirm_pwd = 'Proceum@123';
        this.individualRegister.register_type = 'SL';
        this.individualRegister.provider = this.socialUser.provider;
        this.individualRegister.id = this.socialUser.id;
        this.registerService();
      }
    });
  }

  validateindividualsBasicDetails(stepper:MatStepper){
    //Contact number validation
    if(!Number(this.individualRegister.contact_number) || (this.individualRegister.contact_number.length < 10 || this.individualRegister.contact_number.length > 13)){
      return;
    }

    //email
    if(!this.validateEmail(this.individualRegister.email)){
      return false;
    }

    //Password validation
    if(this.individualRegister.password.length < 6){
      return;
    }

    //Password validation
    if(this.individualRegister.password !== this.individualRegister.confirm_pwd){
      return;
    }

    if((this.individualRegister.first_name != '' && this.individualRegister.email != '' && this.individualRegister.last_name != '' && 
    this.individualRegister.contact_number != '' && this.individualRegister.password != '' && this.individualRegister.password.length > 5 && this.individualRegister.confirm_pwd != '' && this.individualRegister.qualification != '' && this.individualRegister.profession != '') && (this.individualRegister.university != '' || this.individualRegister.college != '') ){
      stepper.next();
      //this.individual_address_details = true;
    }
  }

  validateInstitutionBasicDetails(stepper:MatStepper){
    
    if(this.is_university){
      //Contact number validation
      if(!Number(this.institutionResgister.university_primary_contact) || (this.institutionResgister.university_primary_contact.length < 10 || this.institutionResgister.university_primary_contact.length > 13)){
        return;
      }
      if(!Number(this.institutionResgister.university_secondary_contact) || (this.institutionResgister.university_secondary_contact.length < 10 || this.institutionResgister.university_secondary_contact.length > 13)){
        return;
      }
      
      //Password validation
      if(this.institutionResgister.password.length < 6){
        return;
      }

      //email
      if(!this.validateEmail(this.institutionResgister.university_email)){
        return false;
      }

      //Password validation
      if(this.institutionResgister.password !== this.institutionResgister.confirm_pwd){
        return;
      }

      if(this.institutionResgister.university_name != '' && this.institutionResgister.university_primary_contact != '' && this.institutionResgister.university_contact_person != '' && this.institutionResgister.password != '' && this.institutionResgister.university_code != '' && this.institutionResgister.university_secondary_contact != '' && this.institutionResgister.university_email != '' && this.institutionResgister.confirm_pwd != '' ){
       stepper.next();
      }
    }


    if(this.is_college){
      //Contact number validation
      if(!Number(this.institutionResgister.college_primary_contact) || (this.institutionResgister.college_primary_contact.length < 10 || this.institutionResgister.college_primary_contact.length > 13)){
        return;
      }
      
      //Password validation
      if(this.institutionResgister.password.length < 6){
        return;
      }

      //email
      if(!this.validateEmail(this.institutionResgister.college_email)){
        return false;
      }

      //Password validation
      if(this.institutionResgister.password !== this.institutionResgister.confirm_pwd){
        return;
      }

      if(this.institutionResgister.college_name != '' && this.institutionResgister.college_primary_contact != '' && this.institutionResgister.password != '' && this.institutionResgister.college_code != '' && this.institutionResgister.college_contact_person != '' && this.institutionResgister.college_email != '' && this.institutionResgister.confirm_pwd != '' ){
        stepper.next();
      }
    }

    if(this.is_coaching_institute){
      //Contact number validation
      if(!Number(this.institutionResgister.institute_primary_contact) || (this.institutionResgister.institute_primary_contact.length < 10 || this.institutionResgister.institute_primary_contact.length > 13)){
        return;
      }
      
      //email
      if(!this.validateEmail(this.institutionResgister.institute_email)){
        return false;
      }

      //Password validation
      if(this.institutionResgister.password.length < 6){
        return;
      }

      //Password validation
      if(this.institutionResgister.password !== this.institutionResgister.confirm_pwd){
        return;
      }

      if(this.institutionResgister.institute_name != '' && this.institutionResgister.institute_primary_contact != '' && this.institutionResgister.password != '' && this.institutionResgister.institute_contact_person != '' && this.institutionResgister.institute_email != '' && this.institutionResgister.confirm_pwd != '' ){
        stepper.next();
       }
    }
  }

  getCountries(){
    let param = { url: 'get-countries' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.countrys = res['data']['countries'];
        if(this.countrys != undefined){
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
          console.log(this.states);
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

  doIdividualRegistraion(){
    if(this.individualRegister.address_line_1 == '' || this.individualRegister.country_id == '' || this.individualRegister.state_id == '' || this.individualRegister.city == '' || this.individualRegister.zip_code == ''){
      this.address_details = true;
      return;
    }

    if(!this.individualRegister.accepeted_terms){
      this.toastr.error("Please accept terms & conditions", 'Error', {
        closeButton: true,
        timeOut: 5000,
      });
      return;
    }

    let params = {
      url: 'register',
      first_name : this.individualRegister.first_name,
      last_name : this.individualRegister.last_name,
      email : this.individualRegister.email,
      contact_number : this.individualRegister.contact_number,
      university : this.individualRegister.university,
      college : this.individualRegister.college,
      profession : this.individualRegister.profession,
      qualification : this.individualRegister.qualification,
      password : this.individualRegister.password,
      confirm_pwd : this.individualRegister.confirm_pwd,
      address_line_1 : this.individualRegister.address_line_1,
      address_line_2 : this.individualRegister.address_line_2,
      country_id : this.individualRegister.country_id,
      state_id : this.individualRegister.state_id,
      city : this.individualRegister.city,
      register_type : 'individual',
      zip_code : this.individualRegister.zip_code,
      accepeted_terms : this.individualRegister.accepeted_terms,
      domain : this.domain,
      profile_pic : this.profile_pic
    }
    this.http.register(params).subscribe((res: Response) => {
      //console.log(res);
      if (res.error) {
        this.is_show = false;
        this.toastr.error(res.message, 'Error', {
          closeButton: true,
          timeOut: 5000,
        });
      }else{
        this.is_account_type = false;
        this.is_individual = false;
        this.is_institution = false;
        this.is_show = true;
      }  
    });
  }

  doInstitutionRegistraion(){
    if(this.institutionResgister.address_line_1 == '' || this.institutionResgister.country_id == '' || this.institutionResgister.state_id == '' || this.institutionResgister.city == '' || this.institutionResgister.zip_code == ''){
      this.address_details = true;
      return;
    }

    if(this.institutionResgister.address_line_1 == null || this.institutionResgister.country_id == null || this.institutionResgister.state_id == null || this.institutionResgister.city == null || this.institutionResgister.zip_code == null){
      this.address_details = true;
      return;
    }

    if(!this.institutionResgister.accepeted_terms){
      this.toastr.error("Please accept terms & conditions", 'Error', {
        closeButton: true,
        timeOut: 5000,
      });
      return;
    }

    let params = {
      url: 'register',
      //Below are related to university registration
      university_name: this.institutionResgister.university_name,
      university_code: this.institutionResgister.university_code,
      university_primary_contact: this.institutionResgister.university_primary_contact,
      university_secondary_contact: this.institutionResgister.university_secondary_contact,
      university_contact_person: this.institutionResgister.university_contact_person,
      university_email: this.institutionResgister.university_email,
      
      //Below are related to college registration
      college_name: this.institutionResgister.college_name,
      college_code: this.institutionResgister.college_code,
      college_primary_contact: this.institutionResgister.college_primary_contact,
      college_university: this.institutionResgister.college_university,
      college_contact_person: this.institutionResgister.college_contact_person,
      college_email: this.institutionResgister.college_email,
      
      //Below are related to coaching institute registration
      institute_name: this.institutionResgister.institute_name,
      institute_primary_contact: this.institutionResgister.institute_primary_contact,
      institute_contact_person: this.institutionResgister.institute_contact_person,
      institute_email: this.institutionResgister.institute_email,
      
      //common fields
      password : this.institutionResgister.password,
      confirm_pwd : this.institutionResgister.confirm_pwd,
      address_line_1 : this.institutionResgister.address_line_1,
      address_line_2 : this.institutionResgister.address_line_2,
      country_id : this.institutionResgister.country_id,
      state_id : this.institutionResgister.state_id,
      city : this.institutionResgister.city,
      register_type : this.institutionResgister.register_type, //Don't remove this
      zip_code : this.institutionResgister.zip_code,
      accepeted_terms : this.institutionResgister.accepeted_terms,
      domain : this.domain,
      profile_pic : this.profile_pic

    }
    this.http.register(params).subscribe((res: Response) => {
      if (res.error) {
        this.is_show = false;
        this.toastr.error(res.message, 'Error', {
          closeButton: true,
          timeOut: 5000,
        });
      }else{
        this.is_account_type = false;
        this.is_individual = false;
        this.is_institution = false;
        this.is_show = true;
      } 

    });
  }

  registerService() {
    let params = {
      url: 'register',
      first_name: this.individualRegister.first_name,
      last_name: this.individualRegister.last_name,
      email: this.individualRegister.email,
      password: this.individualRegister.password,
      role: 2,
      register_type: this.individualRegister.register_type,
      provider: this.individualRegister.provider,
      id: this.individualRegister.id,
      domain: this.domain,
    };
    this.http.register(params).subscribe((res: Response) => {
      if (res.error) {
        if (res.register_type == 'SL') {
          this.socialAuthService.signOut(true);
          this.individualRegister = {
            first_name: '',
            last_name: '',
            email: '',
            contact_number: '',
            provider: '',
            id: '',
            password: '',
            confirm_pwd: '',
            register_type: '',
            university:'',
            college: '',
            qualification: '',
            profession: '',
            address_line_1:'',
            address_line_2:'',
            country_id:'',
            state_id:'',
            city:'',
            zip_code:'',
            accepeted_terms:false,
          };
          this.toastr.error(res.message, 'Error', {
            closeButton: true,
            timeOut: 5000,
          });
        } else {
          this.is_show = false;
          this.toastr.error(res.message, 'Error', {
            closeButton: true,
            timeOut: 5000,
          });
        }
      }else {
        localStorage.setItem('_token', res['data'].token);
        let json_user = btoa(JSON.stringify(res['data'].user));
        localStorage.setItem('user', json_user);
        if (res['data']['user']['role'] == 1) {
          //admin
          let redirect_url = localStorage.getItem('_redirect_url')
            ? localStorage.getItem('_redirect_url')
            : '/admin/dashboard';
          localStorage.removeItem('_redirect_url');
          this.route.navigate([redirect_url]);
        } else if (res['data']['user']['role'] == 3 || res['data']['user']['role'] == 4 || res['data']['user']['role'] == 5 || res['data']['user']['role'] == 6 || res['data']['user']['role'] == 7) {
          //Reviewer L1, L2,L3 Approver
          let redirect_url = localStorage.getItem('_redirect_url')
            ? localStorage.getItem('_redirect_url')
            : '/reviewer/dashboard';
          localStorage.removeItem('_redirect_url');
          this.route.navigate([redirect_url]);
        } else {
          //student or others
          let redirect_url = localStorage.getItem('_redirect_url')
            ? localStorage.getItem('_redirect_url')
            : '/student/dashboard';
          localStorage.removeItem('_redirect_url');
          this.route.navigate([redirect_url]);
        }
      }
    });
  }

  confirmFun() {
    this.confirm_hide = !this.confirm_hide;
  }

  passwordFun() {
    this.password_hide = !this.password_hide;
  }

  sociallogin(social_type: string): void {
    if (social_type == 'GG') {
      this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    } else if (social_type == 'FB') {
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    } else if (social_type == 'AP') {
    }
  }

  //To get all the Universities list
  getPartnersListForUniversity(){
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

  filterPartnersListForUniversity(event) {
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
  getPartnersListForColleges(){
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

  filterPartnersListForCollege(event) {
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
        this.institutes = res['data']['institutes'];
        if(this.institutes != undefined){
          this.all_institutes.next(this.institutes.slice()); 
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
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

  allAlphabetsWithSpaces(event){   
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
}

export interface IndividualRegister {
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
  address_line_1:any,
  address_line_2:any,
  country_id:any,
  state_id:any,
  city:any,
  zip_code:any,
  accepeted_terms: boolean,

}

export interface InstitutionResgister {
  university_name: string;
  university_code: any;
  university_primary_contact: any;
  university_secondary_contact: any;
  university_contact_person: any;
  university_email: any;

  college_name: string;
  college_code: any;
  college_primary_contact: any;
  college_university:any;
  college_contact_person: any;
  college_email:any;

  institute_name: string;
  institute_primary_contact: any;
  institute_contact_person: any;
  institute_email:any;

  first_name: string;
  last_name: string;
  email: string;
  contact_number: any;
  provider: any;
  id: any;
  password: any;
  confirm_pwd: any;
  register_type: any;
  college: any;
  qualification: any;
  profession: any;
  address_line_1:any,
  address_line_2:any,
  country_id:any,
  state_id:any,
  city:any,
  zip_code:any,
  accepeted_terms: boolean,

}

export interface Response {
  error: boolean;
  token: any;
  message: string;
  role?: any;
  errors?: any;
  register_type?: any;
}
