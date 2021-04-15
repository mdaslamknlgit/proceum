import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ManageTemplateComponent } from './manage-template/manage-template.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss'],
})
export class EmailTemplatesComponent implements OnInit {
  public template = {
    id: '',
    template: '',
    template_subject: '',
    template_name: '',
  };
  displayedColumns: string[] = [
    'id',
    'subject',
    // 'status',
    'created_at',
    'updated_at',
    'actions',
  ];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public page = 0;
  search_text = '';
  constructor(
    private http: CommonService,
    public dialog: MatDialog,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getTemplates();
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
  public doFilter = () => {
    let value = this.search_text;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };
  manageTemplate(id) {
    const dialogRef = this.dialog.open(ManageTemplateComponent, {
      data: { id: id },
    });
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getTemplates();
      }
    });
  }
}
export interface TemplateResponce {
  s_no: number;
  id: number;
  subject: string;
  status: number;
  created_at: number;
  updated_at: string;
}
