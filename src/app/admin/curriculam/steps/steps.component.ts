import { Component, OnInit, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    'pk_id',
    'level_name',
    'order_number',
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
  public step_pk_id = '';
  public parent_id = '';
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public page = 0;
  public model_status = false;
  public edit_model_status = false;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public search_box = '';
  public breadcome = [];
  public curriculum_obj = [];
  public order_number = 0;
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
  ) {
    //this.route.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  ngOnInit(): void {
    this.step_id = this.activatedRoute.snapshot.params.step;
    this.activatedRoute.params.subscribe((param) => {
      this.step_id = param.step?param.step:1;
      this.parent_id = param.level_parent_id ? param.level_parent_id : 0;
      this.curriculum_id = param.curriculum_id;
      this.reLoad();
    });
  }
  reLoad() {
    let param = {
      url: 'curriculum/' + this.curriculum_id + '/' + this.step_id+'/'+this.parent_id,
    };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
          this.page = 0;
        this.breadcome = res['data']['breadcome'];
        this.curriculum_obj = res['data']['curriculum'];
        this.prev_steps = res['data']['prev_steps'];
        this.step = res['data']['result']['display_label'];
        this.curriculum_label_id = res['data']['result']['pk_id'];
        this.step_number = res['data']['result']['level_number'];
        this.getSteps(true);
      }
    });
  }
  getSteps(is_ini = false) {
    let param = {
      url: 'get-steps',
      curriculum_id: this.curriculum_id,
      step_id: this.step_id,
      parent_id: this.parent_id,
      offset: this.page,
      limit: this.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['steps']);
        if (is_ini || true) {
          
          if (this.paginator != undefined) {
            this.paginator.pageIndex = 0;
            this.paginator.firstPage();
          }
          else{
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        }
        this.totalSize = res['total_records'];
      } else {
        //this.toster.info(res['message'], 'Info');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }
  public getServerData(event?: PageEvent) {
    this.page = event.pageSize * event.pageIndex;
    let param = {
      url: 'get-steps',
      curriculum_id: this.curriculum_id,
      step_id: this.step_id,
      parent_id: this.parent_id,
      offset: this.page,
      limit: event.pageSize,
      order_by: this.sort_by,
      search: this.search_box,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['data']['steps']);
        this.totalSize = res['total_records'];
      } else {
        this.toster.info(res['message'], 'Error');
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }
  sortData(event) {
    this.sort_by = event;
    this.page = 0;
    if (this.sort_by.direction != '') this.getSteps();
  }
  public doFilter = () => {
    this.page=0;
    this.getSteps();
  };
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
      parent_id: this.parent_id,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.toggleModel();
        this.getSteps();
      } else {
        let message = res['errors']['step_name']
          ? res['errors']['step_name']
          : res['message'];
        this.toster.error(message, 'Error', { closeButton: true });
      }
    });
  }
  editStep(param) {
    this.edit_model_status = !this.edit_model_status;
    this.step_name = param['name'];
    this.step_code = param['code'];
    //this.curriculum_id = param['id'];
    this.step_pk_id = param['id'];
  }
  updateStep() {
    let param = {
      url: 'step/' + this.step_pk_id,
      step_name: this.step_name,
      step_code: this.step_code,
      curriculum_id: this.curriculum_id,
      step_number: this.step_number,
    };
    this.http.put(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        (<HTMLFormElement>document.getElementById('edit_step_form')).reset();
        this.edit_model_status = !this.edit_model_status;
        this.getSteps();
      } else {
        this.toster.error(res['errors']['step_name'], res['message'], {
          closeButton: true,
        });
      }
    });
  }
  setOrder(order_number, step_obj, i){
    order_number = order_number.trim();
    if(order_number == ''){
        (<HTMLInputElement>document.getElementById("order_"+step_obj['id'])).value = step_obj['order_number'];
        return false;
    }
    let pk_id = step_obj['id'];
    let param = {
        url: "update-step-order",
        level_id: pk_id,
        order_number: order_number
      };
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
            this.dataSource.data[i]['order_number'] = order_number;
          this.toster.success(res['message'], 'Success', { closeButton: true });
        } else {
          this.toster.error(res['message'], res['message'], {
            closeButton: true,
          });
        }
      });
  }
  deleteStep(id, status) {
    status = status == 1 ? '0' : '1';
    let param = {
      url: 'step-status/' + id + '/' + status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.getSteps();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }
  public navigateTo(param) {
      let step_id = param['level_id'] != undefined?param['level_id']:this.step_id
    let param2 = {
      url: 'get-next-step/' + this.curriculum_id + '/' + step_id,
    };
    this.http.get(param2).subscribe((res) => {
      if (res['error'] == false) {
        this.route.navigateByUrl(
          '/admin/curriculum/' +
            this.curriculum_id +
            '/' +
            res['data']['result']['level_number'] +
            '/' +
            param['id']
        );
      }
      else{
          this.toster.error("No Levels Found", "Not Found", {closeButton:true});
      }
    });
  }
}
