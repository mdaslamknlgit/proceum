import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription, interval } from 'rxjs';

export interface PeriodicElement {
  
}

const ELEMENT_DATA: PeriodicElement[] = [

]

@Component({
  selector: 'app-student-assessment-list',
  templateUrl: './student-assessment-list.component.html',
  styleUrls: ['./student-assessment-list.component.scss']
})
export class StudentAssessmentListComponent implements OnInit {
  displayedColumns: string[] = ['assId', 'assTyp', 'assName', 'dtndTm', 'qstns', 'eqDrtn', 'mrKs', 'prCent', 'reSlt', 'stTs', 'acTn']; //'SubName',
  
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public sujectDataSource = new MatTableDataSource();
  subjectDisplayedColumns: string[] = ['Sno', 'Course', 'Topic', 'Count'];

  private subscription : Subscription;
  public dateNow = new Date();
  public dDay = new Date('Jan 04 2022 10:00:00');
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;

  public page: number = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public ip_address = '';
  public platform_name = '';
  public platform_version = '';
  public browser = '';
  public browser_version = '';
  public device_type = '';
  public user = [];
  public exam_instructions_popup = false;
  public exam_id = 0;
  public action_id = 0;
  public remain_time = '';
  public assessment_name = '';

  public edit_model_status:boolean= false;
  public question_total = 0;

  constructor(private http: CommonService, public translate: TranslateService, private toster: ToastrService, private router: Router,) {
    this.translate.setDefaultLang(this.http.lang);
   }

  ngOnInit(): void {
    this.user = this.http.getUser();
    this.pageFilter();
  }

  getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
    this.pageFilter();
  }

  public pageFilter(){
    let param = { url: 'assessment/get-student-list', user_id : this.user['id'],offset: this.page, limit: this.pageSize};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['assessments']);
        this.dataSource.sort = this.sort;
        this.totalSize = res['assessments_count'];        
        this.ip_address = res['loginDetails']['ip_v4_address'];
        this.platform_name = res['loginDetails']['platform_name'];
        this.platform_version = res['loginDetails']['platform_version'];
        this.browser = res['loginDetails']['browser'];
        this.browser_version = res['loginDetails']['brower_version'];
        this.device_type = res['loginDetails']['device_type']; //console.log(res['assessments']);
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.toster.info(res['message'], 'Info');
      }
      
    });
  }

  public startExamPopUP(id,action,dateTime,assName){
    this.exam_id = id;
    this.action_id = action;
    this.assessment_name = assName;
    if(action == 1){
      this.subscription = interval(1000)
           .subscribe(x => { this.getTimeDifference(dateTime); }); 
    }
    this.exam_instructions_popup = true;
  }
  
  private getTimeDifference (dateTime) {
    this.dDay = new Date(dateTime);
    this.timeDifference = this.dDay.getTime() - new  Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits (timeDifference) {
    if(timeDifference <= 0){
      this.action_id = 2;
      this.exam_instructions_popup = true;
      this.subscription.unsubscribe();
      return;
    }
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
    this.remain_time = this.daysToDday+"Days "+this.hoursToDday+"Hrs "+this.minutesToDday+"Mins "+this.secondsToDday+"Sec";
  }

  public closeExamPopUP(){
    this.subscription.unsubscribe();
    this.assessment_name = '';
    this.exam_id = 0;
    this.exam_instructions_popup=false;
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

  public submitExam(exam_id){
    let url = "student/assessments/exam/"+exam_id;
    this.router.navigateByUrl(url);
  }

  startTimer(secs){
      console.log(secs);
        secs = Math.round(secs);
        var hours = Math.floor(secs / (60 * 60));
    
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
    
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        let s = new String(seconds);
        let f_seconds = s.length == 1?'0'+seconds:seconds;
        let m = new String(minutes);
        let f_minutes = m.length == 1?'0'+minutes:minutes;
        let h = new String(hours);
        let f_hours = h.length == 1?'0'+hours:hours;
        this.remain_time = f_hours+"Hrs "+f_minutes+"Mins "+f_seconds+"Sec";
  }

}
