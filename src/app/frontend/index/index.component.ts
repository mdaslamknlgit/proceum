import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  constructor(
    private http: AuthService,
    private toastr: ToastrService,
    private service: CommonService,
    private router: Router
  ) { }
  email_address: string;
  errEmailMsg: string = '';
  menus: any;
  subMenus: any = [];
  errClass: any;
  public isOpen = false;
  public fsCls = false;
  user: any;
  sub_domain_data: any = [];
  load_powered_by: boolean = false;
  hasLoaded: boolean = false;

  public result;
  ngOnInit(): void {
    this.user = this.service.getUser();
    if(localStorage.getItem('p_id') && !this.user){
      this.router.navigateByUrl('/login');
    }
    let role = Number(this.user['role']);
    if(Object.values(environment.PARTNER_ADMIN_SPECIFIC_ROLES).includes(role)) {
      this.router.navigateByUrl('/admin/dashboard');
    }else if(role == environment.ALL_ROLES.STUDENT && localStorage.getItem('p_id')){
      this.router.navigateByUrl('/student/dashboard');
    }else if(role == environment.ALL_ROLES.TEACHER && localStorage.getItem('p_id')){
      this.router.navigateByUrl('/teacher/dashboard');
    }
    this.getcoupons();
  }
  navigateTo() {
    if (this.user['role'] == '1') {
      this.router.navigateByUrl('/admin/dashboard');
    } else {
      this.router.navigateByUrl('/student/dashboard');
    }
  }


  menuToggle() {
    this.isOpen = !this.isOpen;
  }
  removeClass() {
    this.errClass = '';
  }

  isSticky: boolean = false;
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 150;
  }
  newsletterSubscribe() {
    if (this.email_address == undefined) {
      this.errClass = 'input-border-color';
      this.errEmailMsg = "Email is required";
      setTimeout(() => {
        this.errEmailMsg = "";
      }, 5000);
      return false;
    }
    let verifyEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      this.email_address.trim()
    );
    if (verifyEmail) {
      this.errEmailMsg = '';
      this.errClass = '';
      let params = {
        url: 'subscribe-newsletter',
        email_address: this.email_address,
      };
      this.http.post(params).subscribe((res: Response) => {
        if (res.error) {
          this.toastr.error(res.message, 'Error', { closeButton: true });
          this.errEmailMsg = res.message;
        } else {
          this.toastr.success(res.message, 'Success', { closeButton: true });
          this.email_address = '';
        }
      });
    } else {
      this.errEmailMsg = "Please enter valid email";
      setTimeout(() => {
        this.errEmailMsg = "";
      }, 5000);
      this.errClass = 'input-border-color';
    }
  }


  getcoupons() {
    let param = { url: 'get-latest-coupon' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.result = res['data'];
      }
    })
  }

  checkSubDomainAvailable(){
    if(localStorage.getItem('p_id') && !this.user){
      this.router.navigateByUrl('/login');
    }
    let role = Number(this.user['role']);
    if(Object.values(environment.PARTNER_ADMIN_SPECIFIC_ROLES).includes(role)) {
      this.router.navigateByUrl('/admin/dashboard');
    }else if(role == environment.ALL_ROLES.STUDENT && localStorage.getItem('p_id')){
      this.router.navigateByUrl('/student/dashboard');
    }else if(role == environment.ALL_ROLES.TEACHER && localStorage.getItem('p_id')){
      this.router.navigateByUrl('/teacher/dashboard');
    }
  }
}

export interface Response {
  error: boolean;
  message: string;
  errors?: any;
}
