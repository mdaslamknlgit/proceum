import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CartCountService } from '../../services/cart-count.service';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';
import { WindowRefService } from '../../services/window-ref.service';

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
  public total_amount:any = 0;
  public total_payable:any = 0;
  public coupon_applied:any = false;
  public my_earnings_applied:any = false;
  public coupon_discount_amount:any = 0;
  public my_earnings_discount_amount:any = 0;
  public my_earnings:any = 0;
  public coupon_description:any = '';
  public have_coupon_code:any = false;
  public coupon_code:any = '';
  public disable_payment_button:any = false;
  public product_default_img = environment.PACKAGE_DEFAULT_IMG;

  //Billing address model popup
  public model_status = false;
  public user_address:any;
  public contact_name = '';
  public phone = '';
  public country_id:any = '';
  public country_name= '';
  public state_id:any = '';
  public state_name = '';
  public city = '';
  public city_name = '';
  public address = '';
  public zip_code = '';
  public referral_count = 0;
  public approved_count = 0;

  //Country and state related data variables
  public countrys = [];
  public states = [];
  public cities = [];
  all_countrys: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_states: ReplaySubject<any> = new ReplaySubject<any>(1);
  all_cities: ReplaySubject<any> = new ReplaySubject<any>(1);

  //Order related variable
  public order_id:any = '';
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router,
    private cartCountService:CartCountService,
    private winRef: WindowRefService
  ) { }

  ngOnInit(): void {
    this.user = this.http.getUser(); 
    if(this.user){
      this.contact_name = this.user["name"];
      this.user_id = this.user['id'];
      this.role_id =  Number(this.user['role']);
      this.getCartItems();
      this.getCountries();
      this.getMyEarnings();
    }
  }

  checked(e) {
    if (e.checked == true) {
      this.my_earnings = this.approved_count + this.referral_count;
      this.applyCoupon();
    } else {
      this.my_earnings = 0;
      this.applyCoupon();
    }
  }

  public getMyEarnings(){
    let param = { url: 'referral-earnings-list'};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.referral_count = res['data']['referral_earnings_list'].filter(i => (i.course_purchased == 1 && i.credits_consumed == 0)).length;
      }
    });

    let params={url: 'social-share'};
    this.http.get(params).subscribe((res: Response) => {
      this.approved_count = res['data']['social_share_list'].filter(i => (i.approval_status == 1 && i.credits_consumed == 0)).length;
    });
  }

  //Get cart items
  public getCartItems(){
    let param = { url: 'get-cart-items', id: this.user_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data'].length){
          this.cart_items = res['data'];
          this.user_address = res['user_address'];
          if(this.user_address){
            this.country_id = this.user_address["country_id"];
            this.country_name = this.user_address["country_name"];
            this.state_id = this.user_address["state_id"];            
            if(this.country_id > 0){
              this.getStates(this.country_id);
            }
            if(this.state_id > 0){
              this.getCities(this.state_id);
            }
            this.state_name = this.user_address["state_name"];
            this.city_name = this.user_address["city_name"];
            this.city = this.user_address["city"];
            this.address = this.user_address["address_line_1"]+ ' ' + this.user_address["address_line_2"];
            this.zip_code = this.user_address["zip_code"];
            this.phone = this.user_address["phone"];
          }    
          this.updateAmounts(res);      
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
          this.updateAmounts(res);   
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
          this.updateAmounts(res);   
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
  public toggleModel() {
    this.model_status = !this.model_status;
  }

  //Get list of countries
  public getCountries(){
    let param = { url: 'get-countries' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.countrys = res['data']['countries'];
        if(this.countrys != undefined){
          this.all_countrys.next(this.countrys.slice());
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }
  
  //Filter countries by search string
  public filterCountries(event) {
    let search = event;
    if (!search) {
      this.all_countrys.next(this.countrys.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_countrys.next(
      this.countrys.filter(
        (country) => country.country_name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  //Get list of states based on country selection 
  public getStates(selected_country_id: number) {
    if (selected_country_id > 0) {
      //First set country_name
      this.countrys.filter((item) => {
        if(item.id == selected_country_id){
          this.country_name = item.country_name;
        }
      });

      let param = {
        url: 'get-states',
        country_id: selected_country_id,
      };
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          this.states = res['data']['states'];
          this.all_states.next(this.states.slice());
        } else {
          let message = res['errors']['title']
            ? res['errors']['title']
            : res['message'];
          //this.toster.error(message, 'Error', { closeButton: true });
        }
      });
    }
  }

  //Filter states by search string
  public filterStates(event) {
    let search = event;
    if (!search) {
      this.all_states.next(this.states.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_states.next(
      this.states.filter(
        (state) => state.state_name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  //Set state name by stateid 
  public setStateName(){
    if(this.state_id > 0) {
      //set state_name
      this.states.filter((item) => {
        if(item.id == this.state_id){
          this.state_name = item.state_name;
        }
      });
    }
  }

   //Set state name by stateid 
   public setCityName(){
    if(this.state_id > 0) {
      //set state_name
      this.cities.filter((item) => {
        if(item.id == this.city){
          this.city_name = item.city_name;
        }
      });
    }
  }

  getCities(selected_state_id: number) {
    let params = {
      url: 'get-cities',
      state_id: selected_state_id,
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.cities = res['data']['cities'];
        this.all_cities.next(this.cities.slice());
      }
    });
  }

  filterCities(event) {
    let search = event;
    if (!search) {
      this.all_cities.next(this.cities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.all_cities.next(
      this.cities.filter(
        (city) => city.city_name.toLowerCase().indexOf(search) > -1
      )
    );
  }

  //Update cart amounts when there is any event occured related to cart
  public updateAmounts(res){
    this.total_amount = res['total_amount'];
    this.total_payable = res['total_payable'];
    this.coupon_applied = res['coupon_applied'];
    this.my_earnings_applied = res['my_earnings_applied'];
    this.coupon_discount_amount = res['coupon_discount_amount'];
    this.my_earnings_discount_amount = res['my_earnings_discount_amount'];
    this.coupon_description = res['coupon_description'];
  }

  //Apply Coupon
  public applyCoupon(){
    let param = { url: 'apply-coupon', id: this.user_id, coupon_code: this.coupon_code,my_earnings:this.my_earnings};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data'].length){
          //this.cart_items = res['data'];
          this.updateAmounts(res);   
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

  //remove Coupon
  public removeCoupon(){
    this.coupon_code = '';
    this.applyCoupon();
    /*let param = { url: 'get-cart-items', id: this.user_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data'].length){
          this.updateAmounts(res);      
        }else{
          this.cartCountService.sendNumber(0);
          this.toster.error("Your cart is empty!. Please add items to cart!", 'Error');
          this.router.navigateByUrl('/pricing-and-packages');
        }
      } else {
        this.toster.error(res['message'], 'Error');
        this.router.navigateByUrl('/pricing-and-packages');
      }
    });*/
  }

  /************************************************************************
   ************** Payments related functionality starts here **************
   ************************************************************************/
  public proceedPayment(){
    //Validate user billing address
    if(this.contact_name == '' || this.address == '' || this.city == '' || this.state_name == '' || 
    this.country_name == '' || this.zip_code == '' || this.phone == ''){
      this.toster.error("Please provide required fields of billing address!", 'Error');
      return;
    }
    //=========Create order in proceum database
    //Disable Payment Button
    if(this.disable_payment_button){
      return;
    }
    this.disable_payment_button = true;
    //Prepare address details
    let adressDetails = {
      a_contact_name  : this.contact_name,
      b_address       : this.address,
      c_city          : this.city_name,
      d_state_name    : this.state_name,
      e_country_name  : this.country_name,
      f_zip_code      : this.zip_code,
      g_phone         : this.phone,
    }
    //Prepare main object to send
    let params = {
      url             : 'proceed-payment',
      cart_items      : this.cart_items,
      adress_details  : adressDetails,
      coupon_applied  : this.coupon_applied,
      my_earnings_applied  : this.my_earnings_applied,
      coupon_code     : this.coupon_code,
      my_earnings     : this.my_earnings,
      total_amount    : this.total_amount,
      total_payable   : this.total_payable,
      coupon_discount_amount : this.coupon_discount_amount,
      my_earnings_discount_amount : this.my_earnings_discount_amount,
    }
    //Make a post request
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        //============PopUp Payment gateway
        this.payWithRazorpay(res['data']);
      } else {
        this.toster.error(res['message'], 'Error');
        this.disable_payment_button = false;
      }
    });
  }

  public payWithRazorpay(data) {
    this.order_id = data.order_id;
    const options: any = {
      key: data.razorpay_key,
      amount: data.amount,
      currency: data.currency,
      name: data.company_name,
      description: data.company_description,
      image: data.company_logo, 
      order_id: data.id, 
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#41ab3c'
      },
      prefill : {
          name: this.contact_name,
          email: data.email,
          contact: data.phone,
      },
    };
    options.handler = ((response, error) => {
      // call your backend api to verify payment signature & capture transaction
      if(response){
        this.razorpayPaymentSuccess(response);
      }
      if(error){
        console.log(error);
      }
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      this.disable_payment_button = false;
      //console.log('Transaction cancelled.');
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.on('payment.failed', function (response){
      this.toster.error("Payment Failed! "+response.error.reason, 'Error');
      this.disable_payment_button = false;
    });
    rzp.open();
  }

  public razorpayPaymentSuccess(response){
    let params = {
      url                             : 'razorpay-payment-success',
      payment_gateway_order_id        : response.razorpay_order_id,
      payment_gateway_payment_id      : response.razorpay_payment_id,
      signature                       : response.razorpay_signature,
      order_id                        : this.order_id,
    }
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success("Congrats! Payment is success!", 'Success');  
        this.router.navigateByUrl('/student/order-details/' +res['order_id']);
      } else {
        this.toster.error(res['message'], 'Error');
      }
      let order_id = res['data']['pk_id'];
      this.router.navigateByUrl('student/order-details/'+order_id);
      this.disable_payment_button = false;
    });
  }

}
