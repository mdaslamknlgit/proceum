import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-promotional-settings',
  templateUrl: './promotional-settings.component.html',
  styleUrls: ['./promotional-settings.component.scss'],
})
export class PromotionalSettingsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'code',
    'status',
    'course',
    'created_at',
    'updated_at',
    'actions',
  ];

  //form fields
  description = '';
  course = '';
  usage: any;
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
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.getPromotionals();
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
        this.toster.error(res['message'], 'Error');
      }
    });
  }
  toggleModel() {
    this.model_status = !this.model_status;
    (<HTMLFormElement>document.getElementById('promotional_form')).reset();
    (<HTMLFormElement>document.getElementById('edit_promotional_form')).reset();
  }
  generateCoupon() {
    let param = { url: 'promotional/generate-coupon', code: this.code };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.code = res['code'];
      } else {
        let message = res['message'];
        this.toster.error(message, 'Error');
      }
    });
  }
  createPromotional() {
    let param = {
      url: 'promotional',
      code: this.code,
      description: this.description,
      course: this.course,
      promotional_percente: this.promotional_percente,
      valid_from: this.valid_from,
      valid_to: this.valid_to,
      usage: this.usage,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        this.toggleModel();
        this.getPromotionals();
      } else {
        let message = res['errors']['code']
          ? res['errors']['code']
          : res['message'];
        this.toster.error(message, 'Error');
      }
    });
  }
  editPromotional(param) {
    this.edit_model_status = !this.edit_model_status;
    this.code = param['code'];
    this.promotional_id = param['pk_id'];
    this.description = '' + param['description'];
    this.course = '' + param['course_id'];
    this.promotional_percente = param['promotional_percent'];
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
    this.usage = param['usage'];
  }
  formatValue(promotional_percente) {
    this.promotional_percente = this.http.setToDecimal(promotional_percente);
  }
  updatePromotional() {
    let param = {
      url: 'promotional/' + this.promotional_id,
      code: this.code,
      description: this.description,
      course: this.course,
      promotional_percente: this.promotional_percente,
      valid_from: this.valid_from,
      valid_to: this.valid_to,
      usage: this.usage,
    };
    this.http.put(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        //(<HTMLFormElement>(
        //document.getElementById('edit_promotional_form')
        //)).reset();
        this.edit_model_status = !this.edit_model_status;
        this.getPromotionals();
      } else {
        this.toster.error(res['errors']['code'], res['message']);
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
        this.toster.success(res['message'], 'Success');
        this.getPromotionals();
      } else {
        this.toster.error(res['message'], res['message']);
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
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['promotionals']);
        this.totalSize = res['total_records'];
      } else {
        this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }
  public doFilter() {
    let param = { url: 'get-promotionals', search: this.search_box };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['descounts']);
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.toster.error(res['message'], 'Error');
      }
    });
  }
}
