import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  public api_url: string;
  displayedColumns: string[] = ['id','student_name','student_email','student_phone','student_status','actions',];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public num_students: number = 0;
  public page = 0;
  public pageSize = 10;
  public sort_by: any;
  constructor(private http: CommonService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.api_url = environment.apiUrl;
    this.getStudents();
  }
  getStudents() {
    let param = { url: 'get-users',"role":2,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by};
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
    this.applyFilters( );
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  applyFilters(){
    let param = { url: 'get-users',"role":2,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by};
    this.http.post(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['users']);
      this.dataSource.sort = this.sort;
      this.num_students = res['users_count'];
    });
  }

  sortData(event) {
		this.sort_by = event;
		if (this.sort_by.direction != '')
			this.applyFilters( );
	}

  createStucent(){
    
  }

  // exportStudents(type:string){

  //   if(type == 'EXL'){
  //     let param = { url: 'export-students/EXL'};
  //     this.http.get(param).subscribe((res) => {
  //     });

  //   }else if(type == 'PDF'){
  
  //   }

  // }

  deleteStudent(student_id:any){
    let param = { url: 'user/'+student_id};
    this.http.delete(param).subscribe((res) => {
      this.applyFilters();
    });
  }

}

