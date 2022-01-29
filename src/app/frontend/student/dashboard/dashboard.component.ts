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
  public expiration_courses:any = []; 
  public bookmarks:any = [];
  public favorites:any = [];
  ngOnInit(): void {
    this.socialAuthService.signOut(true);
    this.user = this.http.getUser(); 
    if(this.user){
      this.user_id = this.user['id'];
      this.role_id =  Number(this.user['role']);
      this.getWishList();
      this.getBookmarksFavorite();
      this.getPackagesAboutToExpire();
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
  getBookmarksFavorite(){
    let param = { url: 'student-bookmarks-favorite', id: this.user_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data']){
          this.bookmarks = res['data'].bookmarks;
          this.favorites = res['data'].favorites;
          // console.log(res['data'].bookmarks.length);
        }
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }
  updateBookmarkFavorite(source_id,type){
    let param = { url: 'manage-statistics', source_id: source_id,type:type};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.getBookmarksFavorite();
        this.toster.success(res['message'], 'Success', { closeButton: true });
      }else{
        this.toster.error(res['message'], 'Error', {
          closeButton: true,
        });
      }
    })
  }
  //Get package expirations of user
  getPackagesAboutToExpire(){
    let param = { url: 'get-user-packages-about-to-expire'};
    /* this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data'].length){
          this.expiration_courses = res['data'];
        }
      }
    }); */
  }
  navigateTo(url){
    this.router.navigateByUrl("student/curriculum/details/"+url);
  }
}
