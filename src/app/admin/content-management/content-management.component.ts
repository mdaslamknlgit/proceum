import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.scss'],
})
export class ContentManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'sno',
    'content_title',
    'created_by',
    'status',
    'content_status',
    'created_at',
    'updated_at',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  modal_popup = false;
  page: number = 0;
  public tab_index = 0
  constructor(private http: CommonService, private toster: ToastrService, private router: Router) {}

  ngOnInit(): void {
    let param = {
      url: 'content-list',
      offset: this.page,
      limit: this.pageSize,
      tab_index: this.tab_index
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if (this.paginator != undefined) {
            this.paginator.pageIndex = 0;
            this.paginator.firstPage();
          }
        this.dataSource = new MatTableDataSource(res['data']['content_list']);
        this.totalSize = res['total_records'];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
  getContentList() {
    let param = {
      url: 'content-list',
      offset: this.page,
      limit: this.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
      tab_index: this.tab_index
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['content_list']);
        this.totalSize = res['total_records'];
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }
  public getServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    this.pageSize = event.pageSize;
    let param = {
      url: 'content-list',
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
      tab_index: this.tab_index
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['content_list']);
        this.totalSize = res['total_records'];
      } else {
        this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }
  switchTab(event){
    this.tab_index = event.index;
    this.getContentList();
  }
  sortData(event) {
    this.sort_by = event;
    this.page = 0;
    if (this.paginator != undefined) {
      this.paginator.pageIndex = 0;
      this.paginator.firstPage();
    }
    if (this.sort_by.direction != '') this.getContentList();
  }
  public doFilter = () => {
    this.page = 0;
    if (this.paginator != undefined) {
      this.paginator.pageIndex = 0;
      this.paginator.firstPage();
    }
    this.getContentList();
  };
  deleteContent(id, status) {
    status = status == 1 ? '0' : '1';
    let param = {
      url: 'content-status/' + id + '/' + status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getContentList();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }
  navigateTo(url){
      let user = this.http.getUser();
      if(user['role']== '1'){
          url = "/admin/"+url;
      }
      if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
        url = "/reviewer/"+url;
    }
      this.router.navigateByUrl(url);
  }
}
