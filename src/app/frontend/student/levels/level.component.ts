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
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: CommonService
  ) {}

  ngOnInit(): void {
    this.getCurriculums();
  }
  getCurriculums() {
    let param = {
      url: 'curriculum-list',
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.levels = data['levels'];
      } else {
        this.levels = [];
      }
    });
  }
}
