import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class StudentsComponent implements OnInit {
  public api_url: string;
  displayedColumns: string[] = ['id','first_name','email','status','created_at','actions',];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public num_students: number = 0;
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
  constructor(private http: CommonService, public dialog: MatDialog,private toastr: ToastrService,public datepipe: DatePipe) {}
  ngOnInit(): void {
    this.api_url = environment.apiUrl;
    this.getStudents();
  }
  getStudents() {
    let param = { url: 'get-users',"role":2,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,search_txt:this.search_txt,"from_date":"","to_date":""};
    this.http.post(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['users']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.num_students = res['users_count'];
      
    });
  }
  public getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
    this.applyFilters();
  }

  applyFilters(){
    let fromDate =this.from_date?this.datepipe.transform(this.from_date, 'yyyy-MM-dd'):""; 
    let toDate =this.to_date?this.datepipe.transform(this.to_date, 'yyyy-MM-dd'):""; 
    let param = { url: 'get-users',"role":2,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,search_txt:this.search_txt,"from_date":fromDate,"to_date":toDate};
    this.http.post(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['users']);
      this.num_students = res['users_count'];
    });
  }

  sortData(event) {
		this.sort_by = event;
		if (this.sort_by.direction != '')
			this.applyFilters();
	}

  createStucent(){
    
  }

  changeStatus(student_id:any){
    // alert(student_id);
    let param = { url: 'user/'+student_id};
    this.http.delete(param).subscribe((res: Response) => {
      if (res.error) {
        this.toastr.error(res.message , 'Error', { closeButton: true , timeOut: 3000});
      }else{
        this.toastr.success(res.message , 'Success', { closeButton: true , timeOut: 3000});
        this.applyFilters();
      }
    });


  }

  resetFilters(){
    this.search_txt="";
    this.from_date="";
    this.to_date="";
    this.applyFilters();
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

}

export interface Response {
  error: boolean;
  token: any;
  message: string;
  role?: any;
  errors?: any;
}

