import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-my-earnings',
  templateUrl: './my-earnings.component.html',
  styleUrls: ['./my-earnings.component.scss']
})
export class MyEarningsComponent implements OnInit {
  displayedColumns: string[] = [
    'sno',
    'referred_student',
    'email',
    'datetime',
    'earned',
    'consumed',
  ];
  public referral_count = 0;
  dataSource = new MatTableDataSource();

  constructor(
    private http: CommonService,
  ) { }
  
  ngOnInit(): void {
    this.getData();
  }
 
  public getData() {
    let param = { url: 'referral-earnings-list'};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['referral_earnings_list']);
        this.referral_count = res['data']['referral_earnings_list'].filter(i => (i.course_purchased == 1 && i.credits_consumed == 0)).length;
      }
    });
  }
}

