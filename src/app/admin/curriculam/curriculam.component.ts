import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-curriculam',
  templateUrl: './curriculam.component.html',
  styleUrls: ['./curriculam.component.scss'],
})
export class CurriculamComponent implements OnInit {
  public template = {
    id: '',
    template: '',
    template_subject: '',
    template_name: '',
  };
  displayedColumns: string[] = [
    'id',
    'subject',
    'status',
    'created_at',
    'updated_at',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public page = 0;
  public model_status = false;
  constructor(private http: CommonService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.getTemplates();
  }
  toggleModel() {
    this.model_status = !this.model_status;
  }
  getTemplates() {
    let param = { url: 'email-template' };
    this.http.get(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['data']['templates']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  public getServerData(event?: PageEvent) {}
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };
  manageTemplate(id) {}
}
export interface TemplateResponce {
  s_no: number;
  id: number;
  subject: string;
  status: number;
  created_at: number;
  updated_at: string;
}
