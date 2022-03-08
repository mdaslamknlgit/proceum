import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.scss'],
})
export class RolesListComponent implements OnInit {
  page_size_options = environment.page_size_options;
  displayedColumns: string[] = [
    'id',
    'role_name',
    'created_at',
    'updated_at',
    'actions',
    'status',
  ];
  role_id: any;
  dataSource = new MatTableDataSource();
  public search_box = '';
  role_title = '';
  role_description = '';
  role_title_edit = '';
  role_description_edit = '';
  public model_status = false;
  public edit_model_status = false;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public page = 0;
  is_loaded = true;
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private route: Router,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.getRoles();
  }
  getRoles() {
    let param = { url: 'role' };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['roles']);
        if (this.is_loaded == true || true) {
          this.is_loaded = false;
          //alert();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }
  toggleModel() {
    this.model_status = !this.model_status;
    (<HTMLFormElement>document.getElementById('role_form')).reset();
    (<HTMLFormElement>document.getElementById('role_form_edit')).reset();
  }
  public doFilter = () => {
    let value = this.search_box;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };
  createRole() {
    let param = {
      url: 'role',
      role_name: this.role_title,
      role_description: this.role_description,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getRoles();
        this.toggleModel();
      } else {
        let message = res['errors']['role_name']
          ? res['errors']['role_name']
          : res['errors'];
        this.toster.error(message, 'Error', { closeButton: true });
      }
    });
  }
  editRole(param) {
    this.edit_model_status = !this.edit_model_status;
    this.role_id = param['id'];
    this.role_title_edit = param['role_name'];
    this.role_description_edit = param['role_desc'];
  }
  updateRole() {
    let param = {
      url: 'role/' + this.role_id,
      role_name: this.role_title_edit,
      role_description: this.role_description_edit,
    };
    this.http.put(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.edit_model_status = !this.edit_model_status;
        this.getRoles();
      } else {
        let message = res['errors']['role_name']
          ? res['errors']['role_name']
          : res['errors'];
        this.toster.error(message, 'Error', { closeButton: true });
      }
    });
  }
  deleteRole(id, status) {
    let param = {
      url: 'role/delete',
      id: id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getRoles();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }
}
