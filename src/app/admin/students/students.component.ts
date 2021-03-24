import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  // public template = {
  //   id: '',
  //   template: '',
  //   template_title: '',
  //   template_name: '',
  // };
  displayedColumns: string[] = [
    'id',
    'student_name',
    'student_email',
    'student_phone',
    'student_status',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public page = 0;
  constructor(private http: CommonService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.getStudents();
  }
  getStudents() {
    let param = { url: 'get-users/2' };
    this.http.get(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['users']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  public getServerData(event?: PageEvent) {}
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };
  // manageTemplate(id) {
  //   const dialogRef = this.dialog.open(ManageTemplateComponent, {
  //     data: { id: id }
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.getTemplates();
  //     }
  //   });
  // }
}
// export interface TemplateResponce {
//   s_no: number;
//   id: number;
//   title: string;
//   status: number;
//   created_at: number;
//   updated_at: string;
// }
