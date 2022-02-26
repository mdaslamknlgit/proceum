import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute,Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  //Cart item variables
  public order_details:any;
  public user_id:any;
  public order_items:any = [];
  public api_url = environment.apiUrl;

  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
   }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      let user = this.http.getUser();
      this.user_id = user.id;
      let order_id = param.order_id;
      if (order_id != undefined) {
        this.getOderDetails(order_id);
      }
      else{
        this.router.navigateByUrl('/login');
      }
    });
    //this.router.navigateByUrl('/pricing-and-packages');
  }

  //Get cart items
  public getOderDetails(order_id){
    let param = { url: 'get-order-details', order_id: order_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data']){
          this.order_details = res['data']['order_details'];
          this.order_items = res['data']['order_items'];
        }else{
          this.toster.error("Invalid Order!", 'Error');
          this.router.navigateByUrl('/pricing-and-packages');
        }
      } else {
        this.toster.error(res['message'], 'Error');
        this.router.navigateByUrl('/pricing-and-packages');
      }
    });
  }

}
