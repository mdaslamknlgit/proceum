import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
  public shwCpncd = false;
  public discounts;
  public promotions;
  constructor(private http: CommonService,private authHttp: AuthService,) { }

  ngOnInit(): void {
    this.getcoupons();
  }
  getcoupons(){
    let param = { url: 'get-coupons'};
    let user = this.http.getUser();
    if(user){
      this.http.post(param).subscribe((res) => {
        if(res['error'] == false) {
          this.discounts =  res['data']['discounts_gt'];
          this.promotions =  res['data']['promotions_gt'];
        }
      })
    }else{
      this.authHttp.post(param).subscribe((res) => {
        if(res['error'] == false) {
          this.discounts =  res['data']['discounts_gt'];
          this.promotions =  res['data']['promotions_gt'];
        }
      })
    }
  }
  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
}
