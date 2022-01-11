import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-student-global-search',
  templateUrl: './student-global-search.component.html',
  styleUrls: ['./student-global-search.component.scss']
})
export class StudentGlobalSearchComponent implements OnInit {
  public search_string = '';
  constructor(private activatedRoute: ActivatedRoute, private http: CommonService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param=>{
      this.search_string = param.search_string;
      this.http.search_string = param.search_string;
    })
  }
  ngOnDestroy(){
    this.http.search_string = '';
  }

}
