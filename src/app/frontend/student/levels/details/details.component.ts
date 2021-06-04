import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  public title = '';
  public curriculum = [];
  public curriculum_id = 0;
  public level_id = 0;
  public level_parent_id = 0;
  public breadcome = [];
  public content_id = 0;
  public content_list = [];
  public content = [];
  public active_div = 1;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: CommonService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.curriculum_id = param.curriculum_id;
      this.level_id = param.level_id ? param.level_id : 0;
      this.level_parent_id = param.level_parent_id ? param.level_parent_id : 0;
      this.content_id = param.content_id ? param.content_id : 0;
      this.getLevelDetails();
    });
  }
  setTitle(val) {
    return val;
  }
  getLevelDetails() {
    let param = {
      url: 'curriculum-level-details',
      curriculum_id: this.curriculum_id,
      level_id: this.level_id,
      level_parent_id: this.level_parent_id,
      content_id: this.content_id,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.curriculum = data['curriculum'];
        this.breadcome = res['breadcome'];
        this.content_list = data['content_list'];
        this.content = data['content'];
        this.content_id = data['selected_content_id'];
        if (this.breadcome.length > 0) {
          this.breadcome.forEach((val) => {
            this.title = val['name'];
          });
        }
      } else {
        this.breadcome = res['data']['breadcome'];
      }
    });
  }
  showDiv(div) {
    this.active_div = div;
  }
}
