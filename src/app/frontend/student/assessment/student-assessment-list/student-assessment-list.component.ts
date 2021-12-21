import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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
  displayedColumns: string[] = ['assId', 'assTyp', 'SubName', 'dtndTm', 'qstns', 'eqDrtn', 'mrKs', 'prCent', 'reSlt', 'stTs', 'acTn'];
  
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public page: number = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public user = [];
  public exam_instructions_popup = false;
  public exam_id = 0;
  public action_id = 0;
  public remain_time = '';

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
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.toster.info(res['message'], 'Info');
      }
      
    });
  }

  public startExamPopUP(id,action,sec){
    this.exam_id = id;
    this.action_id = action;
    if(action == 1){
      this.startTimer(sec);
    }
    this.exam_instructions_popup = true;
  }

  public closeExamPopUP(){
    this.exam_id = 0;
    this.exam_instructions_popup=false;
  }

  public submitExam(exam_id){
    let url = "student/assessments/exam/"+exam_id;
    this.router.navigateByUrl(url);
  }

  startTimer(secs){
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
    this.remain_time = f_hours+" : "+f_minutes+" : "+f_seconds;
  }

}
