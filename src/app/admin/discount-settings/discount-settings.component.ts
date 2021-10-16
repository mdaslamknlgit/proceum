import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';
import { exit } from 'process';

@Component({
  selector: 'app-discount-settings',
  templateUrl: './discount-settings.component.html',
  styleUrls: ['./discount-settings.component.scss'],
})
export class DiscountSettingsComponent implements OnInit {
  public discount_types = environment.DISCOUNT_TYPES;
  displayedColumns: string[] = [
    'id',
    'description',
    'discount_type',
    'package_name',
    'created_at',
    'updated_at',
    'actions',
    'status',
  ];
  today_date = new Date();
  //form fields
  country_id = 0;
  state = '';
  states = [];
  university = '';
  college = '';
  course = '';
  discount_percente = '';
  valid_from = new Date();
  valid_to = new Date();
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  dropdown_settings = {};
  public title = '';
  public discount_id = '';
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public page = 0;
  public model_status = false;
  public edit_model_status = false;
  popoverTitle = '';
  popoverMessage = '';
  countrys = [];
  packages = [];
  package_prices = [];
  country_dropdown_used_length = 1;
  country_dropdown_used_length_for_max = 1;
  public discount_type = 0;
  public min_order_amount = 0;
  public fixed_amounts = [];
  public max_discount_amount = [{pk_id:0, country_id:'', amount:'', status:'1', placeholder:'Amount'}];
  public selected_countires = [];
  public selected_countires_for_max_discounts = [];

