import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { GlobalApp } from 'src/global';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js';

export interface PeriodicElement {
  
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})



export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumnsRevenue: string[] = ['position', 'weight', 'symbol'];
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource();
  dataSourceRevenue = new MatTableDataSource();

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
  public notes = 0;
  public published = 0;
  public approval_pending = 0;
  public approved = 0;
  public draft = 0;
  public revenue = [];

  public lineChartLegend = false;
  public lineChartType = 'bar';
  public inlinePlugin: any;
  public textPlugin: any;
  public lineChartData:any = [];
  public lineChartLabels:any = [];
  public lineChartOptions:any;
  public lineChartData1:any = [];
  public lineChartLabels1:any = [];
  public lineChartOptions1:any;
  public chartColors: any[] = [
    { 
      backgroundColor:[
        "#303641", "#f56954", "#0073b7", "#00b29e", "#ba79cb", "#ec3b83", "#701c1c",
        "#6c541e","#303641", "#ffa812", "#311B92", "#B71C1C", "#4A148C", "#1A237E",
        "#0D47A1", "#004D40", "#FF6F00", "#BF360C", "#3E2723", "#990000", "#6633FF", 
        "#FBC02D", "#FF7043", "#8E24AA", "#00897B", "#FDD835", "#0277BD", "#6D4C41"
      ] 
    }
  ];

  public getSuperAdminData(){
    let param = { url: 'get-admin-dashboard' };
    this.http.post(param).subscribe((res) => {
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
        this.dataSource = new MatTableDataSource(this.video_types);
        this.videos = data['video']['app_squadz']+data['video']['kpoint']+data['video']['vdo_cipher']+data['video']['youtube'];

        this.published = data['notes']['published'];
        this.approval_pending = data['notes']['approval_pending'];
        this.approved = data['notes']['approved'];
        this.draft = data['notes']['draft'];
        this.notes = this.published+this.approval_pending+this.approved+this.draft;
        this.revenue = res['data']['revenue'];
        this.dataSourceRevenue = new MatTableDataSource(this.revenue);

        this.getVideoStatistics();
        this.getRevenueStatistics();
      }
      
    });

  }

  getVideoStatistics() {
    let name = [];
    let count = [];
    this.video_types.forEach((opt, index) => {
      count.push(opt.count);
      name.push(opt.name);      
    })

    this.lineChartData = [
      {
        label: 'Video Statistics',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: count,
          barThickness: 16,
        // maxBarThickness: 8,
        // minBarLength: 2,
      },
    ]; 
    this.lineChartLabels = name;
    this.lineChartOptions = {
      responsive: true,
      annotation: {
        annotations: [
          {
            drawTime: 'afterDraw',
            // type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 0,
            borderColor: '#000000',
            borderWidth: 2,
            scales: {
              xAxes: [{
                  // gridLines: {
                  //      display:false
                  // }
                  // ticks: {
                  //   maxTicksLimit: 20,
                  // },
                  ticks: { fontColor: 'black' },
                  gridLines: { color: 'rgba(255,255,255,0.1)' }
              }],
              // yAxes: [{
              //     gridLines: {
              //         // display:false
              //         ticks: { fontColor: 'black',  style: 'percent', min: 0, stepValue : 10, max : 100, },
              //         gridLines: { color: 'rgba(255,255,255,0.1)' },
              //     }   
              // }],
              yAxes: [{
                barPercentage: 6.0,
                categoryPercentage: 6.0,
                ticks: {
                 beginAtZero: true,
                  callback: function (value, index, values) {
                    return '$' + value + 'k';
                  },
                }
              }]
            },
            gradient : true,
            showDataLabel : true,
            label: {
              backgroundColor: 'red',
              content: 'global plugin',
              enabled: true,
              position: 'center',
            }
          }
        ]
      }
    };  

  }
  
  getRevenueStatistics() {
    let name = [];
    let amount = [];
    this.revenue.forEach((opt, index) => {
      amount.push(opt.amount);
      name.push(opt.name);      
    })

    this.lineChartData1 = [
      {
        label: 'Revenue',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: amount,
          barThickness: 16,
        // maxBarThickness: 8,
        // minBarLength: 2,
      },
    ]; 
    this.lineChartLabels1 = name;
    this.lineChartOptions1 = {
      responsive: true,
      annotation: {
        annotations: [
          {
            drawTime: 'afterDraw',
            // type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 0,
            borderColor: '#000000',
            borderWidth: 2,
            scales: {
              xAxes: [{
                  // gridLines: {
                  //      display:false
                  // }
                  // ticks: {
                  //   maxTicksLimit: 20,
                  // },
                  ticks: { fontColor: 'black' },
                  gridLines: { color: 'rgba(255,255,255,0.1)' }
              }],
              // yAxes: [{
              //     gridLines: {
              //         // display:false
              //         ticks: { fontColor: 'black',  style: 'percent', min: 0, stepValue : 10, max : 100, },
              //         gridLines: { color: 'rgba(255,255,255,0.1)' },
              //     }   
              // }],
              yAxes: [{
                barPercentage: 6.0,
                categoryPercentage: 6.0,
                ticks: {
                 beginAtZero: true,
                  callback: function (value, index, values) {
                    return '$' + value + 'k';
                  },
                }
              }]
            },
            gradient : true,
            showDataLabel : true,
            label: {
              backgroundColor: 'red',
              content: 'global plugin',
              enabled: true,
              position: 'center',
            }
          }
        ]
      }
    };
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
 