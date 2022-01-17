import { Component, Input, OnInit, OnChanges} from '@angular/core';
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
  public result_count;
  public timer;
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
      let param = { url: 'search?key='+this.key};
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
          let keys = Object.keys(res['data']);
          this.result_count = keys.length;
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
          let keys = Object.keys(res['data']);
          this.result_count = keys.length;
        });
      }
    },1000);  
  }
  navigateTo(url){
    this.router.navigateByUrl("index/curriculum/"+url);
  }
  
}
