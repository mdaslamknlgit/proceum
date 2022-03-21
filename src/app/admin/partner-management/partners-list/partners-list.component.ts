import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-partners-list',
  templateUrl: './partners-list.component.html',
  styleUrls: ['./partners-list.component.scss']
})
export class PartnersListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'partner_type',
    'partner_name',
    'contact_number',
    'partner_email',
    'package_name',
    'licence_start_date',
    'licence_end_date',
    'actions',
    'status',
  ];
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public type = 0;
  public page = 0;
  public from_date = '';
  public to_date = '';
  public today = new Date();
  public user: any;
  popoverTitle = '';
  popoverMessage = '';
  public selectedIndex = 0;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) { 
    this.translate.setDefaultLang(this.http.lang);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.selectedIndex = param.tab_id;
      this.type = this.selectedIndex;
      if (this.selectedIndex == undefined) {
        this.selectedIndex = 0;
        this.type = this.selectedIndex;
      }
      
    });
    // console.log("type => "+this.type);return;
    this.user = this.http.getUser();
    let param = {
      url: 'get-partners', partner_type_id: this.type, offset: this.page, limit: this.pageSize
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
  }
  public getPartners() {
    let param = {
      url: 'get-partners',
      partner_type_id: this.type,
      offset: this.page,
      limit: this.pageSize,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['partners']);
        this.totalSize = res['total_records'];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }

  public doFilter() {
    let param = {
      url: 'get-partners',
      search: this.search_box,
      partner_type_id: this.type,
      from_date: this.from_date,
      to_date: this.to_date,
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
      partner_type_id: this.type,
      from_date: this.from_date,
      to_date: this.to_date,
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



  public deletePartner(partner_id, status) {
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

  navigateTo(url) {
    let user = this.http.getUser();
    if (
      (environment.ALL_ADMIN_SPECIFIC_ROLES.UNIVERSITY_ADMIN == Number(user['role'])) ||
      (environment.ALL_ADMIN_SPECIFIC_ROLES.COLLEGE_ADMIN == Number(user['role'])) ||
      (environment.ALL_ADMIN_SPECIFIC_ROLES.INSTITUTE_ADMIN == Number(user['role'])) ||
      (environment.ALL_ADMIN_SPECIFIC_ROLES.SUPER_ADMIN == Number(user['role']))
    ) {
      url = "/admin/" + url;
      this.router.navigateByUrl(url);
    } else {
        this.translate.get('partner.partners.unauthorized').subscribe((data)=> {
          this.toster.error(data, 'Error', {
            closeButton: true,
          });
        });
      }
  }

  tabClick(event) {
    this.page = 0;
    if (this.paginator != undefined) {
      this.paginator.pageIndex = 0;
      this.paginator.firstPage();
    }
    this.search_box = '';
    this.from_date = '';
    this.to_date = '';
    this.type = event.index;
    this.getPartners();
  }

  resetFilters() {
    this.search_box = '';
    this.from_date = '';
    this.to_date = '';
    this.doFilter();
  }

  openInNewTab(replacer, id, type){
    console.log(`replacer :  ${replacer}`);
    let replaceValue = window.location.host.split('.')[0];
    console.log(`replaceValue :  ${replaceValue}`);
    let url = window.location.origin.replace(replaceValue,replacer);
    url = url.replace('https',environment.SSL_ORIGIN);
    if(replaceValue != 'localhost:4200' || true){
        let user_role =0;
        if(type == 1){
            user_role = environment.ALL_ROLES.UNIVERSITY_ADMIN;
        }
        if(type == 2){
            user_role = environment.ALL_ROLES.COLLEGE_ADMIN;
        }
        if(type == 3){
            user_role = environment.ALL_ROLES.INSTITUTE_ADMIN;
        }
        let url_params = btoa(id+'/'+user_role);
        console.log(url+'/login/'+url_params);
        
      window.open(url+'/login/'+url_params,'_blank');
      return false;
    }else{
      console.log(url);
    }
    /*
    newdomain = window.location.origin.replace('uat',replacer);
    if(newdomain.indexOf(replacer) > -1){
      window.open(newdomain+'/login','_blank');return;
    }
    newdomain = window.location.origin.replace('dev',replacer);
    if(newdomain.indexOf(replacer) > -1){
      window.open(newdomain+'/login','_blank');return;
    }
    newdomain = window.location.origin.replace('master',replacer);
    if(newdomain.indexOf(replacer) > -1){
      window.open(newdomain+'/login','_blank');return;
    }
    newdomain = window.location.origin.replace('localhost:4200',replacer);
    if(newdomain.indexOf(replacer) > -1){
      window.open(newdomain+'/login','_blank');return;
    } */
  }
}
