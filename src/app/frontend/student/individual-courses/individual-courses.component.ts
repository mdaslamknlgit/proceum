import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-individual-courses',
  templateUrl: './individual-courses.component.html',
  styleUrls: ['./individual-courses.component.scss']
})
export class IndividualCoursesComponent implements OnInit {
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
  public tab = 'all';
  public previousUrl = '';
  public rating = [];
  public is_loaded = false;
  public q_is_loaded = false;
  public q_levels = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: CommonService,
    private route: Router,
    private toster: ToastrService,
    private location: Location, 
    public translate: TranslateService
  ) {
    this.translate.setDefaultLang(this.http.lang);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      //this.curriculum_id = param.curriculum_id;
      this.level_id = param.level_id ? param.level_id : 0;
      this.level_parent_id = param.level_parent_id ? param.level_parent_id : 0;
      this.getLevels();
      this.getQbanks();
    });
  }
  setTitle(val) {
    //this.title = val;
    return val;
  }
  getLevels() {
      this.is_loaded = false;
    this.offset = 0;
    let param = {
      url: 'individual-list',
      //curriculum_id: this.curriculum_id,
      //level_id: this.level_id,
      //level_parent_id: this.level_parent_id,
      search: this.search,
      offset: this.offset,
      limit: this.itemsPerPage,
      tab: this.tab,
    };
    this.http.post(param).subscribe((res) => {
        this.is_loaded = true;
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
            //this.title = this.curriculum['curriculumn_name'];
            }
        } else {
        this.breadcome = res['breadcome'];
        this.levels = [];
        this.total_items = 0;
        /*if (res['check_data'] == 0) {
            let data = res['data'];
            this.curriculum = data['curriculum'];
            if(this.curriculum['usage_type'] == 2){
                let url = '/student/qbank/' + this.curriculum_id + '/' + this.level_id + '/' + this.level_parent_id;
                this.route.navigateByUrl(url);
            }
            else{
                if (res['check_content'] == 0) {
                    this.toster.error('No content Found', 'Error', {closeButton: true});
                    this.location.back();
                } else {
                    let url = '/student/curriculum/details/' + this.curriculum_id + '/' + this.level_id + '/' + this.level_parent_id;
                    this.route.navigateByUrl(url);
                }
            }
        }*/
      }
    });
  }
  getQbanks() {
    this.q_is_loaded = false;
  let param = {
    url: 'qbank-list',
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
  setHoverRating(value, level_id){
    this.rating[level_id] = value;
  }
  resetHoverRating(value, level_id){
    this.rating[level_id] = value;
  }
  doFilter() {
    this.getLevels();
  }
  loadMore() {
    this.offset = this.offset + this.itemsPerPage;
    let param = {
      url: 'individual-list',
      //curriculum_id: this.curriculum_id,
      //level_id: this.level_id,
      //level_parent_id: this.level_parent_id,
      search: this.search,
      offset: this.offset,
      limit: this.itemsPerPage,
      tab: this.tab,
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
  switchTab(event) {
    if (event.index == 0) {
      this.tab = 'all';
      this.getLevels();
    }
    if (event.index == 1) {
      this.tab = 'bookmark';
      this.getLevels();
    }
    if (event.index == 2) {
      this.tab = 'fav';
      this.getLevels();
    }
  }
  manageStatistics(type, id, i, rating=0) {
      this.rating[id]=rating;
    let param = {
      url: 'manage-level-statistics',
      type: type,
      source_id: id,
      rating: this.rating[id]
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if (type == 'fav') {
          this.levels[i]['is_fav'] = this.levels[i]['is_fav'] == 1 ? 0 : 1;
          this.total_items = this.total_items-1;
        }
        if (type == 'bookmark') {
          this.levels[i]['is_bookmark'] =
            this.levels[i]['is_bookmark'] == 1 ? 0 : 1;
            this.total_items = this.total_items-1;
        }
        if (type == 'rating') {
            this.levels[i]['rating'] =this.rating[id];
          }
          if(this.tab != 'all' && type != 'rating'){
            this.levels.splice(i, 1);
          }
        //this.toster.success(res['message'], 'Info', { closeButton: true });
      } else {
        this.translate.get('student.my_courses.something_went_wrong').subscribe((data)=> {
          this.translate.get('error_text').subscribe((error_text)=> {
            this.toster.info(data, error_text, {
              closeButton: true,
            });
          });
        });       
      }
    });
  }
}
