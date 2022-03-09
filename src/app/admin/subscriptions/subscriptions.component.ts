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
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  public discount_types = environment.DISCOUNT_TYPES;
  displayedColumns: string[] = [
    'id',
    'partner_name',
    'package_name',
    // 'license_start_at',
    // 'license_end_at',
    'created_at',
    'actions',
  ];
  public package_id:number;
  public partner_id:number;
  public amount:number;
  public billing_frequency = 'monthly';
  public payment_type:number;
  public card_last_four_digits = '';
  public transaction_id = '';
  public cheque_drawn = '';
  public cheque_number = '';
  public dd_draft = '';
  public dd_number = '';
  public bank_name = '';
  public branch = '';
  public address = '';
  public description = '';


  today_date = new Date();
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public page = 0;
  public model_status = false;
  public packages = [];
  public partners = [];
  all_packages: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_partners: ReplaySubject<any> = new ReplaySubject<any>(1);
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private route: Router
  ) {}
  ngOnInit(): void {
    //this.getDiscounts();
    this.getPackages();
  }
  
  getDiscounts() {
    let param = { url: 'get-discounts' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['descounts']);
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
    (<HTMLFormElement>document.getElementById('discount_form')).reset();
  }

  createDiscount() {
    let param = {
      url: 'discount',
      title: '', 

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

  public getPackages() {
    let param = { url: 'get-packages','status':'1' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.packages = res['data']['packages'];
        this.all_packages.next(this.packages.slice());
      } else {
        //this.packages = [{'pk_id':0, 'package_name':'No packages found!'}];
        //this.all_packages.next(this.packages.slice());
      }
    });
  }
}

