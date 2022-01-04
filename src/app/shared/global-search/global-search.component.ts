import { Component, Input, OnInit} from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';

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
  constructor(private http: CommonService,private router: Router,) { }

  ngOnInit(): void {
    if (this.key)
    {
      this.globalsearch();
    }
  }

  globalsearch(){
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let param = { url: 'search?key=' + this.key };
      this.http.get(param).subscribe((res) => {
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
    },1000);  
  }
  navigateTo(url){
    let user = this.http.getUser();
    if(user['role']== '2' || user['role']== '11' ){
      url = "/student/curriculums/"+url;
    }else{
      url = "/student/curriculums/"+url;
    }
    this.router.navigateByUrl(url);
  }
  
}
