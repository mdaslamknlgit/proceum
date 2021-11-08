import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { CartCountService } from '../../../services/cart-count.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-student-topbar',
  templateUrl: './student-topbar.component.html',
  styleUrls: ['./student-topbar.component.scss'],
})
export class StudentTopbarComponent implements OnInit {
  public sidemenu_status: string = localStorage.getItem('sidemenu');
  public user;
  //For cart badge
  number: any;
  subscription: Subscription;
  user_id='';

  constructor(
    private http: CommonService, 
    private route: Router,
    private cartCountService:CartCountService,
    ) {
    this.http.menu_status = localStorage.getItem('sidemenu');
    //for cart badge
    this.subscription = this.cartCountService.getNumber().subscribe(number => { this.number = number });
  }
  ngOnInit(): void {
    this.user = this.http.getUser();
    if(this.user){
      this.user_id = this.user['id'];
    }
    this.getCartCount();
  }

  // toggleSidemenu(param) {
  //   this.sidemenu_status =
  //     this.sidemenu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
  //   localStorage.setItem('sidemenu', this.sidemenu_status);
  //   this.http.menu_status = this.sidemenu_status;
  // }
  getCartCount(){
    if(this.user_id != ''){
      let params = { url: 'get-cart-count', id: this.user_id };
      this.http.post(params).subscribe((res) => {
       if(res['data'] != 0){
         this.cartCountService.sendNumber(res['data']);
       }
      });  
    }
    
  }

  toggleSidemenu(param) {
    this.sidemenu_status =
    this.http.menu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
    this.http.menu_status = this.sidemenu_status;
  }

  logout() {
    let login_id = JSON.parse(atob(localStorage.getItem('user'))).login_id;
    let params = { url: 'logout', login_id: login_id };
    this.http.post(params).subscribe((res) => {
      this.http.removeSession();
      this.route.navigate(['/login']);
    });
  }
}
