import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-create-universities-colleges',
  templateUrl: './create-universities-colleges.component.html',
  styleUrls: ['./create-universities-colleges.component.scss']
})
export class CreateUniversitiesCollegesComponent implements OnInit {

  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  //Define vars
  public user_id = 0;
  public college_name = '';
  public email = '';
  public contact_name = '';
  public password = '';
  public confirm_password = '';
  public phone = '';
  public flag = 1;
  public description = '';
  public same_as_billing_address: boolean = false;
  public address_line_1 = '';
  public address_line_2 = '';
  public country_id: any = '';
  public state_id: any = '';
  public city: any = '';
  public postal_code = '';
  public domain = '';
  public code = '';
  public second_phone = '';
  public pk_id: number = 0;
  public parent_id: any = '';
  public org_type = '1';

  countrys = [];
  states = [];
  cities = [];
  public user = [];
  universities = [];
  all_universities: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_countrys: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_states: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_cities: ReplaySubject<any> = new ReplaySubject<any>(1);


  ngOnInit(): void {
    this.domain = location.origin;
    this.user = this.http.getUser();
    this.activatedRoute.params.subscribe((param) => {
      this.pk_id = (param.id) ? param.id : 0;
      if (this.pk_id) {
        this.getUniversityOrCollege();
      }
    });
    this.getCountries();
    this.getUniversities();
  }
  
  getUniversityOrCollege() {

  }

  getUniversities() {
    let param = { url: 'get-universities-colleges' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.universities = res['data'];
        if (this.universities != undefined) {
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
        (uni) => uni.organization_name.toLowerCase().indexOf(search) > -1
      )
    );
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
    if (this.college_name == "" || this.contact_name == "") {
      return false;
    }
    if (this.org_type == "2" && this.parent_id < 0) {
      return false;
    }
    if (this.address_line_1 != "" && this.country_id != 0 && this.state_id != "" &&
      this.city != "" && this.postal_code != "") {
      this.createUCService();
    }
  }


  createUCService() {
    let params = {
      url: 'create-university-or-college',
      pk_id: this.pk_id,
      flag: this.flag,
      parent_id: this.parent_id,
      organization_name: this.college_name,
      contact_email: this.email,
      contact_person: this.contact_name,
      contact_number_1: this.phone,
      contact_number_2: this.second_phone,
      organization_code: this.code,
      address_line_1: this.address_line_1,
      address_line_2: this.address_line_2,
      country_id: this.country_id,
      state_id: this.state_id,
      city: this.city,
      postal_code: this.postal_code,
      domain: this.domain
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.navigateTo('universities-colleges');
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }


  navigateTo(url) {
    let user = this.http.getUser();
    if (Number(user['role']) == environment.ALL_ROLES.SUPER_ADMIN) {
      url = "/admin/" + url;
      this.router.navigateByUrl(url);
    } else {
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
