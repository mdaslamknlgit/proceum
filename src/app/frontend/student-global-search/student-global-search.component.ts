import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-global-search',
  templateUrl: './student-global-search.component.html',
  styleUrls: ['./student-global-search.component.scss']
})
export class StudentGlobalSearchComponent implements OnInit {
  public search_string = '';
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param=>{
      this.search_string = param.search_string;
    })
  }

}
