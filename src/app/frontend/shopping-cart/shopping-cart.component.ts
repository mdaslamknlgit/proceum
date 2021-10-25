import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CartCountService } from '../../services/cart-count.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  //User variables
  public user:any = [];
  public user_id:any = '';
  public role_id:any = '';

  //Cart item variables
  public cart_items:any = []; 
  public cart_count:any = '';
  public product_default_img = environment.PACKAGE_DEFAULT_IMG;

  //Billing address model popup
  public model_status = false;

  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router,
    private cartCountService:CartCountService,
  ) { }

  ngOnInit(): void {
    this.user = this.http.getUser(); 
    if(this.user){
      this.user_id = this.user['id'];
      this.role_id =  Number(this.user['role']);
      this.getCartItems();
    }
  }

  //Get cart items
  public getCartItems(){
    let param = { url: 'get-cart-items', id: this.user_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data'].length){
          this.cart_items = res['data'];
        }else{
          this.cartCountService.sendNumber(0);
          this.toster.error("Your cart is empty!. Please add items to cart!", 'Error');
          this.router.navigateByUrl('/pricing-and-packages');
        }
      } else {
        this.toster.error(res['message'], 'Error');
        this.router.navigateByUrl('/pricing-and-packages');
      }
    });
  }

  //Move to wishlist
  public movetoWishList(product_id,product_type_id){
    let param = { url: 'move-to-wishlist', id: this.user_id, product_id: product_id, product_type_id: product_type_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data'].length){
          this.cart_items = res['data'];
          this.cartCountService.sendNumber(res['cart_count']);
          this.toster.success("Moved To WishList!", 'Success');
        }else{
          this.cartCountService.sendNumber(0);
          this.toster.error("Your cart is empty!. Please add items to cart!", 'Error');
          this.router.navigateByUrl('/pricing-and-packages');
        }
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }

  //Remove item from cart
  public removeCartItem(cart_id){
    let param = { url: 'remove-cart-item', cart_id:cart_id, id: this.user_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data'].length){
          this.cart_items = res['data'];
          this.cartCountService.sendNumber(res['cart_count']);
          this.toster.success("Removed Item From Cart!", 'Success');
        }else{
          this.cartCountService.sendNumber(0);
          this.toster.error("Your cart is empty!. Please add items to order!", 'Error');
          this.router.navigateByUrl('/pricing-and-packages');
        }
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }

  //Toggle model popup for billing address
  toggleModel() {
    this.model_status = !this.model_status;
  }

}
