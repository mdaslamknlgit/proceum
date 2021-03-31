import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-unsubscribe-email',
  templateUrl: './unsubscribe-email.component.html',
  styleUrls: ['./unsubscribe-email.component.scss']
})
export class UnsubscribeEmailComponent implements OnInit {
  constructor( private http: AuthService,
    private route: ActivatedRoute,private toastr: ToastrService) { }

    email:string;
    excption_message:string="";
    textMessage:string="";
    feedback:any;
    isUnsubscribe:boolean=false;

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.email=params.email;
      });
    }

    onSubmit(data) {

      this.feedback=data.reason.trim();
        if(this.feedback){  
          let params = {
            "url": 'unsubscribe-newsletter',
            "email_address": this.email,
            "status_reason": this.feedback
          };
          console.log(params);
          this.http.unSubscribeNewsletter(params).subscribe((res: Response) => {
            let message = res.message;           
            if (res.error) {
              this.toastr.error(message, 'Error', { closeButton: true });
            } else {
              this.toastr.success(message, 'Error', { closeButton: true });
              data.reason="";
              this.textMessage="";
              this.isUnsubscribe=true;
            }
          });
        }else{
         this.excption_message="feedback is required";   
        }
      }
}

export interface Response {
	error: boolean;
	message: string;
	errors?: any;
  }