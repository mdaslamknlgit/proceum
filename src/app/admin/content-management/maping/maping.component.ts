import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

const ELEMENT_DATA = [
  {
    sno: 1,
    Volume: 'UG MED VOL -1',
    Subject: 'Human anatomy',
    Chapter: 'N/A',
    Topic: 'Anatomical terminology',
    SubTopic: 'Demonstrate Positions & movements in human body',
    Actions: 'test',
  },
  {
    sno: 1,
    Volume: 'UG MED VOL -1',
    Subject: 'Human anatomy',
    Chapter: 'N/A',
    Topic: 'Anatomical terminology',
    SubTopic: 'Demonstrate Positions & movements in human body',
    Actions: 'test',
  },
  {
    sno: 1,
    Volume: 'UG MED VOL -1',
    Subject: 'Human anatomy',
    Chapter: 'N/A',
    Topic: 'Anatomical terminology',
    SubTopic: 'Demonstrate Positions & movements in human body',
    Actions: 'test',
  },
  {
    sno: 1,
    Volume: 'UG MED VOL -1',
    Subject: 'Human anatomy',
    Chapter: 'N/A',
    Topic: 'Anatomical terminology',
    SubTopic: 'Demonstrate Positions & movements in human body',
    Actions: 'test',
  },
  {
    sno: 1,
    Volume: 'UG MED VOL -1',
    Subject: 'Human anatomy',
    Chapter: 'N/A',
    Topic: 'Anatomical terminology',
    SubTopic: 'Demonstrate Positions & movements in human body',
    Actions: 'test',
  },
];
@Component({
  selector: 'app-maping',
  templateUrl: './maping.component.html',
  styleUrls: ['./maping.component.scss'],
})
export class MapingComponent implements OnInit {
  displayedColumns: string[] = [
    's_no',
    'Volume',
    'Subject',
    'Chapter',
    'Topic',
    'SubTopic',
    'Actions',
  ];
  stepsDisplayedColumns: string[] = [];

  dataSource = new MatTableDataSource();
  stepsDataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  modal_popup = false;
  page: number = 0;
  public curriculum_list = [];
  public curriculum_labels = [];
  public curriculum_id = 1;
  public level_options = [];
  public selected_level = [];
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
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.level_options = [];
        this.level_options[1] = data['level_1'];
      }
    });
  }
  applyFilters(level_id) {
    let param = {
      url: 'content-map-list',
      offset: this.page,
      limit: this.pageSize,
      curriculum_id: this.curriculum_id,
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
          this.level_options = [];
          this.level_options[1] = data['level_1'];
        }
        this.totalSize = res['total_records'];
      }
    });
  }
  ucFirst(string) {
    return this.http.ucFirst(string);
  }
  openModal() {
    this.modal_popup = true;
  }
  closeModal() {
    this.modal_popup = false;
  }
}
