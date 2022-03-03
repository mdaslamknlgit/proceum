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
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit {
  //Order Date	User	Email	Package	Amount	Order ID	Transaction ID	Actions

  displayedColumns: string[] = [
    'id',
    'order_id',
    'created_at',
    'user_name',
    'email',
    //'paid_amount',
    //'currency_symbol',
    'package_name',
    'paid_amount_usd',
    'payment_gateway_payment_id',
    'actions',
  ];
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public duration = 'all'; 
  public page = 0;
  countrys = [];
  packages = [];
  public country_id = '';
  public package_id = '';
  popoverTitle = '';
  popoverMessage = '';
  public from_date = '';
  public to_date = '';
  public today = new Date();
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  all_countrys: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_packages: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getCountries();
    this.getPackages();
    this.getOrders();
  }

  public getOrders() {
    let param = { url: 'get-orders-for-finance-user', status: 2, offset: this.page, limit: this.pageSize, duration: this.duration ,country_id : this.country_id, package_id:this.package_id };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.totalSize = res['total_records'];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.totalSize = 0;
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public doFilter() {
    if(this.duration == 'date_range' && (this.from_date == '' || this.to_date == '')){
      return false;
    }
    let param = { 
      url: 'get-orders-for-finance-user', 
      status: 2, 
      search: this.search_box, 
      duration: this.duration, 
      country_id : this.country_id, 
      package_id: this.package_id,
      from_date: this.from_date,
      to_date: this.to_date,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.totalSize = res['total_records'];
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.totalSize = 0;
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public getServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'get-orders-for-finance-user',
      status: 2,
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
      duration: this.duration,
      country_id : this.country_id,
      package_id:this.package_id,
      from_date: this.from_date,
      to_date: this.to_date, 
    };
    this.http.post(param).subscribe((res) => {
      //console.log(res['data']['packages']);
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
        this.totalSize = 0;
      }
    });
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

  getPackages() {
    let param = { url: 'get-packages'};
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

  resetFilters() {
    this.search_box = '';
    this.from_date = '';
    this.to_date = '';
    this.duration = '';
    this.doFilter();
  }
}


