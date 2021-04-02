import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss']
})
export class LoginHistoryComponent implements OnInit {
  displayedColumns: string[] = ['id','user_name','latitude','longitude','country_name','city_name','platform_name','device_type','browser_type','ip_address','login_time','logout_time'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public num_rows: number = 0;
  public page = 0;
  public pageSize = 10;
  public sort_by: any;
  constructor(private http: CommonService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.getLoginHistory();
  }

  getLoginHistory() {
    let param = { url: 'get-login-history',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by};
    this.http.post(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['login_history']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.num_rows = res['login_history_count'];
      
    });
  }
  public getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
    this.applyFilters( );
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  applyFilters(){
    let param = { url: 'get-login-history',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by};
    this.http.post(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['login_history']);
      this.dataSource.sort = this.sort;
      this.num_rows = res['login_history_count'];
    });
  }

  sortData(event) {
		this.sort_by = event;
		if (this.sort_by.direction != '')
			this.applyFilters( );
	}

}
