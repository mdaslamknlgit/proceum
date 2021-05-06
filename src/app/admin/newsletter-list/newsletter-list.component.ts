import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { CommonService } from '../../services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';

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
  selector: 'app-newsletter-list',
  templateUrl: `./newsletter-list.component.html`,
  styleUrls: ['./newsletter-list.component.scss'],
})
export class NewsletterListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'email_address',
    'status',
    'created_at',
    'action',
  ];
  dataSource: any = [];
  apiURL: string;
  public num_newsletters: number = 0;
  public page = 0;
  public pageSize = environment.page_size;
  public pageSizeOptions = environment.page_size_options;
  public sort_by: any;
  hrefPDF: string;
  hrefEXL: string;
  search = '';
  created_at: string;
  updated_at: string;
  reason: string;
  status: boolean;
  public model_status = false;
  public from_date='';
  public to_date='';
  public fromDate='';
  public toDate='';
  public maxDate= new Date();
  public tomindate:any;
  public is_todate:boolean=true;
  public is_submit:boolean=true;
  public user_id:any;
  constructor(private http: CommonService, public dialog: MatDialog ,public datepipe: DatePipe) {
    this.apiURL = environment.apiUrl;
    this.hrefPDF = environment.apiUrl + 'export-newsletter/PDF';
    this.hrefEXL = environment.apiUrl + 'export-newsletter/EXL';
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    const user = JSON.parse(atob(sessionStorage.getItem('user')));
    this.user_id=user.id
    this.doSearchFilter();

  }

  getNewsLetterList() {
    let param = {
      url: 'newsletter-list',
      offset: this.page,
      limit: this.pageSize,
      sort_by: this.sort_by,
    };
    this.http.post(param).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['newsletters']);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.num_newsletters = res['newsletters_count'];
    });
  }

  public getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
    this.page = event.pageSize * event.pageIndex;
    this.applyFilters();
  }

  public doSearchFilter() {
    var val = (this.search == undefined || this.search == '') ? '/' + '0' : '/' + this.search;
    val+= '/' + this.user_id; 
    val+=this.from_date? '/' + this.datepipe.transform(this.from_date, 'yyyy-MM-dd'): '/' + "0"; 
    val+=this.to_date?'/' + this.datepipe.transform(this.to_date, 'yyyy-MM-dd'):'/' + "0"; 
    this.hrefEXL = environment.apiUrl + 'export-newsletter/EXL' + val;
    this.hrefPDF = environment.apiUrl + 'export-newsletter/PDF' + val;
    this.applyFilters();
  }

  applyFilters() {
    let fromDate =this.from_date?this.datepipe.transform(this.from_date, 'yyyy-MM-dd'):""; 
    let toDate =this.to_date?this.datepipe.transform(this.to_date, 'yyyy-MM-dd'):""; 
    let param = {
      url: 'newsletter-list',
      offset: this.page,
      limit: this.pageSize,
      sort_by: this.sort_by,
      search_term: this.search,
      "from_date":fromDate,
      "to_date":toDate
    };
    this.http.post(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['newsletters']);
      this.dataSource.sort = this.sort;
      this.num_newsletters = res['newsletters_count'];
    });
  }

  sortData(event) {
    this.sort_by = event;
    if (this.sort_by.direction != '') this.applyFilters();
  }

  resetFilters(){
    this.search="";
    this.from_date="";
    this.to_date="";
    this.doSearchFilter();
  }

  fromdateChabge(){
    this.tomindate=new Date(this.from_date)
    this.to_date="";
    this.is_submit=true;
    this.is_todate=false;
    this.fromDate =this.from_date?this.datepipe.transform(this.from_date, 'yyyy-MM-dd'):""; 
  }

  todateChabge(){
    this.toDate=this.to_date?this.datepipe.transform(this.to_date, 'yyyy-MM-dd'):""; 
    this.is_submit=false;
  }


  showDetails(id) {
    this.created_at = "";
    this.updated_at = "";
    this.reason = "";
    let param = { url: 'newsletter/' + id };
    this.http.get(param).subscribe((res: viewResponse) => {
      this.created_at = res.created_at;
      this.updated_at = res.updated_at;
      this.reason = res.status_reason;
      this.status = (res.status == 0) ? true : false;
    });
    this.model_status = !this.model_status;
  }

  toggleModel() {
    this.model_status = !this.model_status;
  }
}

export interface NewsLetter {
  id: number;
  email: string;
  status: number;
  reason: string;
  action?: any;
}

export interface viewResponse {
  created_at: any;
  updated_at: any;
  status_reason: any;
  status: number;
  id: number;
}
export interface Response {
  error: boolean;
  message: string;
  errors?: any;
  newsletters?: any;
}
