import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements OnInit {
  public step = 'Step';
  public curriculum_id = '';

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

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public page = 0;
  public model_status = false;
  public edit_model_status = false;
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.step = this.activatedRoute.snapshot.params.step;
    this.curriculum_id = this.activatedRoute.snapshot.params.curriculum_id;
    this.getCurriculums();
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
  public getServerData(event?: PageEvent) {}
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };
}
