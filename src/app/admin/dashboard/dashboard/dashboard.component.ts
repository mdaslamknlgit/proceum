import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { GlobalApp } from 'src/global';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

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

  constructor(
    private http: CommonService,
    public app: GlobalApp,
  ) { }
  ngOnInit(): void {
    this.user = this.http.getUser();
    let role = Number(this.user['role']);
    const adminRole = Object.values(environment.ALL_ADMIN_SPECIFIC_ROLES).includes(role);
    if(adminRole){
      this.loadAdmin = true;
    }
    if(!environment.CONTENT_USER_ROLES.includes(role)){
        this.getPartners();
        this.getDashboardData();
    }

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
        this.counts_loaded = true;
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
