import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { PageEvent } from '@angular/material/paginator';

 
@Component({
  selector: 'app-teacher-material',
  templateUrl: './teacher-material.component.html',
  styleUrls: ['./teacher-material.component.scss']
})
export class TeacherMaterialComponent implements OnInit {
  public materials = [];
  hrefZIP: string;
  public search = '';
  public curriculum_list = [];
  public curriculum_id = 0;
  public curriculum_labels = [];
  public selected_level = [];
  public level_options = [];
  public all_level_options = [];
  public selected_level_id = 0;
  public total_records = 0;
  public offset = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: CommonService,
    private toastr: ToastrService
  ) {
    this.hrefZIP = environment.apiUrl + 'download-attachments/';
  }

  ngOnInit(): void {
    let param = {
      url: 'content-map-list',
      offset: 0,
      limit: 0,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data']?res['data']:[];
        this.curriculum_list = data['curriculums'];
      }
    });
    this.getMaterials();
  }

  getMaterials() {
    let params={url: 'get-all-materials',"offset": this.offset, "limit": this.pageSize,source:'student',search: this.search,selected_level_id: this.selected_level_id,curriculum_id: this.curriculum_id};
    this.http.post(params).subscribe((res: Response) => {
      if (res['error'] == false) {
        this.materials = res['data']['materials'];
        this.total_records = res['data']['total_records'];
      } else {
        this.materials = [];
      }
    });
  }

  getServerData(event) {
    this.offset = event.pageSize * event.pageIndex;
    this.pageSize = event.pageSize;
    this.getMaterials();
  }  

  doFilter() {
    this.getMaterials();
  }

  downlodAttachments(id){
    window.location.href = this.hrefZIP + id;
  }

  applyCourseFilters(level_id) {
    this.selected_level_id = 0;
    this.getMaterials();
    let param = {
      url: 'content-map-list',
      offset: 0,
      limit: 0,
      curriculum_id: this.curriculum_id,
      step_id: this.selected_level[level_id],
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        if (level_id == 0) {
          //console.log(data['curriculum_labels']);
          this.curriculum_labels = data['curriculum_labels'];
          this.selected_level = [];
          this.level_options = [];
          this.all_level_options = [];
          this.level_options[1] = data['level_1'];
          this.all_level_options[1] = data['level_1'];
        }
      }
    });
  }

  getLevels(level_id) { 
    this.selected_level_id = this.selected_level[level_id];
    this.getMaterials();  
    let param = {
      url: 'get-levels-by-level',
      step_id: this.selected_level[level_id],
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.level_options[level_id + 1] = data['steps'];
        this.all_level_options[level_id + 1] = data['steps'];
        this.level_options.forEach((opt, index) => {
          if (index > level_id + 1) this.level_options[index] = [];
        });
        //aded with out test here
        this.selected_level.forEach((opt, index) => {
          if (index > level_id) this.selected_level[index] = 0;
        });         
      }
    });
  }

  searchLevelByName(search,level){
    let options = this.all_level_options[level];
    this.level_options[level] = options.filter(
      item => item.level_name.toLowerCase().includes(search.toLowerCase())
    );
  }

  ucFirst(string) {
    return this.http.ucFirst(string);
  }

}
