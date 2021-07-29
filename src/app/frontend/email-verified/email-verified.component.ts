import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute  } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-email-verified',
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.scss']
})
export class EmailVerifiedComponent implements OnInit {
  hash_token:any;
  is_show:boolean=false;
  is_verrified=0;
  constructor(private http: AuthService,private router: Router,private activatedRoute: ActivatedRoute) {
    this.hash_token = this.activatedRoute.snapshot.paramMap.get('hash');
   }

  ngOnInit(): void {
    let params = {url: 'verificationemail/'+this.hash_token}
    this.http.verify(params).subscribe((res: Response) => {
      console.log(res);
      if (res.error) {
        this.is_show=false;
        this.is_verrified=1;
      }else{
        this.is_show=true;
      }
    });
    console.log("shasssha");
  }

}
export interface Response {
  error: boolean;
  message: string;

}
