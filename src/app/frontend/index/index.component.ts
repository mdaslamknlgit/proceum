import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  constructor(private http: AuthService,private toastr: ToastrService) {}
  email_address:string;
  errEmailMsg:string="";
  emailRegexp = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");
  public isOpen = false;
  ngOnInit(): void {}
  scrollToTop() {
    // window.scroll(0, 0);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  menuToggle(){
    this.isOpen = !this.isOpen;
}

  isSticky: boolean = false;
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 150;
  }
  newsletterSubscribe() {
    //console.log(this.email_address);return false;
    if(this.email_address == undefined){
      this.errEmailMsg="Email is Required";
      return false;
    }
    let verifyEmail = this.emailRegexp.test(this.email_address.trim());
    if(verifyEmail){
      this.errEmailMsg="";
      let params = {
        "url": 'subscribe-newsletter',
        "email_address": this.email_address
      };
      this.http.newsletterSubscribe(params).subscribe((res: Response) => {
        console.log(res);
        if (res.error) {
          this.toastr.error(res.message, 'Error', { closeButton: true });
          this.errEmailMsg=res.message;
        } else {
          this.toastr.success(res.message, 'Error', { closeButton: true });
          this.email_address="";
          //this.errEmailMsg=res.message;
          //setTimeout(() => { this.errEmailMsg="";  }, 5000);
        }
      });
    }else{
      this.errEmailMsg="Please enter valid email";
    }
  }
}

export interface Response {
	error: boolean;
	message: string;
	errors?: any;
  }
