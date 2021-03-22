import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CreateComponent } from './create/create.component';

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss'],
})
export class EmailTemplatesComponent implements OnInit {
  public template = {
    id: '2',
    template: '',
    template_title: '',
    template_name: '',
  };
  displayedColumns: string[] = [
    'id',
    'title',
    'status',
    'created_at',
    'updated_at',
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private http: CommonService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.getTemplates();
  }
  getTemplates() {
    let param = { url: 'email-template' };
    this.http.get(param).subscribe((res) => {
      this.dataSource = res['data']['templates'];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  openModal(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '650px',
      data: { id: 500 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
export interface PeriodicElement {
  id: number;
  title: string;
  status: number;
  created_at: number;
  updated_at: string;
}
