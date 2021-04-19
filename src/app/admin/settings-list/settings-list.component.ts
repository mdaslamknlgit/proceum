import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { CommonService } from '../../services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.scss']
})
export class SettingsListComponent implements OnInit {

  displayedColumns: string[] = ['pk_id', 'organization_name', 'contact_name', 'contact_email_1', 'contact_number_1', 'created_at', 'action'];
  dataSource: any = [];
  data: any = [];
  apiURL: string;
  public num_settings: number = 0;
  public page = 0;
  public pageSize = environment.page_size;
  public pageSizeOptions = environment.page_size_options;
  public sort_by: any;
  public model_status = false;
  public newList:any;
  public settings:any={
    "gstNumber":"",
    "address":"",
    "theam_color":"",
    "copy_right_text":"",
    "list_view_page_limit":"",
    "date_format":"",
    "time_format":"",
    "created_at":"",
    "updated_at":""
  };
  search = "";
  constructor(
    private http: CommonService,
    public dialog: MatDialog
  ) {
    this.apiURL = environment.apiUrl;
  }

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getSettingsList();
  }

  getSettingsList() {
    let param = { url: 'settings-list', "offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by };
    this.http.post(param).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['settings']);
      this.data=res['settings'];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.num_settings = res['settings_count'];
    });
  }

  applyFilters() {
    let param = { url: 'settings-list', "offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by, 'search_term': this.search };
    this.http.post(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['settings']);
      this.data=res['settings'];
      this.dataSource.sort = this.sort;
      this.num_settings = res['settings_count'];
    });
  }

  public getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
    this.page = (event.pageSize * event.pageIndex);
    this.applyFilters();
  }

  sortData(event) {
    this.sort_by = event;
    if (this.sort_by.direction != '')
      this.applyFilters();
  }

  toggleModel(id) {
    this.settings={
      "gstNumber":"",
      "address":"",
      "theam_color":"",
      "copy_right_text":"",
      "list_view_page_limit":"",
      "date_format":"",
      "time_format":"",
      "created_at":"",
      "updated_at":""
    };
    if(id){
      this.newList = this.data.filter(function (list) {
        return list.pk_id == id;
      });
      this.settings={
        "organization_name":this.newList[0].organization_name,
        "gstNumber":this.newList[0].gstin_number,
        "address":this.newList[0].full_address,
        "theme_color":this.newList[0].theme_color,
        "copy_right_text":this.newList[0].copyright_text,
        "list_view_page_limit":this.newList[0].list_view_limit,
        "date_format":this.newList[0].date_format,
        "time_format":this.newList[0].time_format,
        "created_at":this.newList[0].created_at,
        "updated_at":this.newList[0].updated_at
      };
    }
      this.model_status = !this.model_status;    
  }

}


export interface Response {
  error: boolean;
  message: string;
  errors?: any;
  settings?: any;
}