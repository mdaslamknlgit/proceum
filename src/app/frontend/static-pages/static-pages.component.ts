import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.scss']
})
export class StaticPagesComponent implements OnInit {
id:number;
pageContent:any=[];
pageName:string;
  constructor(private route: ActivatedRoute,private http: AuthService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(routeParams => {
      this.id=routeParams.id;
      this.getStaticPageContent();
    });    
  }
  html:any;
  getStaticPageContent(){
    console.log( this.id);
    let params = {
      "url": 'get-page-content',
      'pk_id':this.id
    };
    this.http.post(params).subscribe((res) => {
        this.pageContent=this.sanitizer.bypassSecurityTrustHtml(res['content']);
        this.pageName=res['page_name'];
    });
  }

}
