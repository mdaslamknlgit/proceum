import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

export interface PeriodicElement {
  
}

const ELEMENT_DATA: PeriodicElement[] = [

]

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss']
})
export class AssessmentListComponent implements OnInit {
  displayedColumns: string[] = ['Sno', 'SubName', 'assNme', 'dtndTm', 'qstns', 'eqDrtn', 'invTd', 'created_by',  'acTn']; //'appeRd', 'absnTee',
  
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public sujectDataSource = new MatTableDataSource();
  subjectDisplayedColumns: string[] = ['Sno', 'Course', 'Topic', 'Count'];

  public page: number = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public editStatus = 0;

  public user_id = 0;
  public role_id = 0;
  public user = [];

  public users_list = '';
  public all_users_list: ReplaySubject<any> = new ReplaySubject<any>(1);
  public total_users_list = [];
  public created_by_id = "";
  public search_txt ="";
  public assessment_date = "";
  public maxDate= new Date();
  public is_submit:boolean=false;
  public is_display:boolean=false;
  public edit_model_status:boolean= false;
  public question_total = 0;
  
  constructor(private http: CommonService, public translate: TranslateService, private toster: ToastrService, private router: Router,) {
    this.translate.setDefaultLang(this.http.lang);
   }

  ngOnInit(): void {
    this.user = this.http.getUser();
    this.user_id = this.user['id'];
    this.role_id = this.user['role'];
    if(this.role_id == 1){
      this.is_display = true;
    }
    this.applyFilters();
    this.getUsersList();
  }

  getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
    this.applyFilters();
  }

  public applyFilters(){
    let param = { 
      url: 'assessment/get-list', 
      offset: this.page,
      limit: this.pageSize,
      role:this.role_id,
      user:this.user_id,
      created_by_id:this.created_by_id,
      assessment_date: this.assessment_date,
      search_txt: this.search_txt
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['assessments']);
        this.dataSource.sort = this.sort;
        this.totalSize = res['assessments_count'];
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.toster.info(res['message'], 'Info');
      }
      
    });
  }

  public openDetailsModel(param:any){
    this.edit_model_status = true;
    let assessment_id = param.pk_id;

    let params = { 
      url: 'assessment/get-subject-list', 
      assessment_id:assessment_id
    };
    this.sujectDataSource = new MatTableDataSource();
    this.question_total = 0;
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.sujectDataSource = new MatTableDataSource(res['data']['topics']);
        this.question_total = param.total_questions_count;
      }
    });

  }

  public deleteContentData(id){
    let param = {
      url: 'assessment-delete/' + id ,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.applyFilters();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }

  getUsersList(){
    this.all_users_list.next();
    let params = {
      url: 'assessment/get-user-details'
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        if (res['user_details'].length > 0){
          this.users_list = res['user_details'];
          if(this.users_list != undefined){
            this.all_users_list.next(this.users_list.slice()); 
            this.total_users_list = res['user_details']; 
          }
        }
      }
    });
  }

  searchUsersList(event){
    let search = event;
    if (!search) {
      this.all_users_list.next(this.total_users_list.slice());
    return;
    } else {
      search = search.toLowerCase();
    }
    this.all_users_list.next(
      this.total_users_list.filter(
          (res) => res.first_name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  resetFilters(){
    this.created_by_id = "";
    this.search_txt="";
    this.assessment_date="";
    this.applyFilters();
  }

}
