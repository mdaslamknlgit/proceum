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
    reason1:any="";
    feedback:any={reason:""};
    isUnsubscribe:boolean=false;

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.email=params.email;
      });
    }

    onSubmit() {
      this.feedback.reason=this.feedback.reason.trim();
        if(this.feedback.reason){  
          let params = {
            "url": 'unsubscribe-newsletter',
            "email_address": this.email,
            "status_reason": this.feedback.reason
          };
          
          this.http.post(params).subscribe((res: Response) => {
            if (res.error) {
              this.toastr.error(res.message, 'Error');
            } else {
              this.toastr.success(res.message, 'Success');
              this.feedback.reason="";
              this.textMessage="";
              this.isUnsubscribe=true;
            }
          });
        }else{
          this.feedback.reason=this.feedback.reason.trim();
        }
      }
}

export interface Response {
	error: boolean;
	message: string;
	errors?: any;
  }