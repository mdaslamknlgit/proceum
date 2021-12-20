import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-assessment-result',
  templateUrl: './assessment-result.component.html',
  styleUrls: ['./assessment-result.component.scss']
})
export class AssessmentResultComponent implements OnInit {

  constructor(private http: CommonService, public translate: TranslateService) {
    this.translate.setDefaultLang(this.http.lang);
  }
  ngOnInit(): void {
  }

}
