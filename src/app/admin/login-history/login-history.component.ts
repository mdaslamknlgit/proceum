import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class LoginHistoryComponent implements OnInit {
  public api_url:string;
  displayedColumns: string[] = ['pk_id','name','latitude','longitude','country_name','city_name','platform_name','device_type','browser','ip_v4_address','login_time','logout_time'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public num_rows: number = 0;
  public page = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public sort_by: any;
  public search_txt ="";
  public from_date='';
  public to_date='';
  public maxDate= new Date();
  public tomindate:any;
  public is_todate:boolean=true;
  public is_submit:boolean=true;
  constructor(private http: CommonService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.api_url = environment.apiUrl;
    this.getLoginHistory();
  }

  getLoginHistory() {
    let param = { url: 'get-login-history',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,"search_txt":this.search_txt,"from_date":"","to_date":""};
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
    let param = { url: 'get-login-history',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,"search_txt":this.search_txt,"from_date":this.from_date,"to_date":this.to_date};
    this.http.post(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['login_history']);
      this.dataSource.sort = this.sort;
      this.num_rows = res['login_history_count'];
    });
  }

  resetFilters(){
    this.search_txt="";
    this.from_date="";
    this.to_date="";
    this.applyFilters();
  }


  sortData(event) {
		this.sort_by = event;
		if (this.sort_by.direction != '')
			this.applyFilters( );
	}

  fromdateChabge(){
    this.tomindate=new Date(this.from_date)
    this.to_date="";
    this.is_submit=true;
    this.is_todate=false;
  }

  todateChabge(){
    this.is_submit=false;
  }

}
