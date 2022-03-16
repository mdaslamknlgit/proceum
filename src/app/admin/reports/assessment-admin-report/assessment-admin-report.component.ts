import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assessment-admin-report',
  templateUrl: './assessment-admin-report.component.html',
  styleUrls: ['./assessment-admin-report.component.scss']
})
export class AssessmentAdminReportComponent implements OnInit {

  public assessment_id = null;
  public assessment_key = null;
  public organization_type_id = null;
  public organization_list_id = null;
  public college_id = null;
  public year_id = null;
  public semester_id = null;
  public group_id = null;
  public user = [];

  public partner_name = '';
  public college_name = '';
  public assessment_name = '';
  public assessment_date_time = '';
  public created_by = '';
  public question_duration = '';
  public question_total = '';
  public passed = 0;

  public page = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public displayedColumns: string[] = ['s_no', 'name','email', 'questions_attempted', 'skipped', 'right', 'wrong', 'percentage', 'result', 'actions'];
  public dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public report_count = 0;
  public apiUrl = "";
   
  constructor(private http: CommonService, public translate: TranslateService, private toster: ToastrService, private router: Router,private activeRoute: ActivatedRoute,) {
    this.translate.setDefaultLang(this.http.lang);
    this.apiUrl = this.http.apiURL;
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((routeParams) => {
      this.assessment_id = routeParams.id;
      this.assessment_key = routeParams.key;
      this.organization_type_id = routeParams.type;
      this.organization_list_id = routeParams.org;
      if(this.organization_type_id == 1){
        this.college_id = routeParams.col;
        this.year_id = routeParams.year;
        this.semester_id = routeParams.sem;
        this.group_id = routeParams.grp;
      }else{
        this.year_id = routeParams.col;
        this.semester_id = routeParams.year;
        this.group_id = routeParams.sem;
      }
      this.getPartnerName();
      this.getAssesment();
      this.getReports();
    });
    this.user = this.http.getUser();

  }

  getPartnerName()
  {
      let param = { url: 'edit-partner/'+ this.organization_list_id };
      this.http.post(param).subscribe((res) => {
        let partner = res['data'];
        this.partner_name = partner.partner_name;
      });

      if(this.organization_type_id ==1){
          let param1 = { url: 'edit-partner-child/'+ this.college_id, partner_id: this.organization_list_id };
          this.http.post(param1).subscribe((res) => {
            let partner = res['data'];
            this.college_name = partner.partner_name;
          });
      }      
  }

  getAssesment(){
    let param = {url: 'assessment/show', assessment_id: this.assessment_id,assessment_key: this.assessment_key, list_type_id: this.organization_type_id, organization: this.organization_list_id};
    this.http.post(param).subscribe((res) => {
      //console.log(res);
      if (res['error'] == false) {        
          let assessmentDetails = res['data']['assessmentDetails'];
          this.assessment_name = assessmentDetails['assessment_name'];
          this.assessment_date_time = assessmentDetails['assessment_date_time'];
          this.created_by = assessmentDetails['created_by'];
          this.question_duration = assessmentDetails['time_per_question'];
          this.question_total = assessmentDetails['total_questions_count'];
      }else{
      }
    });
  }

  getReports() {
    this.report_count = 0;
    let param = { url: 'assessment/get-reports',"offset": this.page, "limit": this.pageSize, "status": '1', "assessment_id": this.assessment_id, list_type_id: this.organization_type_id, organization: this.organization_list_id, college:this.college_id, year_id:this.year_id, semester_id:this.semester_id, group_id:this.group_id};
    this.http.post(param).subscribe((res) => {
    if (res['error'] == false) {
        let data = res['data'];
        this.dataSource = new MatTableDataSource(data['reports']);
        this.report_count = data['report_count'];
        this.passed = data['passed'];
    } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
    }
    });
  }

  public getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
    this.page = (event.pageSize * event.pageIndex);
    this.getReports();
  }

}
