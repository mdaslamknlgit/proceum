import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { CommonService } from '../../../services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-custom-page-list',
  templateUrl: './custom-page-list.component.html',
  styleUrls: ['./custom-page-list.component.scss']
})
export class CustomPageListComponent implements OnInit {
  displayedColumns: string[] = ['pk_id', 'menu_name', 'page_name', 'show_menu', 'created_at', 'action'];
  dataSource: any = [];
  apiURL: string;
  customPageList:any;
  public num_custom_page: number = 0;
  public page = 0;
  public pageSize = environment.page_size;
  public pageSizeOptions = environment.page_size_options;
  public sort_by: any;
  search = "";
  constructor(
    private http: CommonService,
    public toster: ToastrService,
  ) {
    this.apiURL = environment.apiUrl;
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getCustomPageList();
  }

  getCustomPageList() {
    let param = { url: 'custompage-list', "offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by };
    this.http.post(param).subscribe((res: Response) => {
      this.customPageList=res['customPage'];
      this.dataSource = new MatTableDataSource(res['customPage']);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.num_custom_page = res['custom_page_count'];
    });
  }

  applyFilters() {
    let param = { url: 'custompage-list', "offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by, 'search_term': this.search };
   console.log(param);
    this.http.post(param).subscribe((res) => {
      this.customPageList=res['customPage'];
      this.dataSource = new MatTableDataSource(res['customPage']);
      this.dataSource.sort = this.sort;
      this.num_custom_page = res['custom_page_count'];
    });
  }

  public getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
    this.page = (event.pageSize * event.pageIndex);
    this.applyFilters();
  }

  sortData(event) {
    console.log(event);
    this.sort_by = event;
    if (this.sort_by.direction != '')
      this.applyFilters();
  }

  changeStatus(page_id, status) {
    status = status == 1 ? '0' : '1';
    let param = {
      url: 'page-status/' + page_id + '/' + status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
        this.getCustomPageList();
      } else {
        this.toster.error(res['message'], res['message']);
      }
    });
  }
 
}
