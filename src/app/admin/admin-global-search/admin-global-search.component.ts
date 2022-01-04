import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-global-search',
  templateUrl: './admin-global-search.component.html',
  styleUrls: ['./admin-global-search.component.scss']
})
export class AdminGlobalSearchComponent implements OnInit {
  public search_string = '';
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param=>{
      this.search_string = param.search_string;
    })
  }

}
