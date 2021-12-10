import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';


@Component({
selector: 'app-list-meeting',
templateUrl: './list-meeting.component.html',
styleUrls: ['./list-meeting.component.scss']
})
export class ListMeetingComponent implements OnInit {
    public displayedColumns: string[] = ['s_no', 'topic', 'start_time', 'duration', 'type', 'status', 'actions'];
    public dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    public pageSize = environment.page_size;
    public page_size_options = environment.page_size_options;
    public totalSize = 0;
    public page = 0;
    public search_box = '';
    public are_you_sure_to_cancel_text = '';
    constructor(public translate: TranslateService, private http: CommonService, private toster: ToastrService) { 
        this.translate.setDefaultLang(this.http.lang);
    }

    ngOnInit(): void {
        this.getList();
        this.translate.get("are_you_sure_to_cancel_text").subscribe(text=>{
            this.are_you_sure_to_cancel_text = text;
        });
    }
    getList() {
        let param = {url: 'class/list', type: '', limit: this.pageSize, offset: 0};
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.dataSource = new MatTableDataSource(res['data']['meetings_list']);
                this.totalSize = res['data']['total_records'];
                this.dataSource.paginator = this.paginator;
            }
            else{

            }
        });
    }
    public getServerData(event?: PageEvent) {
        this.page = event.pageSize * event.pageIndex;
        let param = {
          url: 'class/list',
          type:'',
          offset: this.page,
          limit: event.pageSize,
          search: this.search_box,
        };
        this.http.post(param).subscribe((res) => {
          if (res['error'] == false) {
            this.dataSource = new MatTableDataSource(res['data']['meetings_list']);
            this.totalSize = res['data']['total_records'];
          } else {
            this.dataSource = new MatTableDataSource([]);
          }
        });
    }
    public doFilter(){
        let param = {
            url: 'class/list',
            type:'',
            offset: 0,
            limit: this.pageSize,
            search: this.search_box,
          };
          this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
              this.dataSource = new MatTableDataSource(res['data']['meetings_list']);
              this.totalSize = res['data']['total_records'];
              if (this.paginator != undefined) {
                     this.paginator.pageIndex = 0;
                     this.paginator.firstPage();
                 }
            } else {
              this.dataSource = new MatTableDataSource([]);
              if (this.paginator != undefined) {
                     this.paginator.pageIndex = 0;
                     this.paginator.firstPage();
                 }
            }
          });
    }
    public cancelClass(meeting_id, index){
        let param = {
            url: 'class/cancel',
            meeting_id:''+meeting_id,
        };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.translate.get("admin.class.list.class_cancelled_message").subscribe(text=>{
                    this.translate.get("success_text").subscribe(success_text=>{
                        this.dataSource.data[index]['status'] = 3;
                        this.toster.success(text, success_text, {closeButton:true});
                    })
                });
            } else {
                this.translate.get("something_went_wrong_text").subscribe(text=>{
                    this.translate.get("error_text").subscribe(error_text=>{
                        this.toster.error(text, error_text, {closeButton:true});
                    })
                });
            }
        });
    }
}
