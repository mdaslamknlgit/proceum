import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.scss']
})
export class StaticPagesComponent implements OnInit {
id:number;
pageContent:any=[];
  constructor(private route: ActivatedRoute,private http: AuthService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.getStaticPageContent();
  }

  getStaticPageContent(){
    let params = {
      "url": 'page-content',
      'pk_id':this.id
    };
   // console.log(params);
    this.http.post(params).subscribe((res) => {
      console.log(res['content']);
      this.pageContent=res['content'];
    });
  }

}
