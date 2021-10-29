import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-qbank',
  templateUrl: './qbank.component.html',
  styleUrls: ['./qbank.component.scss']
})
export class QbankComponent implements OnInit {
    public curriculum_id = 0;
    public level_id = 0;
    public level_parent_id = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: CommonService,
    private toster: ToastrService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
        this.curriculum_id = param.curriculum_id == undefined?0:param.curriculum_id;
        this.level_id = param.level_id != undefined ? param.level_id : 0;
        this.level_parent_id = param.level_parent_id != undefined ? param.level_parent_id : 0;
      });
  }

}
