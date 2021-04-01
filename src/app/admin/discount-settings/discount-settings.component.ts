import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-discount-settings',
  templateUrl: './discount-settings.component.html',
  styleUrls: ['./discount-settings.component.scss'],
})
export class DiscountSettingsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'title',
    'status',
    'created_at',
    'updated_at',
    'actions',
  ];
  countrys = [
    { pk_id: 1, country_name: 'india' },
    { pk_id: 2, country_name: 'Barbado' },
  ];
  //form fields
  selected_countrys = [];
  discount_type = '';
  discount_percente = '';
  discount_amount_bbd = '';
  discount_amount_inr = '';
  description = '';
  min_order_amount = '';
  max_amount = '';
  max_descount_amount = '';
  valid_from = '';
  valid_to = '';

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
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  getDiscounts() {
    let param = { url: 'get-discounts' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['discounts']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }
  toggleModel() {
    this.model_status = !this.model_status;
    (<HTMLFormElement>document.getElementById('discount_form')).reset();
    (<HTMLFormElement>document.getElementById('edit_discount_form')).reset();
  }
  createDiscount() {
    let param = {
      url: 'discount',
      title: this.title,
      selected_countrys: this.selected_countrys,
      discount_type: this.discount_type,
      discount_percente: this.discount_percente,
      discount_amount_bbd: this.discount_amount_bbd,
      discount_amount_inr: this.discount_amount_inr,
      description: this.description,
      min_order_amount: this.min_order_amount,
      max_amount: this.max_amount,
      max_discount: this.max_descount_amount,
      valid_from: this.valid_from,
      valid_to: this.valid_to,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        this.toggleModel();
        this.getDiscounts();
      } else {
        let message = res['errors']['title']
          ? res['errors']['title']
          : res['message'];
        this.toster.error(message, 'Error');
      }
    });
  }
  editDiscount(param) {
    this.edit_model_status = !this.edit_model_status;
    this.title = param['name'];
    this.discount_id = param['id'];
  }
  updateDiscount() {
    let param = {
      url: 'discount/' + this.discount_id,
      title: this.title,
    };
    this.http.put(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        (<HTMLFormElement>(
          document.getElementById('edit_discount_form')
        )).reset();
        this.edit_model_status = !this.edit_model_status;
        this.getDiscounts();
      } else {
        this.toster.error(res['errors']['title'], res['message']);
      }
    });
  }
  deleteDiscount(discount_id, status) {
    status = status == 1 ? '0' : '1';
    let param = {
      url: 'discount-status/' + discount_id + '/' + status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        this.getDiscounts();
      } else {
        this.toster.error(res['message'], res['message']);
      }
    });
  }
  public getServerData(event?: PageEvent) {
    // this.page = event.pageSize * event.pageIndex;
    // let param = {
    //   url: 'get-discounts',
    //   offset: this.page,
    //   limit: event.pageSize,
    //   order_by: this.sort_by,
    //   search: this.search_box,
    // };
    // this.http.post(param).subscribe((res) => {
    //   if (res['error'] == false) {
    //     this.dataSource = new MatTableDataSource(res['data']['steps']);
    //     this.totalSize = res['total_records'];
    //   } else {
    //     this.toster.info(res['message'], 'Error');
    //     this.dataSource = new MatTableDataSource([]);
    //   }
    // });
  }
  public doFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}
