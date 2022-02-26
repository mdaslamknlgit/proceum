import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { GlobalApp } from 'src/global';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})



export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource();

  public offset = 0;
  public limit = 12;
  public partners = [];
  public notifications = [];
  public total_records = 0;
  public synchronous = false;
  public user: any;
  public loadAdmin = false;
  public assessment_count = 0;
  public class_count = 0;
  public colleges_count = 0;
  public notes_count = 0;
  public qbank_count = 0;
  public subscribed_student_count = 0;
  public counts_loaded = false;
  public role = 0;

  constructor(
    private http: CommonService,
    public app: GlobalApp,
  ) { }
  ngOnInit(): void {
    this.user = this.http.getUser();
    this.role = Number(this.user['role']);
    const adminRole = Object.values(environment.ALL_ADMIN_SPECIFIC_ROLES).includes(this.role);
    if(adminRole){
      this.loadAdmin = true;
    }
    if(!environment.CONTENT_USER_ROLES.includes(this.role)){
        if(this.role == 1){
          this.getSuperAdminData();
          this.getPartners();
        }else{
          this.getDashboardData();
        }
    }

  }

  public partner = 0;
  public partner_active = 0;
  public partner_inactive = 0;
  public university = 0;
  public college = 0;
  public institute = 0;
  public curriculums = 0;
  public courses = 0;
  public qbank = 0;
  public packages = 0;
  public users = 0;
  public students = 0;
  public teachers = 0;
  public students_active = 0;
  public students_inactive = 0;
  public teacher_active = 0;
  public teacher_inactive = 0;
  public videos = 0;
  public video_types = [];
  public youtube = 0;
  public kpoint = 0;
  public vdo_cipher = 0;
  public app_squadz = 0;
  public published = 0;
  public approval_pending = 0;
  public approved = 0;
  public draft = 0;

  public getSuperAdminData(){
    let param = { url: 'get-admin-dashboard' };
    this.http.post(param).subscribe((res) => {
      console.log(res['data']);
      if(res['error'] == false){
        let data = res['data'];
        this.partner_active = data['partner']['university_active']+data['partner']['college_active']+data['partner']['institute_active'];
        this.partner_inactive = data['partner']['university_inactive']+data['partner']['college_inactive']+data['partner']['institute_inactive'];
        this.partner = this.partner_active+this.partner_inactive;
        this.university = data['partner']['university_active']+data['partner']['university_inactive'];
        this.college = data['partner']['college_active']+data['partner']['college_inactive'];
        this.institute = data['partner']['institute_active']+data['partner']['institute_inactive'];

        this.courses = data['curriculums']['courses'];
        this.qbank = data['curriculums']['qbank'];
        this.packages = data['curriculums']['packages'];
        this.curriculums = data['curriculums']['courses']+data['curriculums']['qbank']+data['curriculums']['packages'];

        this.students_active = data['user']['students_active'];
        this.students_inactive = data['user']['students_inactive'];
        this.students = this.students_active+this.students_inactive;
        this.teacher_active = data['user']['teacher_active'];
        this.teacher_inactive = data['user']['teacher_inactive'];
        this.teachers = this.teacher_active+this.teacher_inactive;
        this.users = this.students+this.teachers;

        this.video_types = environment.video_types;
        let i = 1;
        this.video_types.map((item)=>{
          item.sno = i;
          if(item.value == 'KPOINT'){
            item.count = data['video']['kpoint'];
          }
          if(item.value == 'YOUTUBE'){
            item.count = data['video']['youtube'];
          }
          if(item.value == 'APP_SQUADZ'){
            item.count = data['video']['app_squadz'];
          }
          if(item.value == 'VDO_CIPHER'){
            item.count = data['video']['vdo_cipher'];
          }
          i++;
        });
        console.log(this.video_types);
        this.dataSource = new MatTableDataSource(this.video_types);
        
        this.videos = data['video']['app_squadz']+data['video']['kpoint']+data['video']['vdo_cipher']+data['video']['youtube'];
      }
      
    });

  }

  public getPartners() {
    if (this.user['role'] != '1') {
      return false;
    }
    let param = {
      url: 'get-partners',
      offset: this.offset,
      limit: this.limit,
      status: '1',
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.partners = [...this.partners, ...res['data']['partners']];
        this.offset = this.partners.length;
        this.total_records = res['total_records'];
        this.synchronous = true;
      }
    });
  }

  public getDashboardData() {
    let param = {
      url: 'get-dashboard-data'
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.notifications = res['data']['notifications'];
        this.assessment_count = res['data']['assessment_count'];
        this.class_count = res['data']['class_count'];
        this.colleges_count = res['data']['colleges_count'];
        this.notes_count = res['data']['notes_count'];
        this.qbank_count = res['data']['qbank_count'];
        this.subscribed_student_count = res['data']['subscribed_student_count'];
        if(Object.values(environment.PARTNER_ADMIN_SPECIFIC_ROLES).includes(Number(this.user['role']))){
          this.counts_loaded = true;
        }
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.bottomReached() && (this.offset < this.total_records) && this.synchronous) {
      this.synchronous = false;
      //this.getPartners();
    }
  }

  bottomReached(): boolean {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
  }

}
 