import { Component, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private socialAuthService: SocialAuthService,
    private http: CommonService,
    public toster: ToastrService,
    private router: Router,
    ) {}
  //User variables
  public user:any = [];
  public user_id:any = '';
  public role_id:any = '';

  //wishlist items variables
  public wish_list:any = []; 
  ngOnInit(): void {
    this.socialAuthService.signOut(true);
    this.user = this.http.getUser(); 
    if(this.user){
      this.user_id = this.user['id'];
      this.role_id =  Number(this.user['role']);
      this.getWishList();
    }
  }

  //Get wishlist items
  getWishList(){
    let param = { url: 'get-wishlist', id: this.user_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data'].length){
          this.wish_list = res['data'];
        }else{
          //this.toster.error("Your cart is empty!. Please add items to cart!", 'Error');
        }
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }
}
