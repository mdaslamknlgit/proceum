import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss'],
})
export class LevelComponent implements OnInit {
  public levels = [];
  public search = '';
  public is_loaded = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: CommonService
  ) {}

  ngOnInit(): void {
    this.getCurriculums();
  }
  getCurriculums() {
      this.is_loaded = false;
    let param = {
      url: 'curriculum-list',
      search: this.search,
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
