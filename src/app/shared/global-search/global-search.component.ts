import { Component, Input, OnInit, OnChanges, HostListener } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {
  @Input() key = '';
  public search_result = [];
  public result_cond;
  public result_count = 0;
  public timer;
  public offset = 0;
  public limit = 50;
  public limit_cnt = 50;
  public synchronous = false;
  constructor(private http: CommonService,private router: Router,private authHttp: AuthService,) { }

  ngOnInit(): void {
    if (this.key)
    {
      this.globalsearch();
    }
  }
  ngOnChanges():void{
    if (this.key)
    {
      this.globalsearch();
    }
  }
  globalsearch(){
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let param = { url: 'search?key='+this.key,offset: this.offset,limit: this.limit};
      let user = this.http.getUser();
        if(user){
          this.http.post(param).subscribe((res) => {
          if(res['error'] == false) {
            this.search_result =  res['data'];
            this.result_cond = false;
          }else{
            this.search_result = res['data']; //[];
            this.result_cond = true;
          }
          // let keys = Object.keys(res['data']);
          this.result_count = res['total_count'];
          this.limit = this.limit + 50;
          this.synchronous = true;
        });
      }else{
        this.authHttp.post(param).subscribe((res) => {
          if(res['error'] == false) {
            this.search_result =  res['data'];
            this.result_cond = false;
            // this.search_result.sort();
          }else{
            this.search_result = res['data']; //[];
            this.result_cond = true;
          }
          // let keys = Object.keys(res['data']);
          this.result_count = res['total_count'];
          this.limit = this.limit + 50;
          this.synchronous = true;
        });
      }      
    },1000);
  }
  navigateTo(url){
    this.router.navigateByUrl("index/curriculum/"+url);
  }
  // @HostListener('window:scroll', [])
  // onScroll(): void {
  //   if (this.bottomReached() && (this.limit < this.result_count) && this.synchronous) {
  //     this.synchronous = false;
  //     this.globalsearch();
  //   }
  // }
  // bottomReached(): boolean {
  //   return window.innerHeight + window.scrollY >= document.body.offsetHeight;
  // }
}
