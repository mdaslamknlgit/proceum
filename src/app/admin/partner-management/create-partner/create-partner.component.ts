import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-partner',
  templateUrl: './create-partner.component.html',
  styleUrls: ['./create-partner.component.scss']
})
export class CreatePartnerComponent implements OnInit {

  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  //Tabs active vars
  public basic_details_expand: boolean = true;
  public branding_info_expand: boolean = false;
  public licence_info_expand: boolean = false;
  public billing_address_expand: boolean = false;
  //Define vars
  public partner_id = 0;
  public parent_partner_id = 0;
  public user_id = 0;
  public partner_type = '1';
  public partner_name = '';
  public email = '';
  public password = '';
  public confirm_password = '';
  public contact_name = '';
  public phone = '';
  public gstin = '';
  public header_logo = '';
  public footer_logo = '';
  public description = '';
  public package_id: any = '';
  public licence_start_date: any = new Date();
  public licence_end_date: any;
  public today_date = new Date();
  //Billing address
  public same_as_billing_address: boolean = false;
  public b_address_line_1 = '';
  public b_address_line_2 = '';
  public b_country_id: any = '';
  public b_state_id: any = '';
  public b_city = '';
  public b_pincode = '';
  //Correspondence address
  public c_address_line_1 = '';
  public c_address_line_2 = '';
  public c_country_id: any = '';
  public c_state_id: any = '';
  public c_city = '';
  public c_pincode = '';
  public domain = '';
  public code = '';
  public second_phone = '';
  public college_university: any = '';
  public is_reseller_account: boolean = false;
  public is_partner: boolean = false;
  public sub_domain = '';
  public sub_domain_err = '';
  public timer: any;

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
      this.partner_id = param.id;
      if (this.partner_id != undefined) {
        this.getPartner();
      }
      else {
        this.partner_id = 0;
      }
    });
    this.getCountries();
    this.getPackages();
    this.getPartnersListForUniversity();
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

  getPackages() {
    let filter = {};
    if (this.partner_type == '1') {
      filter = { applicable_to_university: 1 };
    }
    if (this.partner_type == '2') {
      filter = { applicable_to_college: 1 };
    }
    if (this.partner_type == '3') {
      filter = { applicable_to_institute: 1 };
    }
    let param = { url: 'get-packages', fetch_available_packages: true, ...filter };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.packages = res['data']['packages'];
        if (this.packages != undefined) {
          this.all_packages.next(this.packages.slice());

        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  filterPackages(event) {
    let search = event;
    if (!search) {
      this.all_packages.next(this.packages.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_packages.next(
      this.packages.filter(
        (item) => item.package_name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  fillLicenceDates() {
    let packageObj = this.packages.filter((item) => Number(item.pk_id) == Number(this.package_id));
    this.licence_end_date = packageObj[0].licence_end_date;
  }


  validateEmail(email) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }

  uploadImage(event, logo_type) {
    let allowed_types = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];
    const uploadData = new FormData();
    let files = event.target.files;
    let file = files[0];
    if (files.length == 0) return false;
    let ext = file.name.split('.').pop().toLowerCase();
    if (allowed_types.includes(ext)) {
      uploadData.append('upload', file);
    } else {
      this.toster.error(
        ext +
        ' Extension not allowed file (' +
        files.name +
        ') not uploaded'
      );
      return false;
    }
    let param = { url: 'upload-picture' };
    this.http.imageUpload(param, uploadData).subscribe((res) => {
      if (res['error'] == false) {
        //this.toastr.success('Files successfully uploaded.', 'File Uploaded');
        if (logo_type == 'header_logo') {
          this.header_logo = res['url'];
        } else {
          this.footer_logo = res['url'];
        }

      }
    });
  }

  validateBasicDeatils() {
    if (!this.validateEmail(this.email)) {
      return false;
    }
    if (this.password.length < 6 && this.partner_id < 0 ) {
      return;
    }
    if ((this.password !== this.confirm_password) && this.confirm_password.length < 1  && this.partner_id < 0) {
      return;
    }
    if (!Number(this.phone) || (this.phone.length < 9 || this.phone.length > 13)) {
      return;
    }
    if (this.partner_type == '1') { // partner_type == '2' is University
      if (!Number(this.second_phone) || (this.second_phone.length < 9 || this.second_phone.length > 13)) {
        return;
      }
    }
    if (this.partner_type == '1' || this.partner_type == '2') {
      if (this.code == "") {
        return;
      }
    }
    /* if(this.partner_type == '2'){ // partner_type == '2' is College
      if(!this.parent_partner_id){ //Univesity selected or not
        return;
      }
    } */
    if (this.partner_type != "" && this.partner_name != "" && this.email != "" && this.contact_name != ""  && this.gstin != "") {
      this.branding_info_expand = true;
      this.basic_details_expand = false;
    }
  }

  validateBrandingInfo() {
    if (!this.header_logo) {
      this.toster.error('Header Logo required!', 'Error', { closeButton: true });
      return;
    }
    if (!this.footer_logo) {
      this.toster.error('Footer Logo required!', 'Error', { closeButton: true });
      return;
    }
    if (this.sub_domain_err != '') {
      this.toster.error(this.sub_domain_err, 'Error', { closeButton: true });
      return;
    }
    if (this.description != "" && (this.sub_domain != "" && this.sub_domain != null) && this.sub_domain_err == '') {
      this.licence_info_expand = true;
      this.branding_info_expand = false;
    }
  }

  validateLicenceInfo() {
    if (this.package_id != 0 && this.licence_start_date != "" && this.licence_end_date != "") {
      this.billing_address_expand = true;
      this.licence_info_expand = false;
    }
  }

  validateAddressDetails() {
    if (this.c_address_line_1 != "" && this.c_country_id != 0 && this.c_state_id != "" && this.c_city != "" && this.c_pincode != "" && this.b_address_line_1 != "" && this.b_address_line_2 != "" && this.b_country_id != 0 && this.b_state_id != "" && this.b_city != "" && this.b_pincode != "") {
      this.createPartnerService();
    } else {
      console.log('validation error')
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

  createPartnerService() {
    let form_data = {
      partner_id: this.partner_id,
      parent_partner_id: this.parent_partner_id,
      user_id: this.user_id,
      partner_type: this.partner_type,
      partner_name: this.partner_name,
      email: this.email,
      password: this.password,
      contact_name: this.contact_name,
      phone: this.phone,
      second_phone: this.second_phone,
      code: this.code,
      college_university: this.college_university,
      gstin: this.gstin,
      header_logo: this.header_logo,
      footer_logo: this.footer_logo,
      description: this.description,
      package_id: this.package_id,
      licence_start_date: this.licence_start_date,
      licence_end_date: this.licence_end_date,
      today_date: this.today_date,
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
      domain: this.domain,
      is_reseller_account: this.is_reseller_account,
      sub_domain: this.sub_domain,
      is_partner: this.is_partner,
    };
    let params = { url: 'create-partner', form_data: form_data };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.navigateTo('partners-list');
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }

  getPartner() {
    let data = { url: 'edit-partner/' + this.partner_id };
    this.http.post(data).subscribe((res) => {
      if (res['error'] == false) {
        let partner = res['data'];
        this.partner_id = partner.partner_id;
        this.parent_partner_id = partner.parent_partner_id;
        this.user_id = partner.user_id;
        this.partner_type = partner.partner_type;
        this.getPackages();
        this.partner_name = partner.partner_name;
        this.email = partner.email;
        this.password = partner.password;
        this.contact_name = partner.contact_name;
        this.phone = partner.phone;
        this.second_phone = partner.second_phone;
        this.code = partner.code;
        this.college_university = partner.college_university;
        this.gstin = partner.gstin;
        this.header_logo = partner.header_logo;
        this.footer_logo = partner.footer_logo;
        this.description = partner.description;
        this.package_id = partner.package_id;
        this.licence_start_date = partner.licence_start_date;
        this.licence_end_date = partner.licence_end_date;
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
        this.getStates(this.c_country_id);
        this.c_state_id = partner.c_state_id;
        this.getCities(this.c_state_id);
        this.c_city = partner.c_city;
        this.c_pincode = partner.c_pincode;
        this.is_reseller_account = partner.is_reseller_account;
        this.sub_domain = partner.sub_domain;
        this.is_partner = partner.is_partner;
        // if(partner.licence_start_date !== null){
        //   this.licence_start_date = new Date(
        //     partner.licence_start_date
        //   );
        //   this.today_date = this.licence_start_date;
        // }
        // if(partner.licence_end_date !== null){
        //   let valid_date = partner.licence_end_date.split('-');
        //   this.licence_end_date = new Date(
        //     valid_date
        //   );
        // }
        ////////console.log(this.licence_end_date);
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

  allAlphabetsWithSpaces(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/^[a-zA-Z ]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  //To get all the Universities list
  getPartnersListForUniversity() {
    let param = { url: 'get-partners-list', partner_type_id: 1 };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.universities = res['data']['partners'];
        if (this.universities != undefined) {
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

  checkSubDomainAvailable() {
    if (this.sub_domain != "") {
      let param = {
        url: 'check-subdomain',
        sub_domain: this.sub_domain,
        partner_id: this.partner_id,
      };
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.http.post(param).subscribe((res) => {
          if (res['error'] == false) {
            this.sub_domain_err = '';
            this.toster.success('Subdomain Avaialable!', 'Success', { closeButton: true });
          } else {
            this.sub_domain_err = res['message'];
            this.toster.error(res['message'], 'Error', { closeButton: true });
          }
        });
      }, 700);

    }
  }


}
