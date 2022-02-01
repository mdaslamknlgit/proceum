import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list-colleges',
  templateUrl: './list-colleges.component.html',
  styleUrls: ['./list-colleges.component.scss']
})
export class ListCollegesComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'partner_name',
    'contact_number',
    'partner_email',
    'actions',
    'status',
  ];
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public type = 1; //Colleges
  public page = 0;
  public from_date = '';
  public to_date = '';
  public partner_id: number;
  public partner_id_with_fw_slash = '';
  public today = new Date();
  private user: any;
  popoverTitle = '';
  popoverMessage = '';
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit(): void {
    let newParam = {
      url: 'get-partner-childs', type: this.type
    };
    this.user = this.http.getUser();
    if (Number(this.user['role']) == environment.PROCEUM_ADMIN_SPECIFIC_ROLES.SUPER_ADMIN) {
      this.activatedRoute.params.subscribe((param) => {
        this.partner_id = param.id;
        if(!this.partner_id){
            this.toster.error('Invalid partner!', 'Error', { closeButton: true });
            window.location.href = environment.APP_BASE_URL;
        }
        this.partner_id_with_fw_slash = param.id+'/';
        let destructParam = { partner_id: this.partner_id, ...newParam }
        this.http.post(destructParam).subscribe((res) => {
          if (res['error'] == false) {
            if (this.paginator != undefined) {
              this.paginator.pageIndex = 0;
              this.paginator.firstPage();
            }
            this.dataSource = new MatTableDataSource(res['data']['partners']);
            this.totalSize = res['total_records'];
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        });
      });
    } else if (Number(this.user['role']) == environment.PARTNER_ADMIN_SPECIFIC_ROLES.UNIVERSITY_ADMIN) {
      this.http.post(newParam).subscribe((res) => {
        if (res['error'] == false) {
          if (this.paginator != undefined) {
            this.paginator.pageIndex = 0;
            this.paginator.firstPage();
          }
          this.dataSource = new MatTableDataSource(res['data']['partners']);
          this.totalSize = res['total_records'];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    } else {
      this.toster.error('UnAuthorized!', 'Error', {
        closeButton: true,
      });
      this._location.back();
    }
  }
  public getPartners() {
    //console.log(this.type);
    let param = { url: 'get-partner-childs', type: this.type, partner_id: this.partner_id };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['partners']);
        this.totalSize = res['total_records'];
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }

  public doFilter() {
    let param = {
      url: 'get-partner-childs',
      search: this.search_box,
      type: this.type,
      partner_id: this.partner_id,
      from_date: this.from_date,
      to_date: this.to_date,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['partners']);
      } else {
        this.dataSource = new MatTableDataSource([]);
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public getServerData(event?: PageEvent) {
    //console.log("called");
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'get-partner-childs',
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
      type: this.type,
      partner_id: this.partner_id,
      from_date: this.from_date,
      to_date: this.to_date,
    };
    this.http.post(param).subscribe((res) => {
      //console.log(res['data']['partners']);
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['partners']);
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }



  public deletePartner(id, status) {
    let param = {
      url: 'partner-child-status',
      id: id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getPartners();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });

  }

  navigateTo(url) {
    if (Object.values(environment.ALL_ADMIN_SPECIFIC_ROLES).indexOf(Number(this.user['role'])) > -1) {
      url = "/admin/" + url;
      this.router.navigateByUrl(url);
    }else{
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
    this.getPartners();
  }

  resetFilters() {
    this.search_box = '';
    this.from_date = '';
    this.to_date = '';
    this.doFilter();
  }


}
