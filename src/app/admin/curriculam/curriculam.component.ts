import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-curriculam',
  templateUrl: './curriculam.component.html',
  styleUrls: ['./curriculam.component.scss'],
})
export class CurriculamComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'Curriculum Name',
    'status',
    'created_at',
    'updated_at',
    'actions',
  ];
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
        this.toster.error(res['message'], 'Error');
      }
    });
  }
  toggleModel() {
    this.model_status = !this.model_status;
    (<HTMLFormElement>document.getElementById('curriculum_form')).reset();
    (<HTMLFormElement>document.getElementById('edit_curriculum_form')).reset();
  }
  addStep() {
    let length = this.steps.length;
    this.steps.push('step_' + length);
  }
  removeStep(i) {
    this.steps.splice(i, 1);
  }
  createCurriculum() {
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
  editCurriculum(param) {
    this.edit_model_status = !this.edit_model_status;
    this.curriculum_name = param['name'];
    this.curriculum_id = param['id'];
  }
  updateCurriculum() {
    let param = {
      url: 'curriculum/' + this.curriculum_id,
      curriculum_name: this.curriculum_name,
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
  public doFilter(value: string) {
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
