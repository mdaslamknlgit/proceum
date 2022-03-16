import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CartCountService } from '../../../services/cart-count.service';

@Component({
  selector: 'app-list-packages',
  templateUrl: './list-packages.component.html',
  styleUrls: ['./list-packages.component.scss']
})
export class ListPackagesComponent implements OnInit {
  public packages = [];
  public user = [];
  public headings = [];
  public search_box = '';
  public user_id:any = '';
  public ip:any = '';
  public country_id:any = '';
  public admin_role_ids:any = [];
  public role_id:any = '';
  public cart_count:any;
  public noPackagesFound = false;
  public model_status = false;
  public share_url;
  public domain;
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router,
    private cartCountService:CartCountService,
  ) { }

  ngOnInit(): void {
    this.domain = location.origin;
    this.user = this.http.getUser();
    if(this.user){
      this.user_id = this.user['id'];
      this.role_id =  Number(this.user['role']);
    }
    //get client ip
    /* this.http.getClientIp().subscribe((res) => {
      this.ip = res['ip'];
      this.getPackages();
    });    */
    this.getPackages();
  }

  public getPackages() {
    let param = { url: 'get-packages-to-purchase', user_id: this.user['id']};
    this.http.nonAuthenticatedPost(param).subscribe((res) => {
      //console.log(res);
      if (res['error'] == false) {
        this.packages = res['data']['packages'];
        this.headings = res['data']['headings'];
        this.country_id = res['data']['country_id'];
        this.admin_role_ids = res['data']['avoid_roles'];
      } else {
        this.packages = [];
        this.toster.error(res['message'], 'Error');
        //this.router.navigateByUrl('/');
        this.noPackagesFound = true;
      }
    });
  }

  public doFilter() {
    let param = { url: 'get-packages-to-purchase', user_id: this.user['id'], search: this.search_box };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.packages = res['data']['packages'];
        this.country_id = res['data']['country_id'];
        this.admin_role_ids = res['data']['avoid_roles'];
      } else {
        this.packages = [];
        this.toster.error(res['message'], 'Error');
        this.noPackagesFound = true;
        //this.router.navigateByUrl('/');
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

  public addToCart(product_id){
    if(this.user_id == ''){
      localStorage.setItem('_redirect_url', window.location.pathname);
      this.router.navigateByUrl('/login');
      return;
    }
    //Prepare post data
    let cart_data = {
      product_id : product_id,
      user_id  : this.user_id,
      product_type_id : 1, //Package
    }
    let param = { url: 'add-to-cart', cart_data :cart_data };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.cart_count = res['data']['cart_count'];
        this.toster.success("Package added to cart successfully!", 'Success');
        this.sendNumber();
      } else {
        this.toster.error(res['message'], 'Error');
      }
      //console.log(res);
    });
  }

  sendNumber() {
    this.cartCountService.sendNumber(this.cart_count);
  }

  navigateTo(url){
    this.router.navigateByUrl(url);
  }
  toggleModel(pkg_id) {
    this.share_url = this.domain+"/"+"package-details/"+pkg_id;
    this.model_status = !this.model_status;
  }
}
