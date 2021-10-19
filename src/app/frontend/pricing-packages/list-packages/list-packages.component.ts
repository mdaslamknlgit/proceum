import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-list-packages',
  templateUrl: './list-packages.component.html',
  styleUrls: ['./list-packages.component.scss']
})
export class ListPackagesComponent implements OnInit {
  public packages = [];
  public user = [];
  public search_box = '';
  public user_id:any = '';
  public ip:any = '';
  public country_id:any = '';
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.http.getUser(); 
    if(this.user){
      this.user_id = this.user['id'];
    }
    //get client ip
    this.http.getClientIp().subscribe((res) => {
      this.ip = res['ip'];
      this.getPackages();
    });     
  }

  public getPackages() {
    let param = { url: 'get-packages-to-purchase', id: this.user_id, ip: this.ip, country_id: this.country_id };
    this.http.nonAuthenticatedPost(param).subscribe((res) => {
      //console.log(res);
      if (res['error'] == false) {
        this.packages = res['data']['packages'];
        this.country_id = res['data']['country_id'];
        this.user_id = res['data']['user_id'];
        //console.log(this.packages);
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public doFilter() {
    let param = { url: 'get-packages-to-purchase', search: this.search_box, id: this.user_id, ip: this.ip, country_id: this.country_id };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.packages = res['data']['packages'];
        this.country_id = res['data']['country_id'];
        this.user_id = res['data']['user_id']; 
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  public localPrice(prices){
    if(!prices.length){
      return "Loading!";
    }
    this.user = this.http.getUser();
    let user_country_id = 1;
    if(this.user){
      for(var i = 0; i < prices.length;  i++) {
          if(prices[i]['currency_id'] == user_country_id){
            let symbol = prices[i]['currency_symbol'];
            let amount = prices[i]['price_amount'];
            return '<span class="rpe_sym">'+ symbol +'</span>'+ amount;
          }
      }
      let symbol = prices[0]['currency_symbol'];
      let amount = prices[0]['price_amount'];
      return '<span class="rpe_sym">'+ symbol +'</span>'+ amount;
    }else{
      let symbol = prices[0]['currency_symbol'];
      let amount = prices[0]['price_amount'];
      return '<span class="rpe_sym">'+ symbol +'</span>'+ amount;
    }
  }
}
