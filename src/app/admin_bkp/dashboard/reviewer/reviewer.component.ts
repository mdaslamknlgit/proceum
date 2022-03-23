import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-reviewer',
  templateUrl: './reviewer.component.html',
  styleUrls: ['./reviewer.component.scss']
})
export class ReviewerComponent implements OnInit {
    dashboard = {pending:0, created:0, review_coments:0, draft:0 };
    user: any;
    constructor(private http: CommonService,) { }
    ngOnInit(): void {
        this.user = this.http.getUser();
        this.getData();
    }
    getData(){
        let param = {
            url: 'review/get-reviwer-dashboard'
          };
          this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.dashboard.created = res['data']['content_created'];
                this.dashboard.pending = res['data']['pending_reviews'];
                this.dashboard.review_coments = res['data']['content_comments'];
                this.dashboard.draft = res['data']['drafts'];
            }
          });
    }
}
