
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-child-partners',
  templateUrl: './child-partners.component.html',
  styleUrls: ['./child-partners.component.scss']
})
export class ChildPartnersComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'partner_type',
    'partner_name',
    'contact_number',
    'partner_email',
    //'package_name',
    //'licence_start_date',
    //'licence_end_date',
    'actions',
    'status',
  ];
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public partner_child = true;
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((segement) => {
      let param = {
        url: 'get-partners' , partner_child : this.partner_child, partner_id: segement.id
      };
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          if (this.paginator != undefined) {
              this.paginator.pageIndex = 0;
              this.paginator.firstPage();
            }
          this.dataSource = new MatTableDataSource(res['data']['partners']);
          this.totalSize = res['total_records'];
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    });
  }

  public getPartners() {
    //console.log(this.partner_child);
    let param = { url: 'get-partners' , partner_child : this.partner_child};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['partners']);
        this.totalSize = res['total_records'];
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }

  public doFilter() {
    let param = { 
      url: 'get-partners', 
      search: this.search_box , 
      partner_child : this.partner_child,
      from_date : this.from_date,
      to_date : this.to_date,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['partners']);
      } else {
        this.dataSource = new MatTableDataSource([]);
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public getServerData(event?: PageEvent) {
    //console.log("called");
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'get-partners',
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
      partner_child : this.partner_child,
      from_date : this.from_date,
      to_date : this.to_date,
    };
    this.http.post(param).subscribe((res) => {
      //console.log(res['data']['partners']);
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['partners']);
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }



  public deletePartner(partner_id, status){
    let param = {
      url: 'partner-status',
      id: partner_id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getPartners();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
    
  }

  navigateTo(url){
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

  tabClick(event){
    this.page = 0;
    if (this.paginator != undefined) {
      this.paginator.pageIndex = 0;
      this.paginator.firstPage();
    }
    this.search_box = '';
    this.from_date = '';
    this.to_date = '';
    this.partner_child = event.index;
    this.getPartners();
  }

  resetFilters(){
    this.search_box =   '';
    this.from_date = '';
    this.to_date = '';
    this.doFilter();
  }


}

