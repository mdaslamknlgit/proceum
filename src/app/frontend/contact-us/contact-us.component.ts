import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contact: ContactUs = { name:'', email: '', query: '', mobile_number: ''};
  public emailMessage: string = '';
  public desMessage: string = '';
  public nameMessage: string = '';
  public email_check: boolean = false;
  public query_check: boolean = false;
  public name_check: boolean = false;
  public mobile_check: boolean = false;
  constructor(
    private http: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }
  submitContactUs(){

    let params={
      'url':'contact-us',
      'name':this.contact.name,
      'email_address':this.contact.email,
      'mobile_number':this.contact.mobile_number,
      'query':this.contact.query,
    }
console.log(params);
    this.http.post(params).subscribe((res: Response) => {
      console.log(res);
      if (res.error) {
        this.toastr.error(res.message, 'Error', { closeButton: true });
      } else {
        this.toastr.success(res.message, 'Error', { closeButton: true });
       (<HTMLFormElement>document.getElementById('contact_form')).reset();
       
      }
    });
  }
}

export interface ContactUs {
  name:string;
  email: string;
  mobile_number:any;
  query: any;
}

export interface Response {
  error: boolean;
  token: any;
  message: string;
  role?: any;
  errors?: any;
}