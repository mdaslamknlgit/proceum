import { Component, OnInit,ViewChild} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';

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
    selector: 'app-revenue-report',
    templateUrl: './revenue-report.component.html',
    styleUrls: ['./revenue-report.component.scss'],
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
    ]
})  
export class RevenueReportComponent implements OnInit {
   
displayedColumns: string[] = ['s_no','order_id','created_at','user_email','package_name','paid_amount','transaction_id','actions'];
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
    public fromDate='';
    public toDate='';
    public maxDate= new Date();
    public tomindate:any;
    public is_todate:boolean=true;
    public is_submit:boolean=true;
    public duration = '';
    public country_id = '';
    public package_id = '';
    public date_range_fltr:boolean=false;
    countrys = [];
    packages = [];
    all_countrys: ReplaySubject<any> = new ReplaySubject<any>(1);
    all_packages: ReplaySubject<any> = new ReplaySubject<any>(1);
    constructor(private http: CommonService, private toster: ToastrService, public dialog: MatDialog,public datepipe: DatePipe) { }
    ngOnInit(): void {
        this.getCountries();
        this.getOrdersList();
        this.getPackages();
    }
    getOrdersList() {
        let param = { url: 'orders-list-report',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,"search_txt":this.search_txt,"from_date":"","to_date":""};
        this.http.post(param).subscribe((res) => {
          this.dataSource = new MatTableDataSource(res['data']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.num_rows = res['total_orders'];
          
        });
    }
    public getServerData(event?: PageEvent) {
        this.pageSize = event.pageSize;
        this.page = (event.pageSize * event.pageIndex);
        this.applyFilters( );
    }

    applyFilters(){
        if(this.duration == 'date_range'){
            this.date_range_fltr = true;
            if(this.fromDate == '' && this.toDate == ''){
                return false;
            }
        }else{
            this.date_range_fltr = false;
        }
        let param = { url: 'orders-list-report',"offset": this.page, "limit": this.pageSize, duration:this.duration, country_id:this.country_id, "sort_by": this.sort_by,"search_txt":this.search_txt,"from_date":this.fromDate,"to_date":this.toDate,package_id:this.package_id};
        this.http.post(param).subscribe((res) => {
          this.dataSource = new MatTableDataSource(res['data']);
          this.dataSource.sort = this.sort;
          this.num_rows = res['total_orders'];
        });
    }

    resetFilters(){
        this.search_txt="";
        this.from_date="";
        this.to_date="";
        this.fromDate = "";
        this.toDate="";
        this.duration="";
        this.country_id="";
        this.package_id="";
        this.applyFilters();
    }

    sortData(event) {
        this.sort_by = event;
        if (this.sort_by.direction != '')
            this.applyFilters();
    }
    
    fromdateChange(){
        this.tomindate=new Date(this.from_date)
        this.to_date="";
        this.is_todate=false;
        this.fromDate =this.from_date?this.datepipe.transform(this.from_date, 'yyyy-MM-dd'):""; 
    }

    todateChange(){
        this.toDate=this.to_date?this.datepipe.transform(this.to_date, 'yyyy-MM-dd'):""; 
        if(this.fromDate != '' && this.toDate != '' ){
            this.date_range_fltr = false;
            this.applyFilters();       
        }
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
}