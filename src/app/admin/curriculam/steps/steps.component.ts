import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements OnInit {
  public step = 'Step';
  public step_id = '';
  public curriculum_id = '';

  displayedColumns: string[] = [
    'id',
    'Name',
    'status',
    'created_at',
    'updated_at',
    'actions',
  ];
  public step_name = '';
  public step_code = '';
  public curriculum_label_id = '';
  public prev_steps = [];
  public step_number = '';
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public page = 0;
  public model_status = false;
  public edit_model_status = false;
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private route: Router
  ) {
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  ngOnInit(): void {
    this.step_id = this.activatedRoute.snapshot.params.step;
    this.curriculum_id = this.activatedRoute.snapshot.params.curriculum_id;
    this.reLoad();
  }
  reLoad() {
    let param = {
      url: 'curriculum/' + this.curriculum_id + '/' + this.step_id,
    };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.prev_steps = res['data']['prev_steps'];
        this.step = res['data']['result']['display_label'];
        this.curriculum_label_id = res['data']['result']['pk_id'];
        this.step_number = res['data']['result']['level_number'];
        this.getSteps();
      }
    });
  }
  getSteps() {
    let param = {
      url: 'get-steps',
      curriculum_id: this.curriculum_id,
      step_id: this.step_id,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['steps']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }
  toggleModel() {
    this.model_status = !this.model_status;
    (<HTMLFormElement>document.getElementById('step_form')).reset();
    (<HTMLFormElement>document.getElementById('edit_step_form')).reset();
  }
  createStep() {
    let param = {
      url: 'step',
      step_name: this.step_name,
      step_code: this.step_code,
      curriculum_label_id: this.curriculum_label_id,
      curriculum_id: this.curriculum_id,
      step_number: this.step_number,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        this.toggleModel();
      } else {
        let message = res['errors']['step_name']
          ? res['errors']['step_name']
          : res['message'];
        this.toster.error(message, 'Error');
      }
    });
  }
  editStep(param) {
    this.edit_model_status = !this.edit_model_status;
    this.step_name = param['name'];
    this.curriculum_id = param['id'];
  }
  updateStep() {
    let param = {
      url: 'curriculum/' + this.curriculum_id,
      step_name: this.step_name,
    };
    this.http.put(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        (<HTMLFormElement>document.getElementById('edit_step_form')).reset();
        this.edit_model_status = !this.edit_model_status;
        this.getSteps();
      } else {
        this.toster.error(res['errors']['step_name'], res['message']);
      }
    });
  }
  public getServerData(event?: PageEvent) {}
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };
  public navigateTo(step_id) {
    let param = {
      url: 'get-next-step/' + this.curriculum_id + '/' + this.step_id,
    };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.route.navigateByUrl(
          '/admin/curriculum/' +
            this.curriculum_id +
            '/' +
            res['data']['result']['level_number']
        );
      }
    });
  }
}
