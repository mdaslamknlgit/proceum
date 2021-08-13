import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-package-testimonials',
  templateUrl: './package-testimonials.component.html',
  styleUrls: ['./package-testimonials.component.scss']
})
export class PackageTestimonialsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'rating',
    'package_name',
    'created_at',
    'status',
    'actions',
  ];

  public name ='';
  public email ='';
  public rating =0;
  public review ='';
  public package_name ='';
  public id = 0;
  public package_id = 0;
  public created_at ='';
  public status =0;
  public edit_model_status = false;

  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public page = 0;
  public from_date='';
  public to_date='';
  public today = new Date();
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
    this.getTesimonials();
  }

  public getTesimonials() {
    let param = { url: 'get-packages-testimonial'};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public doFilter() {
    let param = { 
      url: 'get-packages-testimonial', 
      search: this.search_box,
      from_date : this.from_date,
      to_date : this.to_date,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
      } else {
        this.dataSource = new MatTableDataSource([]);
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public getServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'get-packages-testimonial', 
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
      from_date : this.from_date,
      to_date : this.to_date,
    };
    this.http.post(param).subscribe((res) => {
      //console.log(res['data']);
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }


  public changeStatus(id, status){
    let param = {
      url: 'testimonial-status',
      id: id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.status = (status) ? 0 : 1;
        this.getTesimonials();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
    
  }

  public resetFilters(){
    this.search_box =   '';
    this.from_date = '';
    this.to_date = '';
    this.doFilter();
  }

  public navigateTo(url){
      let user = this.http.getUser();
      if(user['role']== '1'){
          url = "/admin/"+url;
      }
      //Later we must change this
      if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
        url = "/admin/"+url;
    }
      this.router.navigateByUrl(url);
  }

  public showMoreInPopUp(element){
    console.log(element);
    this.created_at = element.created_at;
    this.email = element.email;
    this.id = element.id;
    this.name = element.name;
    this.package_id = element.package_id;
    this.package_name = element.package_name;
    this.rating = element.rating;
    this.review = element.review;
    this.status = element.status;
    this.edit_model_status = true;
  }
}

