import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maping',
  templateUrl: './maping.component.html',
  styleUrls: ['./maping.component.scss'],
})
export class MapingComponent implements OnInit {
  displayedColumns: string[] = [
    's_no',
    'title',
    'created_by',
    'created_date',
    'actions',
  ];
  stepsDisplayedColumns: string[] = [];

  dataSource = new MatTableDataSource();
  stepsDataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: false }) content_paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) content_sort: MatSort;
  public page: number = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public content_page: number = 0;
  public content_pageSize = environment.page_size;
  public content_totalSize = 0;
  public content_sort_by: any;
  public content_search_box = '';
  modal_popup = false;

  public curriculum_list = [];
  public curriculum_labels = [];
  public curriculum_id = 1;
  public level_options = [];
  public selected_level = [];
  public link_to_string = '';
  public current_level_id = 0;
  public slected_content_ids = [];
  public topic_id = 0;
  constructor(private http: CommonService, private toster: ToastrService) {}

  ngOnInit(): void {
    let param = {
      url: 'content-map-list',
      offset: this.page,
      limit: this.pageSize,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.stepsDataSource = new MatTableDataSource(data['steps']);
        this.curriculum_id = data['curricculum_id'];
        this.curriculum_list = data['curriculums'];
        this.curriculum_labels = data['curriculum_labels'];
        this.stepsDisplayedColumns = ['s_no'];
        this.curriculum_labels.forEach((label) => {
          this.stepsDisplayedColumns.push(label['display_label']);
        });
        this.stepsDisplayedColumns.push('actions');
        this.totalSize = res['total_records'];
        this.stepsDataSource.paginator = this.paginator;
        this.stepsDataSource.sort = this.sort;
        this.selected_level = [];
        this.level_options = [];
        this.level_options[1] = data['level_1'];
      }
    });
  }
  applyFilters(level_id) {
    this.current_level_id = level_id;
    let param = {
      url: 'content-map-list',
      offset: this.page,
      limit: this.pageSize,
      curriculum_id: this.curriculum_id,
      step_id: this.selected_level[level_id],
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.stepsDataSource = new MatTableDataSource(data['steps']);
        if (level_id == 0) {
          this.curriculum_labels = data['curriculum_labels'];
          this.stepsDisplayedColumns = ['s_no'];
          this.curriculum_labels.forEach((label) => {
            this.stepsDisplayedColumns.push(label['display_label']);
          });
          this.stepsDisplayedColumns.push('actions');
          this.selected_level = [];
          this.level_options = [];
          this.level_options[1] = data['level_1'];
        }
        this.totalSize = res['total_records'];
      }
    });
  }
  getServerData(event) {
    this.page = event.pageSize * event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters(this.current_level_id);
  }
  sortData(event) {
    this.sort_by = event;
    if (this.sort_by.direction != '') this.applyFilters(this.current_level_id);
  }
  ucFirst(string) {
    return this.http.ucFirst(string);
  }
  getLevels(level_id) {
    let param = {
      url: 'get-levels-by-level',
      step_id: this.selected_level[level_id],
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.level_options[level_id + 1] = data['steps'];
        this.level_options.forEach((opt, index) => {
          if (index > level_id + 1) this.level_options[index] = [];
        });
      }
    });
  }
  openModal(element) {
    let string = element['concat_names'];
    let string_to_arr = string.split('|');
    string_to_arr = string_to_arr.reverse();
    this.link_to_string = string_to_arr.join(' / ');
    let linked_list = element['linked_list'];
    this.topic_id = element['pk_id'];
    if (linked_list.length > 0) {
      linked_list.forEach((res) => {
        this.slected_content_ids[res['content_id']] = {
          content_id: res['content_id'],
          is_selected: true,
          source_id: this.topic_id,
        };
      });
    }
    this.modal_popup = true;

    this.getContentList();
  }
  getContentList() {
    let param = {
      url: 'content-list',
      offset: this.content_page,
      limit: this.content_pageSize,
      order_by: this.content_sort_by,
      search: this.content_search_box,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['content_list']);
        this.dataSource.paginator = this.content_paginator;
        this.content_totalSize = res['total_records'];
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }
  contentGetServerData(event) {
    this.content_page = event.pageSize * event.pageIndex;
    this.content_pageSize = event.pageSize;
    let param = {
      url: 'content-list',
      offset: this.content_page,
      limit: this.content_pageSize,
      order_by: this.content_sort_by,
      search: this.content_search_box,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['content_list']);
        //this.dataSource.paginator = this.paginator;
        this.content_totalSize = res['total_records'];
      }
    });
  }
  doFilter() {
    let param = {
      url: 'content-list',
      offset: this.content_page,
      limit: this.content_pageSize,
      order_by: this.content_sort_by,
      search: this.content_search_box,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['content_list']);
        this.content_totalSize = res['total_records'];
      } else {
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }
  selectContent(event, id) {
    this.slected_content_ids[id] = {
      content_id: id,
      is_selected: event.checked,
      source_id: this.topic_id,
    };
  }
  linkContent() {
    let filtered = this.slected_content_ids.filter(function (el) {
      return el != null;
    });
    let param = {
      url: 'link-content',
      content: filtered,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.closeModal();
        this.applyFilters(this.current_level_id);
      } else {
        this.toster.error(res['message'], 'Error', {
          closeButton: true,
        });
      }
    });
  }
  closeModal() {
    this.modal_popup = false;
    this.topic_id = 0;
    this.slected_content_ids = [];
  }
}
