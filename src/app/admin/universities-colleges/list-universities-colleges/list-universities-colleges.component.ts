import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-list-universities-colleges',
  templateUrl: './list-universities-colleges.component.html',
  styleUrls: ['./list-universities-colleges.component.scss']
})
export class ListUniversitiesCollegesComponent implements OnInit {

  displayedColumns: string[] = [
    'pk_id',
    'organization_name',
    'contact_email',
    'contact_person',
    'contact_number',
    'actions',
    'status',
  ];
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public type = 0;
  public page = 0;
  public from_date = '';
  public to_date = '';
  public today = new Date();
  public user: any;
  popoverTitle = '';
  popoverMessage = '';
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.user = this.http.getUser();
    this.getUniversitiesOrColleges();

  }
  public getUniversitiesOrColleges() {
    let param = {
      url: 'get-universities-or-colleges', type: this.type
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if (this.paginator != undefined) {
          this.paginator.pageIndex = 0;
          this.paginator.firstPage();
        }
        this.dataSource = new MatTableDataSource(res['data']);
        this.totalSize = res['total_records'];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  public doFilter() {
    let param = {
      url: 'get-universities-or-colleges',
      search: this.search_box,
      partner_type_id: this.type,
      from_date: this.from_date,
      to_date: this.to_date,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.totalSize = res['total_records'];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }

  public getServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'get-universities-or-colleges',
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
      partner_type_id: this.type,
      from_date: this.from_date,
      to_date: this.to_date,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.totalSize = res['total_records'];
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }



  public deletePartner(partner_id, status) {
    let param = {
      url: 'partner-status',
      id: partner_id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getUniversitiesOrColleges();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });

  }

  navigateTo(url) {
    let user = this.http.getUser();
    if (environment.ALL_ADMIN_SPECIFIC_ROLES.SUPER_ADMIN == Number(user['role'])) {
      url = "/admin/" + url;
      this.router.navigateByUrl(url);
    } else {
      this.toster.error('UnAuthorized!', 'Error', {
        closeButton: true,
      });
    }
  }

  tabClick(event) {
    this.page = 0;
    if (this.paginator != undefined) {
      this.paginator.pageIndex = 0;
      this.paginator.firstPage();
    }
    this.search_box = '';
    this.from_date = '';
    this.to_date = '';
    this.type = event.index;
    this.getUniversitiesOrColleges();
  }

  resetFilters() {
    this.search_box = '';
    this.from_date = '';
    this.to_date = '';
    this.doFilter();
  }

}
