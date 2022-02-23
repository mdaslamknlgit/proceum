import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-college',
  templateUrl: './create-college.component.html',
  styleUrls: ['./create-college.component.scss']
})
export class CreateCollegeComponent implements OnInit {

  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  //Define vars
  public college_id = 0;
  public user_id = 0;
  public college_name = '';
  public email = '';
  public contact_name = '';
  public password = '';
  public confirm_password = '';
  public phone = '';
  public gstin = '';
  public child_type = 1;
  public description = '';
  //Billing address
  public same_as_billing_address: boolean = false;
  public b_address_line_1 = '';
  public b_address_line_2 = '';
  public b_country_id: any = '';
  public b_state_id: any = '';
  public b_city: any = '';
  public b_pincode = '';
  //Correspondence address
  public c_address_line_1 = '';
  public c_address_line_2 = '';
  public c_country_id: any = '';
  public c_state_id: any = '';
  public c_city: any = '';
  public c_pincode = '';
  public domain = '';
  public code = '';
  public second_phone = '';
  public partner_id: number = 0;
  public pk_id: number = 0;
  public url_param:any;

  countrys = [];
  states = [];
  cities = [];
  packages = [];
  public user = [];
  universities = [];
  all_universities: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_countrys: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_states: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_cities: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_packages: ReplaySubject<any> = new ReplaySubject<any>(1);


