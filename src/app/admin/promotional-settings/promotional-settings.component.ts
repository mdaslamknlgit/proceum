import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-promotional-settings',
  templateUrl: './promotional-settings.component.html',
  styleUrls: ['./promotional-settings.component.scss'],
})
export class PromotionalSettingsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'code',
    'created_at',
    'updated_at',
    'actions',
    'status',
  ];

  //form fields
  description = '';
  promotional_percente = '';
  valid_from = new Date();
  valid_to = new Date();
  today_date = new Date();
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  dropdown_settings = {};
  public code = '';
  public promotional_id = '';
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public page = 0;
  public model_status = false;
  public edit_model_status = false;
  popoverTitle = '';
  popoverMessage = '';
  //Added by shash
  public countries = [];
  public selected_countires = [];
  all_countries: ReplaySubject<any> = new ReplaySubject<any>(1);
  public discount_amounts = [{pk_id:0, country_id:'', discount_amount:'', min_order_amount:'', status:'1', placeholder:'Amount'}];

  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.getPromotionals();
    this.getCountries();
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  getPromotionals() {
    let param = { url: 'get-promotionals' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['promotionals']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }
  toggleModel() {
    this.model_status = !this.model_status;
    this.today_date = new Date();
    (<HTMLFormElement>document.getElementById('promotional_form')).reset();
    (<HTMLFormElement>document.getElementById('edit_promotional_form')).reset();
  }
  generateCoupon(code) {
    let param = { url: 'promotional/generate-coupon', code: code };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.code = '';
        this.code = res['code'];
      } else {
        let message = res['message'];
        this.toster.error(message, 'Error', { closeButton: true });
      }
    });
  }
  
  createPromotional() {
    let param = {
      url: 'promotional',
      code: this.code,
      description: this.description,
      discount_amounts: this.discount_amounts,
      valid_from: this.valid_from,
      valid_to: this.valid_to,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.toggleModel();
        this.getPromotionals();
      } else {
        let message = res['errors']['code']
          ? res['errors']['code']
          : res['message'];
        this.toster.error(message, 'Error', { closeButton: true });
      }
    });
  }
  editPromotional(item) {
    let params = {
      url: 'get-promotion',
      id: item['pk_id'],
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        let param = res['data'];
        this.edit_model_status = !this.edit_model_status;
        this.code = param['code'];
        this.promotional_id = param['pk_id'];
        this.description = param['description'];
        this.discount_amounts = param['discount_amounts'];
        //set selected countries
        this.selected_countires = this.discount_amounts.map(x => x.country_id);
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
      } else {
        let message = res['errors']['code']
          ? res['errors']['code']
          : res['message'];
        this.toster.error(message, 'Error', { closeButton: true });
      }
    });
    
  }
  formatValue(promotional_percente) {
    this.promotional_percente = this.http.setToDecimal(promotional_percente);
  }
  updatePromotional() {
    let param = {
      url: 'promotional/' + this.promotional_id,
      code: this.code,
      description: this.description,
      discount_amounts: this.discount_amounts,
      valid_from: this.valid_from,
      valid_to: this.valid_to,
    };
    this.http.put(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        //(<HTMLFormElement>(
        //document.getElementById('edit_promotional_form')
        //)).reset();
        this.edit_model_status = !this.edit_model_status;
        this.getPromotionals();
      } else {
        this.toster.error(res['errors']['code'], res['message'], {
          closeButton: true,
        });
      }
    });
  }
  deletePromotional(promotional_id, status) {
    let param = {
      url: 'promotional-status',
      id: promotional_id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getPromotionals();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }
  public getServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'get-promotionals',
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
    };
    this.http.post(param).subscribe((res) => {
      console.log(res['data']['promotionals']);
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['promotionals']);
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }
  public doFilter() {
    let param = { url: 'get-promotionals', search: this.search_box };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['promotionals']);
      } else {
        this.dataSource = new MatTableDataSource([]);
        //this.toster.error(res['message'], 'Error');
      }
    });
  }
  //Added by shash
  public addCurrencyToField(currency,index,currency_id){
    if(this.selected_countires.indexOf(currency_id) === -1){
      this.discount_amounts[index]['placeholder'] = currency.toUpperCase();
      this.prepareSelectedCountriesArr();
    }
  }
  public prepareSelectedCountriesArr(){
    this.selected_countires = [];
    let amounts = this.discount_amounts;
    this.selected_countires = amounts.map(x => x.country_id);
  }

  public addDiscountAmountField(){
    this.discount_amounts.push({pk_id:0, country_id:'', discount_amount:'', min_order_amount:'', status:'1', placeholder:'Amount'});
  }

  public removeDiscountAmountField(index){
    this.discount_amounts[index]['status'] = "0";
    //Remove countryid from selected counties 
    let country_id = this.discount_amounts[index]['country_id'];
    let position = this.selected_countires.indexOf(country_id);
    if (position > -1) {
      this.selected_countires.splice(position, 1);
      //this.country_dropdown_used_length--;
    }
  }

  public getCountries(){
    let param = { url: 'get-countries' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.countries = res['data']['countries'];
        if(this.countries != undefined){
          this.all_countries.next(this.countries.slice());
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

}
