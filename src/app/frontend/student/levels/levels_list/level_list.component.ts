import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-level_list',
  templateUrl: './level_list.component.html',
  styleUrls: ['./level_list.component.scss'],
})
export class Level_listComponent implements OnInit {
  public curriculum = [];
  public curriculum_id = 0;
  public level_id = 0;
  public level_parent_id = 0;
  public levels = [];
  public search = '';
  public breadcome = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: CommonService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.curriculum_id = param.curriculum_id;
      this.level_id = param.level_id ? param.level_id : 0;
      this.level_parent_id = param.level_parent_id ? param.level_parent_id : 0;
      this.getLevels();
    });
  }
  getLevels() {
    let param = {
      url: 'curriculum-levels',
      curriculum_id: this.curriculum_id,
      level_id: this.level_id,
      level_parent_id: this.level_parent_id,
      search: this.search,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.curriculum = data['curriculum'];
        this.levels = data['levels'];
        this.breadcome = res['breadcome'];
      } else {
        this.levels = [];
        this.breadcome = res['data']['breadcome'];
      }
    });
  }
  doFilter() {
    this.getLevels();
  }
}
