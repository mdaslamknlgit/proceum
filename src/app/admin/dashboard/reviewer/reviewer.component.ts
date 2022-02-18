import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-reviewer',
  templateUrl: './reviewer.component.html',
  styleUrls: ['./reviewer.component.scss']
})
export class ReviewerComponent implements OnInit {
  user: any;

  constructor(private http: CommonService,) { }

  ngOnInit(): void {
    this.user = this.http.getUser();
  }

}
