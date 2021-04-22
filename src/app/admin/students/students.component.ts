import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  public api_url: string;
  displayedColumns: string[] = ['id','name','email','status','actions',];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public num_students: number = 0;
  public page = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public sort_by: any;
  public search_txt ="";
  constructor(private http: CommonService, public dialog: MatDialog,private toastr: ToastrService) {}
  ngOnInit(): void {
    this.api_url = environment.apiUrl;
    this.getStudents();
  }
  getStudents() {
    let param = { url: 'get-users',"role":2,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,search_txt:this.search_txt};
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
    let param = { url: 'get-users',"role":2,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,search_txt:this.search_txt};
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

}

export interface Response {
  error: boolean;
  token: any;
  message: string;
  role?: any;
  errors?: any;
}

