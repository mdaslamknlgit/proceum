import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss'],
})
export class LevelComponent implements OnInit {
  public levels = [];
  public q_levels = [];
  public search = '';
  public is_loaded = false;
  public q_is_loaded = false;
  public user = [];
  constructor(private router: Router, private http: CommonService) {}

  ngOnInit(): void {
    this.user = this.http.getUser();
    if(parseInt(this.user['role']) == environment.ALL_ROLES.INDIVIDUAL){
        this.router.navigateByUrl("/student/purchased-courses");
    }
    else{
        this.getCurriculums();
        this.getQbanks();
    }
    
  }
  getCurriculums() {
      this.is_loaded = false;
    let param = {
      url: 'curriculum-list',
      search: this.search,
      type:1
    };
    this.http.post(param).subscribe((res) => {
        this.is_loaded = true;
      if (res['error'] == false) {
        let data = res['data'];
        this.levels = data['levels'];
      } else {
        this.levels = [];
      }
    });
  }
  getQbanks() {
    this.q_is_loaded = false;
  let param = {
    url: 'curriculum-list',
    search: this.search,
    type:2
  };
  this.http.post(param).subscribe((res) => {
      this.q_is_loaded = true;
    if (res['error'] == false) {
      let data = res['data'];
      this.q_levels = data['levels'];
    } else {
      this.q_levels = [];
    }
  });
}
  manageStatistics(type, id, i, rating=0) {
  let param = {
    url: 'manage-curriculum-statistics',
    type: type,
    source_id: id,
    rating: rating
  };
  this.http.post(param).subscribe((res) => {
    if (res['error'] == false) {
      if (type == 'rating') {
          this.levels[i]['rating'] =rating;
        }
        if (type == 'fav') {
            this.levels[i]['is_fav'] = this.levels[i]['is_fav'] == 1 ? 0 : 1;
        }
      //this.toster.success(res['message'], 'Info', { closeButton: true });
    } else {
     // this.toster.info('Something went wrong. Please try again.', 'Error', {
        //closeButton: true,
      //});
    }
  });
}
  doFilter() {
    this.getCurriculums();
  }
}
