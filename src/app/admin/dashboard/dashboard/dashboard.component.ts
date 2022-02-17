import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { GlobalApp } from 'src/global';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  
  public offset = 0;
  public limit = 10;
  public partners = [];
  public total_records = 0;
  public synchronous = false;
  public user:any;

  constructor(
    private http: CommonService,
    public app:GlobalApp,
  ) {}
  ngOnInit(): void {
    this.user = this.http.getUser();
    
    this.getPartners();
  }

  public getPartners() {
    if(this.user['role'] != '1'){
        return false;
    }
    let param = { 
      url: 'get-partners' , 
      offset : this.offset,
      limit : this.limit,
      status : '1',
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.partners = [ ...this.partners, ...res['data']['partners']];
        this.offset = this.partners.length;
        this.total_records = res['total_records'];
        this.synchronous = true;
      } 
    });
  }

    @HostListener('window:scroll', [])
    onScroll(): void {
      if (this.bottomReached() && (this.offset < this.total_records) && this.synchronous) {
        this.synchronous = false;
        this.getPartners(); 
      }
    }

  bottomReached(): boolean {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
  }

}
