import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    'university',
    'college',
    'course',
    'created_at',
    'updated_at',
    'actions',
  ];

  //form fields
  country_id = 0;
  state = '';
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
        this.dataSource = new MatTableDataSource(res['data']['descounts']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.countrys = res['data']['countrys'];
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
      country: this.country_id,
      state: this.state,
      university: this.university,
      college: this.college,
      course: this.course,
      discount_percente: this.discount_percente,
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
    console.log(param);
    this.edit_model_status = !this.edit_model_status;
    this.title = param['title'];
    this.discount_id = param['pk_id'];
    this.country_id = param['country_id'];
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
    let valid_to = param['valid_to'].split('-');
    this.valid_to = new Date(
      Number(valid_to[2]),
      Number(valid_to[1]) - 1,
      Number(valid_to[0])
    ); //param['valid_to'];
  }
  updateDiscount() {
    let param = {
      url: 'discount/' + this.discount_id,
      title: this.title,
      country: this.country_id,
      state: this.state,
      university: this.university,
      college: this.college,
      course: this.course,
      discount_percente: this.discount_percente,
      valid_from: this.valid_from,
      valid_to: this.valid_to,
    };
    this.http.put(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        //(<HTMLFormElement>(
        //document.getElementById('edit_discount_form')
        //)).reset();
        this.edit_model_status = !this.edit_model_status;
        this.getDiscounts();
      } else {
        this.toster.error(res['errors']['title'], res['message']);
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
        this.toster.success(res['message'], 'Success');
        this.getDiscounts();
      } else {
        this.toster.error(res['message'], res['message']);
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
        this.dataSource = new MatTableDataSource(res['data']['steps']);
        this.totalSize = res['total_records'];
      } else {
        this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }
  public doFilter(value: string) {
    let param = { url: 'get-discounts', search: this.search_box };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['descounts']);
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }
}
