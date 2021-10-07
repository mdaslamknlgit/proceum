import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-list-years',
  templateUrl: './list-years.component.html',
  styleUrls: ['./list-years.component.scss']
})
export class ListYearsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'organization_name',
    'partner_type',
    'actions',
    'status',
  ];
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public page = 0;
  public page_title = "Year";
  public slug = "year";
  popoverTitle = '';
  popoverMessage = '';
  public model_status = false;
  public edit_model_status = false;
  public self_or_other = "other"
  public show_radio = false;
  public organization_type = '';
  public name_of = '';
  public partner_id: any = null;
  public parent_id: number = null;
  public organization = '';
  public year_id = '';
  public semester_id = '';
  public group_id = '';
  public user_role = 3;
  universities = [];
  colleges = [];
  institutes = [];
  years = [];
  public organization_types = environment.ORGANIZATION_TYPES;
  all_universities: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_colleges: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_institutes: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_years: ReplaySubject<any> = new ReplaySubject<any>(1);
  
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router
    ) { }

  ngOnInit(): void {
    const user = JSON.parse(atob(localStorage.getItem('user')));
    this.show_radio = (user.role == 1) ? true : false;
    this.getData();
  }

  public getData() {
    let param = { url: 'get-year-semester-group-by-slug','slug':'year','partner_id':''};
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

  public getRow(id) {
    let param = { url: 'get-year-semester-group-by-id','id':id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let item = res['data'];
        this.year_id = item.pk_id;
        this.partner_id = item.partner_id;
        this.parent_id = item.parent_id;
        this.slug = item.slug;
        this.name_of = item.name;
        this.organization = item.partner_id;
        this.self_or_other = (item.partner_id == null) ? 'self' : 'other';
        this.show_radio = (item.partner_id == null) ? false : true;
        this.organization_type = (item.partner_type == null) ? '' : item.partner_type.toString();
        this.onOrganizationTypeChange();

        //Finally open the model
        this.model_status = true;
        
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }

  public onAddingForChange(){
    this.year_id = null;
    this.partner_id = null;
    this.parent_id = null;
    this.name_of = '';
    this.organization = '';
    this.organization_type = '';
  }

  public doFilter() {
    let param = { url: 'get-packages', search: this.search_box };
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
      url: 'get-packages',
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
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


  public changeStatus(package_id, status){
    let param = {
      url: 'year-semester-group-status',
      id: package_id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getData();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
    
  }

  deleteRecord(id){
    let param = {
      url: 'delete-year-semester-group',
      id: id,
    };
    this.http.post(param).subscribe((res) => {  
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getData();
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

  toggleModel() {
    this.show_radio = true;
    this.self_or_other = 'other';
    this.model_status = true;
    // (<HTMLFormElement>document.getElementById('create_form')).reset();
    // this.self_or_other = "other";
    //(<HTMLFormElement>document.getElementById('edit_discount_form')).reset();
  }


  onOrganizationTypeChange(){
    // this.year_id = '';
    // this.semester_id = '';
    // this.group_id = '';
    if(this.organization_type == '1'){ //University
      this.getUniversities();
    }else if(this.organization_type == '2'){ //College
      this.getColleges();
    }else if(this.organization_type == '3'){ //Institute
      this.getInstitutes();
    }
  }

  //To get all the Universities list
  getUniversities(){
    let param = { url: 'get-partners-list',partner_type_id : 1 };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.universities = res['data']['partners'];
        if(this.universities != undefined){
          this.all_universities.next(this.universities.slice()); 
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  filterUniversity(event) {
    let search = event;
    if (!search) {
      this.all_universities.next(this.universities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_universities.next(
      this.universities.filter(
        (university) => university.name.toLowerCase().indexOf(search) > -1
      )
    );
  }
  
  //To get all college list
  getColleges(){
    let param = { url: 'get-partners-list',partner_type_id : 2 };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.colleges = res['data']['partners'];
        if(this.colleges != undefined){
          this.all_colleges.next(this.colleges.slice()); 
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  filterCollege(event) {
    let search = event;
    if (!search) {
      this.all_colleges.next(this.colleges.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_colleges.next(
      this.colleges.filter(
        (college) => college.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  //To get all college list
  getInstitutes(){
    let param = { url: 'get-partners-list',partner_type_id : 3 };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.institutes = res['data']['partners'];
        if(this.institutes != undefined){
          this.all_institutes.next(this.institutes.slice()); 
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  filterInstitute(event) {
    let search = event;
    if (!search) {
      this.all_institutes.next(this.institutes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_institutes.next(
      this.institutes.filter(
        (institute) => institute.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  getYears(partner,parent_id){
    this.partner_id = partner;
    let param = { url: 'get-year-semester-group',partner_id : partner, parent_id : parent_id, slug : 'year' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.years = res['data'];
        if(this.years != undefined){
          this.all_years.next(this.years.slice()); 
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  createNew(){
    let error = false;
    if(this.name_of == ''){
      error = true;
    }
    if(!error){
    let param = { 
      url: 'create-year-semester-group',
      name: this.name_of, 
      partner_id : this.organization, 
      parent_id : this.parent_id, 
      slug : 'year', 
      id : this.year_id,
      status : '1',
     };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        this.getData();
        this.model_status = false;
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
    }
  }
}

