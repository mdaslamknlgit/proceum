import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-level_list',
  templateUrl: './level_list.component.html',
  styleUrls: ['./level_list.component.scss'],
})
export class Level_listComponent implements OnInit {
  public title = '';
  public curriculum = [];
  public curriculum_id = 0;
  public level_id = 0;
  public level_parent_id = 0;
  public levels = [];
  public search = '';
  public breadcome = [];
  public itemsPerPage = 30;
  public offset = 0;
  public total_items = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: CommonService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.curriculum_id = param.curriculum_id;
      this.level_id = param.level_id ? param.level_id : 0;
      this.level_parent_id = param.level_parent_id ? param.level_parent_id : 0;
      this.getLevels();
    });
  }
  setTitle(val) {
    //this.title = val;
    return val;
  }
  getLevels() {
    this.offset = 0;
    let param = {
      url: 'curriculum-levels',
      curriculum_id: this.curriculum_id,
      level_id: this.level_id,
      level_parent_id: this.level_parent_id,
      search: this.search,
      offset: this.offset,
      limit: this.itemsPerPage,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.curriculum = data['curriculum'];
        this.levels = data['levels'];
        this.total_items = res['total_records'];
        this.breadcome = res['breadcome'];
        if (this.breadcome.length > 0) {
          this.breadcome.forEach((val) => {
            this.title = val['name'];
          });
        } else {
          this.title = this.curriculum['curriculumn_name'];
        }
      } else {
        this.levels = [];
        let url =
          '/student/curriculum/details/' +
          this.curriculum_id +
          '/' +
          this.level_id +
          '/' +
          this.level_parent_id;
        this.route.navigateByUrl(url);
      }
    });
  }
  doFilter() {
    this.getLevels();
  }
  loadMore() {
    this.offset = this.offset + this.itemsPerPage;
    let param = {
      url: 'curriculum-levels',
      curriculum_id: this.curriculum_id,
      level_id: this.level_id,
      level_parent_id: this.level_parent_id,
      search: this.search,
      offset: this.offset,
      limit: this.itemsPerPage,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.total_items = res['total_records'];
        if (data['levels'] != null && data['levels'].length > 0) {
          data['levels'].forEach((element) => {
            this.levels.push(element);
          });
        }
      }
    });
  }
}