  ngOnInit(): void {
    this.domain = location.origin;
    this.user = this.http.getUser();
    this.activatedRoute.params.subscribe((param) => {
      if (Number(this.user['role']) == environment.PROCEUM_ADMIN_SPECIFIC_ROLES.SUPER_ADMIN) {
        this.partner_id = param.partner_id;
        this.url_param = '/'+param.partner_id;
        this.pk_id = (param.pk_id) ? param.pk_id : 0;
        if(!this.partner_id){
            this.toster.error('UnAuthorized Access!', 'Error', { closeButton: true });
            window.location.href = environment.APP_BASE_URL;
        }
        if (this.pk_id) {
          this.getCollege();
        }
      } else if (Number(this.user['role']) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.UNIVERSITY_ADMIN) {
        this.pk_id = (param.partner_id) ? param.partner_id : 0; //Here partner_id means partner child id(ie.,College)
        this.url_param = '';
        if (this.pk_id) {
          this.getCollege();
        }
      } else {
        this.toster.error('UnAuthorized Access!', 'Error', { closeButton: true });
        window.location.href = environment.APP_BASE_URL;
      }
    });
    /* this.activatedRoute.params.subscribe((param) => {
      this.college_id = param.id;
      if (this.college_id != undefined) {
        this.getCollege();
      }
      else {
        this.college_id = 0;
      }
    }); */
    this.getCountries();
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


  submitFrom() {
    if (this.email == "" || !this.validateEmail(this.email)) {
      return false;
    }
    if (!Number(this.phone) || (this.phone.length < 9 || this.phone.length > 13)) {
      return false;
    }

    if (!this.pk_id && this.password.length < 6) {
      return false;
    }

    if (!this.pk_id && this.password != this.confirm_password) {
      return false;
    }

    if (this.college_name == "" || this.contact_name == "" && this.code == "") {
      return false;
    }
    if (this.b_address_line_1 != ""  && this.b_country_id != 0 && this.b_state_id != "" &&
      this.b_city != "" && this.b_pincode != "") {
      this.createCollegeService();
    }
  }

  sameAsBillingAddress() {
    if (this.same_as_billing_address) {
      this.c_address_line_1 = this.b_address_line_1;
      this.c_address_line_2 = this.b_address_line_2;
      this.c_country_id = this.b_country_id;;
      this.c_state_id = this.b_state_id;
      this.c_city = this.b_city;
      this.c_pincode = this.b_pincode;
    } else {
      this.c_address_line_1 = '';
      this.c_address_line_2 = '';
      this.c_country_id = 0;
      this.c_state_id = '';
      this.c_city = '';
      this.c_pincode = '';
    }

  }

  createCollegeService() {
    let form_data = {
      pk_id: this.pk_id,
      child_type: this.child_type,
      partner_id: this.partner_id,
      partner_name: this.college_name,
      email: this.email,
      password: this.password,
      contact_name: this.contact_name,
      phone: this.phone,
      second_phone: this.second_phone,
      code: this.code,
      gstin: this.gstin,
      description: this.description,
      //Billing address
      same_as_billing_address: this.same_as_billing_address,
      b_address_line_1: this.b_address_line_1,
      b_address_line_2: this.b_address_line_2,
      b_country_id: this.b_country_id,
      b_state_id: this.b_state_id,
      b_city: this.b_city,
      b_pincode: this.b_pincode,
      //Correspondence address
      c_address_line_1: this.c_address_line_1,
      c_address_line_2: this.c_address_line_2,
      c_country_id: this.c_country_id,
      c_state_id: this.c_state_id,
      c_city: this.c_city,
      c_pincode: this.c_pincode,
      domain: this.domain
    };
    let params = { url: 'create-partner-child', form_data: form_data };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        if (Number(this.user['role']) == environment.PROCEUM_ADMIN_SPECIFIC_ROLES.SUPER_ADMIN) {
          this.navigateTo('college-list/'+this.partner_id);
        }else{
          this.navigateTo('college-list');
        }

      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }

  getCollege() {
    let data = {};
    if (Number(this.user['role']) == environment.PROCEUM_ADMIN_SPECIFIC_ROLES.SUPER_ADMIN) {
      data = { url: 'edit-partner-child/' + this.pk_id, partner_id: this.partner_id };
    }else if(Number(this.user['role']) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.UNIVERSITY_ADMIN){
      data = { url: 'edit-partner-child/' + this.pk_id };
    }else{
      this.toster.error('UnAuthorized Access!', 'Error', { closeButton: true });
      window.location.href = environment.APP_BASE_URL;
    }

    this.http.post(data).subscribe((res) => {
      if (res['error'] == false) {
        let partner = res['data'];
        this.child_type = partner.child_type;
        this.pk_id = partner.pk_id;
        this.partner_id = partner.partner_id;
        this.college_name = partner.partner_name;
        this.email = partner.email;
        this.contact_name = partner.contact_name;
        this.phone = partner.phone;
        this.second_phone = partner.second_phone;
        this.code = partner.code;
        this.gstin = partner.gstin;
        this.description = partner.description;
        //Billing address
        this.b_address_line_1 = partner.b_address_line_1;
        this.b_address_line_2 = partner.b_address_line_2;
        this.b_country_id = partner.b_country_id;
        this.getStates(this.b_country_id);
        this.b_state_id = partner.b_state_id;
        this.getCities(this.b_state_id);
        this.b_city = partner.b_city;
        this.b_pincode = partner.b_pincode;
        //Correspondence address
        this.c_address_line_1 = partner.c_address_line_1;
        this.c_address_line_2 = partner.c_address_line_2;
        this.c_country_id = partner.c_country_id;
        //this.getStates(this.c_country_id);
        this.c_state_id = partner.c_state_id;
        //this.getCities(this.c_state_id);
        this.c_city = partner.c_city;
        this.c_pincode = partner.c_pincode;
      }
    });
  }

  navigateTo(url) {
    let user = this.http.getUser();
    if (Number(user['role']) == environment.ALL_ROLES.SUPER_ADMIN || Number(user['role']) == environment.ALL_ROLES.UNIVERSITY_ADMIN) {
      url = "/admin/" + url;
      this.router.navigateByUrl(url);
    }else{
      this.toster.error('UnAuthorized Access!', 'Error', { closeButton: true });
      window.location.href = environment.APP_BASE_URL;
    }



  }

  allAlphabetsWithSpaces(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/^[a-zA-Z ]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }




}