  all_countrys: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_states: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_packages: ReplaySubject<any> = new ReplaySubject<any>(1);
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.dropdown_settings = {
      singleSelection: false,
      idField: 'pk_id',
      textField: 'country_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.getDiscounts();
    this.getPackages();
  }
  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  getDiscounts() {
    let param = { url: 'get-discounts' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['descounts']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.countrys = res['data']['countrys'];
        this.all_countrys.next(this.countrys.slice());
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
  toggleModel() {
    this.model_status = !this.model_status;
    this.today_date = new Date();
    (<HTMLFormElement>document.getElementById('discount_form')).reset();
    (<HTMLFormElement>document.getElementById('edit_discount_form')).reset();
  }
  getStates() {
    if (this.country_id > 0) {
      let param = {
        url: 'get-states',
        country_id: this.country_id,
      };
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          this.states = res['data']['states'];
          this.all_states.next(this.states.slice());
        } else {
          let message = res['errors']['title']
            ? res['errors']['title']
            : res['message'];
          this.toster.error(message, 'Error', { closeButton: true });
        }
      });
    }
  }
  createDiscount() {
    let param = {
      url: 'discount',
      title: this.title, //Used for description
      country: this.country_id,
      state: this.state,
      university: this.university,
      college: this.college,
      course: this.course, //Package_id
      discount_percente: this.discount_percente,
      valid_from: this.valid_from,
      valid_to: this.valid_to,
      //Shash
      discount_type : this.discount_type,
      fixed_amounts : this.fixed_amounts,
      package_prices : this.package_prices,


    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.toggleModel();
        this.getDiscounts();
      } else {
        let message = res['errors']['title']
          ? res['errors']['title']
          : res['message'];
        this.toster.error(message, 'Error', { closeButton: true });
      }
    });
  }
  formatValue(discount_percente) {
    this.discount_percente = this.http.setToDecimal(discount_percente);
  }
  
  editDiscount1(param) {
    this.edit_model_status = !this.edit_model_status;
    this.title = param['title'];
    this.discount_id = param['pk_id'];
    this.country_id = param['country_id'];
    this.getStates();
    this.state = '' + param['state_id'];
    this.university = '' + param['university_id'];
    this.college = '' + param['college_id'];
    this.course = '' + param['course_id'];
    this.discount_percente = param['discount_percent'];
    let valid_from = param['valid_from'].split('-');
    this.valid_from = new Date(
      Number(valid_from[2]),
      Number(valid_from[1]) - 1,
      Number(valid_from[0])
    ); // param['valid_from'];
    this.today_date = this.valid_from;
    let valid_to = param['valid_to'].split('-');
    this.valid_to = new Date(
      Number(valid_to[2]),
      Number(valid_to[1]) - 1,
      Number(valid_to[0])
    ); //param['valid_to'];
  }

  editDiscount(row) {
    let param = {
      url: 'get-discount',
      id: row.pk_id,
    }
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let param = res["data"];
        this.edit_model_status = !this.edit_model_status;
        this.title = param['description'];
        this.discount_id = param['discount_id'];
        this.course = param['package_id'];
        this.onPackageChange()
        this.discount_percente = param['discount_percent'];
        this.discount_type = param['discount_type'];
        let valid_from = param['valid_from'].split('-');
        this.valid_from = new Date(
          Number(valid_from[2]),
          Number(valid_from[1]) - 1,
          Number(valid_from[0])
        ); // param['valid_from'];
        this.today_date = this.valid_from;
        let valid_to = param['valid_to'].split('-');
        this.valid_to = new Date(
          Number(valid_to[2]),
          Number(valid_to[1]) - 1,
          Number(valid_to[0])
        ); //param['valid_to'];
        if(param['discount_type'] == 1){
          this.fixed_amounts = param['fixed_amounts'];
        }else{
          this.package_prices = param['max_discount_amounts'];
        }


      } else {
        let message = res['errors']['title']
          ? res['errors']['title']
          : res['message'];
        this.toster.error(message, 'Error', { closeButton: true });
      }
    });
  }

  updateDiscount() {
    let param = {
      url: 'discount/' + this.discount_id,
      title: this.title, //Used for description
      country: this.country_id,
      state: this.state,
      university: this.university,
      college: this.college,
      course: this.course, //Package_id
      discount_percente: this.discount_percente,
      valid_from: this.valid_from,
      valid_to: this.valid_to,
      //Shash
      discount_type : this.discount_type,
      fixed_amounts : this.fixed_amounts,
      package_prices : this.package_prices,
    };
    this.http.put(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        //(<HTMLFormElement>(
        //document.getElementById('edit_discount_form')
        //)).reset();
        this.edit_model_status = !this.edit_model_status;
        this.getDiscounts();
      } else {
        this.toster.error(res['errors']['title'], res['message'], { closeButton: true });
      }
    });
  }
  deleteDiscount(discount_id, status) {
    let param = {
      url: 'discount-status',
      id: discount_id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getDiscounts();
      } else {
        this.toster.error(res['message'], res['message'], { closeButton: true });
      }
    });
  }
  public getServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'get-discounts',
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['descounts']);
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }
  public doFilter() {
    let param = { url: 'get-discounts', search: this.search_box };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['descounts']);
      } else {
        this.dataSource = new MatTableDataSource([]);
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public onDiscountTypeChange(){
    this.onPackageChange();
  }

  addCurrencyToField(currency,index,currency_id){
    if(this.selected_countires.indexOf(currency_id) === -1){
      this.fixed_amounts[index]['placeholder'] = currency.toUpperCase();
      this.prepareSelectedCountriesArr();
    }
  }

  prepareSelectedCountriesArr(){
    this.selected_countires = [];
    let prices = this.fixed_amounts;
    this.selected_countires = prices.map(x => x.country_id);
  }

  addFixedAmountField(){
    this.country_dropdown_used_length++;
    this.fixed_amounts.push({pk_id:0, country_id:'', amount:'', status:'1', placeholder:'Amount'});
  }

  removeFixedAmountField(index){
    this.fixed_amounts[index]['status'] = "0";
    //Remove countryid from selected counties 
    let country_id = this.fixed_amounts[index]['country_id'];
    let position = this.selected_countires.indexOf(country_id);
    if (position > -1) {
      this.selected_countires.splice(position, 1);
      this.country_dropdown_used_length--;
    }
  }

  addMaximumAmountField(){
    this.country_dropdown_used_length_for_max++;
    this.max_discount_amount.push({pk_id:0, country_id:'', amount:'', status:'1', placeholder:'Amount'});
  }

  removeMaximumAmountField(index){
    this.max_discount_amount[index]['status'] = "0";
    //Remove countryid from selected counties 
    let country_id = this.max_discount_amount[index]['country_id'];
    let position = this.selected_countires_for_max_discounts.indexOf(country_id);
    if (position > -1) {
      this.selected_countires_for_max_discounts.splice(position, 1);
      this.country_dropdown_used_length_for_max--;
    }
  }

  addCurrencyToFieldForMaxDisco(currency,index,currency_id){
    if(this.selected_countires_for_max_discounts.indexOf(currency_id) === -1){
      this.max_discount_amount[index]['placeholder'] = currency.toUpperCase();
      this.prepareSelectedCountriesArrForMaxDisco();
    }
  }

  prepareSelectedCountriesArrForMaxDisco(){
    this.selected_countires_for_max_discounts = [];
    let prices = this.max_discount_amount;
    this.selected_countires_for_max_discounts = prices.map(x => x.country_id);
  }

  public getPackages() {
    let param = { url: 'get-packages','status':'1' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.packages = res['data']['packages'];
        this.all_packages.next(this.packages.slice());
      } else {
        this.packages = [{'pk_id':0, 'package_name':'No packages found!'}];
        this.all_packages.next(this.packages.slice());
      }
    });
  }

  public onPackageChange(){
    let package_id = this.course;
    let package_item = this.packages.filter(function (e) {
      return e.pk_id == package_id;
    });
    if(package_item[0]){
      this.package_prices = package_item[0].prices;
      this.fixed_amounts = package_item[0].prices;
    }
  }
  
}
