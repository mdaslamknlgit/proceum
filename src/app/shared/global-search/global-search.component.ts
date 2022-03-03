import { Component, Input, OnInit, OnChanges, HostListener} from '@angular/core';
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
  public limit = 15;
  public limit_cnt = 15;
  public p: number;
  constructor(private http: CommonService,private router: Router,private authHttp: AuthService,) { }
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {alert()
      // Your logic on beforeunload
  }
  ngOnInit(): void {
    if (this.key)
    {
      this.globalsearch(this.offset,this.limit);
    }
  }
  ngOnChanges():void{
    if (this.key)
    {
      this.offset = 0;
      this.limit = 15;
      this.globalsearch(this.offset,this.limit);
    }
  }
  globalsearch(off,lim){
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let param = { url: 'search?key='+this.key,offset: off,limit: lim};
      let user = this.http.getUser();
        if(user){
          this.http.post(param).subscribe((res) => {
          if(res['error'] == false) {
            this.search_result =  res['data'];
            this.result_cond = false;
          }else{
            this.search_result = res['data'];
            this.result_cond = true;
          }
          this.result_count = res['total_count'];
        });
      }else{
        this.authHttp.post(param).subscribe((res) => {
          if(res['error'] == false) {
            this.search_result =  res['data'];
            this.result_cond = false;
          }else{
            this.search_result = res['data'];
            this.result_cond = true;
          }
          this.result_count = res['total_count'];
        });
      }
    },1000);
  }
  navigateTo(url){
    this.router.navigateByUrl("index/curriculum/"+url);
  }
  pageChanged(event){
    this.offset = (event -1) * this.limit_cnt;
    this.limit = event * this.limit_cnt;
    this.p = event;
    this.globalsearch(this.offset,this.limit);
  }
}
