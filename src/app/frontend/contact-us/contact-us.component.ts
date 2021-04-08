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
  address_check: boolean=false;
  public desMessage: string = "Address is required";
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
    this.contact.query=this.contact.query.trim();
    if(this.contact.query ==''){
      this.desMessage="Address is required";
      this.address_check=true;
      return;
    }
    let params={
      'url':'contact-us',
      'name':this.contact.name.trim(),
      'email_address':this.contact.email.trim(),
      'mobile_number':this.contact.mobile_number.trim(),
      'query':this.contact.query.trim(),
    }
// console.log(params);
    this.http.post(params).subscribe((res: Response) => {
      //console.log(res);
      if (res.error) {
        this.toastr.error(res.message, 'Error', { closeButton: true });
      } else {
        this.toastr.success(res.message, 'Success', { closeButton: true });
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