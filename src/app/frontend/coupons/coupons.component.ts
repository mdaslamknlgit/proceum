import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
  public shwCpncd = false;
  public discounts;
  public promotions;
  constructor(private http: CommonService,) { }

  ngOnInit(): void {
    this.getcoupons();
  }
  getcoupons(){
    let param = { url: 'get-coupons'};
    this.http.get(param).subscribe((res) => {
      if(res['error'] == false) {
        this.discounts =  res['data']['discounts_gt'];
        this.promotions =  res['data']['promotions_gt'];
      }
    })
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
