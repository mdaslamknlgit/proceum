import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { CartCountService } from '../../../services/cart-count.service';
import { ReplaySubject } from 'rxjs';

interface CurriculumNode {
  id?: number;
  name: string;
  curriculum_id?: number;
  selected?: boolean;
  indeterminate?: boolean;
  parentid?: number;
  is_curriculum_root?: boolean;
  children?: CurriculumNode[];
  has_children?: any;
  ok?: boolean;
}

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss']
})
export class PackageDetailsComponent implements OnInit {
  public package_id = 0;
  public package_prices = [];
  public sample_videos = [];
  public testimonials = [];
  public faqs = [];
  public package: any = '';
  public user = [];
  public iframe_width = '400';
  public iframe_height = '300';
  public rating = 0;
  public review = '';
  public package_avg_rating: any = 0;
  public review_error = false;
  public user_id: any = '';
  public ip: any = '';
  public country_id: any = '';
  public admin_role_ids: any = [];
  public role_id: any = '';
  public cart_count: any;
  public addons_arr: any;
  public topics = [];
  all_topics: ReplaySubject<any> = new ReplaySubject<any>(1);

  //Tree controls for topics tab
  treeControl = new NestedTreeControl<CurriculumNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CurriculumNode>();

  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cartCountService: CartCountService,

  ) { }

  hasChild = (_: number, node: CurriculumNode) => !!node.has_children && node.has_children.length > 0;

  ngOnInit(): void {
    this.user = this.http.getUser();
    if (this.user) {
      this.user_id = this.user['id'];
      this.role_id = Number(this.user['role']);
    }

    this.activatedRoute.params.subscribe((param) => {
      this.package_id = param.id;
      if (this.package_id != undefined) {
        //this.getPackage();
      }
      else {
        this.package_id = 0;
      }
    });

    //get client ip
    /* this.http.getClientIp().subscribe((res) => {
     this.ip = res['ip'];
     this.getPackage();
   },
   error => {
     this.toster.error("Looks your internet is off!", 'Error', { closeButton: true });
   });  */
    this.getPackage();
  }

  public getPackage() {
    let data = { url: 'get-package-details', package_id: this.package_id, status: '1', id: this.user_id, ip: this.ip, country_id: this.country_id };
    this.http.nonAuthenticatedPost(data).subscribe((res) => {
      if (res['error'] == false) {
        this.package = res['data']['package_data'];
        this.package_prices = res['data']['package_prices_data'];
        this.sample_videos = res['data']['sample_videos'];
        if (this.sample_videos.length > 0) {
          for (var i = 0; i < this.sample_videos.length; i++) {
            if (this.sample_videos[i]['source_type'] == "YOUTUBE") {
              let embed_link = this.sample_videos[i]['video_source'].replace("/watch?v=", "/embed/");
              this.sample_videos[i]['embed_link'] = this.sanitizer.bypassSecurityTrustResourceUrl(embed_link);
            }
          }
        }
        this.faqs = res['data']['faqs'];
        this.testimonials = res['data']['testimonials'];
        this.addons_arr = res['data']['addons_arr'];
        this.package_avg_rating = res['data']['package_avg_rating'];
        this.admin_role_ids = res['data']['avoid_roles'];
        //Get the topics if package courses not empty
        this.dataSource.data = res['data']['topics'];
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
        this.router.navigateByUrl('/pricing-and-packages');
      }
    });
  }

  public localPrice(prices) {
    if (!prices.length) {
      return "No Price!";
    }
    this.user = this.http.getUser();
    let user_country_id = 1;
    if (this.user) {
      for (var i = 0; i < prices.length; i++) {
        if (prices[i]['currency_id'] == user_country_id) {
          let symbol = prices[i]['currency_symbol'];
          let amount = prices[i]['price_amount'];
          return '<span class="rpe_sym">' + symbol + '</span>' + amount;
        }
      }
      let symbol = prices[0]['currency_symbol'];
      let amount = prices[0]['price_amount'];
      return '<span class="rpe_sym">' + symbol + '</span>' + amount;
    } else {
      let symbol = prices[0]['currency_symbol'];
      let amount = prices[0]['price_amount'];
      return '<span class="rpe_sym">' + symbol + '</span>' + amount;
    }
  }

  public youtubeIframe(youtube_link) {
    let embed_link = youtube_link.replace("/watch?v=", "/embed/");
    console.log(embed_link)
    return this.sanitizer.bypassSecurityTrustResourceUrl(embed_link);
  }

  public getPackageTopicsHierarchy() {
    let data = { url: 'get-package-topics', package_id: this.package_id };
    this.http.nonAuthenticatedPost(data).subscribe((res) => {
      if (res['error'] == false) {
        //console.log(res);
        this.dataSource.data = res['data'];
      }
    });
  }

  public setRating(rating) {
    this.rating = rating;
    //console.log(this.rating);
  }

  public addReview() {
    this.review_error = false;
    if (this.user_id == 0) {
      this.toster.error("Please Login!", 'Error', { closeButton: true });
      return;
    }


    if (this.rating < 0.5) {
      this.toster.error("Please rate between 1 to 5", 'Error', { closeButton: true });
      return;
    }

    if (this.review == '') {
      this.review_error = true;
      //this.toster.error("Write your review!", 'Error', { closeButton: true });
      return;
    }

    let data = { url: 'add-review-rating', package_id: this.package_id, rating: this.rating, review: this.review, user_id: this.user_id };
    this.http.nonAuthenticatedPost(data).subscribe((res) => {
      if (res['error'] == false) {
        //console.log(res);
        this.toster.success("Thanks for your feedback!", 'Success', { closeButton: true });
        this.rating = 0;
        this.review = '';
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });

  }

  public addToCart(product_id) {
    if (this.user_id == '') {
      this.router.navigateByUrl('/login');
      return;
    }
    //Prepare post data
    let cart_data = {
      product_id: product_id,
      user_id: this.user_id,
      product_type_id: 1, //Package
    }
    let param = { url: 'add-to-cart', cart_data: cart_data };
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

  public appendChilds(node) {
    if (node.has_children && !node.children) {
      let data = { url: 'get-package-topics', pk_ids: node.has_children };
      this.http.nonAuthenticatedPost(data).subscribe((res) => {
        if (res['error'] == false) {
          node.children = res['data'];
          let data = this.dataSource.data
          this.dataSource.data = [];
          this.dataSource.data = data;
        }
      });
    }
  }

}
