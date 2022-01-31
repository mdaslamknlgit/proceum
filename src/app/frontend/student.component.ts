import { Component, Input, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'student-root',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})

export class StudentComponent {
  @Input() key = '';
  public user;
  public search_key=false;
  public current_url="";
  public hasTapBarLoaded:Boolean =false;
  constructor(private router: Router,private http: CommonService,) {}
  ngOnInit() {
    this.user = this.http.getUser();
    this.current_url=this.router.url;
  }
  ngOnChanges(){
    if(this.key){
      this.search_key = true;
    }
  }
}
