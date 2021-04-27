import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-curriculam',
  templateUrl: './curriculam.component.html',
  styleUrls: ['./curriculam.component.scss'],
})
export class CurriculamComponent implements OnInit {
  pageSizeOptions = environment.page_size_options;
  displayedColumns: string[] = [
    'id',
    'name',
    'status',
    'created_at',
    'updated_at',
    'actions',
  ];
  view_model_status = false;
  public curriculum_name = '';
  public steps = ['step_' + 0];
  public curriculum_id = '';
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public page = 0;
  public model_status = false;
  public edit_model_status = false;
  popoverTitle = '';
  popoverMessage = '';
  confirmClicked = false;
  cancelClicked = false;
  search_text = '';
  duplicate_error = false;
  duplicate_error_value = '';
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.getCurriculums();
  }
  drop(event: CdkDragDrop<string[]>) {
    alert();
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }
  getCurriculums() {
    let param = { url: 'curriculum' };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['curriculums']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.toster.info(res['message'], 'Info');
      }
    });
  }
  toggleModel() {
    this.model_status = !this.model_status;
    this.steps = ['step_' + 0];
    (<HTMLFormElement>document.getElementById('curriculum_form')).reset();
    (<HTMLFormElement>document.getElementById('edit_curriculum_form')).reset();
  }
  addStep() {
    let length = this.steps.length;
    this.steps.push('step_' + length);
    this.steps['step_' + length] = '';
  }
  removeStep(i) {
    this.steps.splice(i, 1);
  }
  checkDuplicate(this_value, step) {
    let arr = this.steps;
    this.duplicate_error_value = '';
    this.duplicate_error = false;
    arr.forEach((val) => {
      if (
        arr[val] == this_value &&
        this_value != null &&
        this_value != '' &&
        val != step
      ) {
        this.duplicate_error = true;
        this.duplicate_error_value = this_value;
      } else {
      }
    });
    if (this.duplicate_error) {
      //this.toster.error('Duplicate Level names not allowed', 'Error');
    }
  }
  resetDuplicates(step) {
    this.steps[step] = '';
    this.duplicate_error_value = '';
    this.duplicate_error = false;
  }
  createCurriculum() {
    if (this.duplicate_error) {
      this.toster.error('Duplicate Level names not allowed');
      return false;
    }
    let steps = [];
    this.steps.forEach((step) => {
      steps.push(this.steps[step]);
    });
    let param = {
      url: 'curriculum',
      curriculum_name: this.curriculum_name,
      curriculum_steps: steps,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        this.steps = ['step_' + 0];
        this.toggleModel();
        this.getCurriculums();
      } else {
        let message = res['errors']['curriculum_name']
          ? res['errors']['curriculum_name']
          : res['message'];
        this.toster.error(message, 'Error');
      }
    });
  }
  viewCurriculum(param) {
    this.view_model_status = !this.view_model_status;
  }
  editCurriculum(param) {
    this.duplicate_error = false;
    this.edit_model_status = !this.edit_model_status;
    this.curriculum_name = param['name'];
    this.curriculum_id = param['id'];
    param['url'] = 'curriculum/get-steps/' + this.curriculum_id;
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.steps = [];
        res['data']['curriculum_steps'].forEach((row) => {
          let length = this.steps.length;
          this.steps.push('step_' + length);
          this.steps['step_' + length] = row['display_label'];
        });
      }
    });
  }
  updateCurriculum() {
    if (this.duplicate_error) {
      this.toster.error('Duplicate Level names not allowed');
      return false;
    }
    let steps = [];
    this.steps.forEach((step) => {
      steps.push(this.steps[step]);
    });
    let param = {
      url: 'curriculum/' + this.curriculum_id,
      curriculum_name: this.curriculum_name,
      curriculum_steps: steps,
    };
    this.http.put(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        (<HTMLFormElement>(
          document.getElementById('edit_curriculum_form')
        )).reset();
        this.edit_model_status = !this.edit_model_status;
        this.getCurriculums();
      } else {
        this.toster.error(res['errors']['curriculum_name'], res['message']);
      }
    });
  }
  deleteCurriculum(curriculum_id, status) {
    status = status == 1 ? '0' : '1';
    let param = {
      url: 'curriculum-status/' + curriculum_id + '/' + status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        this.getCurriculums();
      } else {
        this.toster.error(res['message'], res['message']);
      }
    });
  }
  public getServerData(event?: PageEvent) {}
  public doFilter() {
    let value = this.search_text;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  public navigateTo(curriculum_id) {
    let param = { url: 'curriculum/' + curriculum_id };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.route.navigateByUrl(
          '/admin/curriculum/' +
            curriculum_id +
            '/' +
            res['data']['result']['level_number']
        );
      }
    });
  }
}
