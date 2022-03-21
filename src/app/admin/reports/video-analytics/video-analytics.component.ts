import { Component, OnInit, ViewChild} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-video-analytics',
  templateUrl: './video-analytics.component.html',
  styleUrls: ['./video-analytics.component.scss']
})
export class VideoAnalyticsComponent implements OnInit {
  displayedColumns: string[] = ['s_no','video_platform','student_name','student_email','created_at','topic','actions'];
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
    public date_range_fltr:boolean=false;
    public video_type_id = '';    
    video_types = [];
    all_video_types: ReplaySubject<any> = new ReplaySubject<any>(1);
    constructor(private http: CommonService, private toster: ToastrService, public dialog: MatDialog,public datepipe: DatePipe) { }
    ngOnInit(): void {
      this.video_types = environment.video_types;
      if (this.video_types != undefined) {
        this.all_video_types.next(this.video_types.slice());
      }
      this.getVideoAnalytics();
    }
    getVideoAnalytics() {
        let param = { url: 'get-video-analytics',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,"search_txt":this.search_txt,"from_date":"","to_date":""};
        this.http.post(param).subscribe((res) => {
          this.dataSource = new MatTableDataSource(res['data']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.num_rows = res['total'];          
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
      let param = { url: 'get-video-analytics',"offset": this.page, "limit": this.pageSize, duration:this.duration, "sort_by": this.sort_by,"search_txt":this.search_txt,"from_date":this.fromDate,"to_date":this.toDate,"video_type":this.video_type_id};
      this.http.post(param).subscribe((res) => {
        this.dataSource = new MatTableDataSource(res['data']);
        this.dataSource.sort = this.sort;
        this.num_rows = res['total'];
      });
    }
    resetFilters(){
      this.search_txt="";
      this.from_date="";
      this.to_date="";
      this.fromDate = "";
      this.toDate="";
      this.duration="";
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
    getVideoImg(videotype){
      this.video_types.map((item) => {
          if (item.value == videotype) {
            return item.img;
          }
        });
    }
}
