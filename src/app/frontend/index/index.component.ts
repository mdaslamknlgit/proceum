import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

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
  ) {}
  email_address: string;
  errEmailMsg: string = '';
  emailRegexp = new RegExp('/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/');
  menus: any;
  subMenus: any = [];
  errClass: any;
  public isOpen = false;
  user: any;
  ngOnInit(): void {
    this.getMenus();
    this.user = this.service.getUser();
    console.log(this.user);
  }
  navigateTo() {
    if (this.user['role'] == '1') {
      this.router.navigateByUrl('/admin/dashboard');
    } else {
      this.router.navigateByUrl('/student/dashboard');
    }
  }
  scrollToTop() {
    // window.scroll(0, 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    //console.log(this.email_address);return false;
    if (this.email_address == undefined) {
      //this.errEmailMsg="Email is Required";
      this.errClass = 'input-border-color';
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
      //this.errEmailMsg="Please enter valid email";
      this.errClass = 'input-border-color';
    }
  }
  getMenus() {
    let params = { url: 'menu-submenu' };
    this.http.post(params).subscribe((res) => {
      this.menus = res['menus'];
     // this.pages = res['pages'];
    });
  }

  changeSubmenu(menu_id) {
      let params = {
      "url": "sub-menu",
      'parent_id':menu_id
       };
    this.http.post(params).subscribe((res) => {
      this.subMenus = res['pages'];
    });
    // this.newPages = this.pages.filter(function (page) {
    //   return page.parent_id == key;
    // });
  }
}

export interface Response {
  error: boolean;
  message: string;
  errors?: any;
}
