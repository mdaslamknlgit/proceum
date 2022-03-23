import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-package',
  templateUrl: './list-package.component.html',
  styleUrls: ['./list-package.component.scss']
})
export class ListPackageComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'package_name',
    'pricing_model',
    'billing_frequency',
    'valid_up_to',
    'actions',
    'status',
  ];
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public page = 0;
  popoverTitle = '';
  popoverMessage = '';
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.getPackages();
  }

  public getPackages() {
    let param = { url: 'get-packages' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['packages']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public doFilter() {
    let param = { url: 'get-packages', search: this.search_box };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['packages']);
      } else {
        this.dataSource = new MatTableDataSource([]);
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public getServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'get-packages',
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
    };
    this.http.post(param).subscribe((res) => {
      //console.log(res['data']['packages']);
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['packages']);
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }

  public editPackage(params){

  }

  public changeStatus(package_id, status){
    let param = {
      url: 'package-status',
      id: package_id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getPackages();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
    
  }

  deleteRecord(id){
    let param = {
      url: 'delete-package',
      id: id,
    };
    this.http.post(param).subscribe((res) => {  
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getPackages();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }

  navigateTo(url){
    let user = this.http.getUser();
    if (Object.values(environment.ALL_ADMIN_SPECIFIC_ROLES).indexOf(Number(user['role'])) > -1) {
      url = "/admin/"+url;
    }
    //Later we must change this
    if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
      url = "/admin/"+url;
    }
    this.router.navigateByUrl(url);
  }
}
