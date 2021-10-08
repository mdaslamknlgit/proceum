import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'}];
@Component({
  selector: 'app-study-planner-list',
  templateUrl: './study-planner-list.component.html',
  styleUrls: ['./study-planner-list.component.scss']
})
export class StudyPlannerListComponent implements OnInit {
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    public pageSize = environment.page_size;
    public page_size_options = environment.page_size_options;
    public totalSize = 0;
    public page: number = 0;
    displayedColumns: string[] = ['s_no', 'plan_name', 'duration', 'crated_by', 'created_at', 'Actions'];
    dataSource = new MatTableDataSource([]);
    search_key = '';
    constructor(private http: CommonService, private toster: ToastrService, private router: Router) { }
    ngOnInit(): void {
        this.getPlansList();
    }
    getPlansList(){
        let param = {
            url: 'study-plan/list',
            offset: 0,
            limit: this.pageSize,
            search_key: this.search_key
        };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.dataSource = new MatTableDataSource(res['data']['plans_list']);
                this.totalSize = res['data']['total_records'];
                this.dataSource.paginator = this.paginator;
            }
        });
    }
    getServerData(event){
        this.page = event.pageSize * event.pageIndex;
        this.pageSize = event.pageSize;
        let param = {
            url: 'study-plan/list',
            offset: this.page,
            limit: this.pageSize,
            search_key: this.search_key
        };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                if (this.paginator != undefined) {
                    this.paginator.pageIndex = 0;
                    this.paginator.firstPage();
                }
            this.dataSource = new MatTableDataSource(res['data']['plans_list']);
            this.totalSize = res['total_records'];
            }
        });
    }
    applyFilters(){
        let param = {
            url: 'study-plan/list',
            offset: 0,
            limit: this.pageSize,
            search_key: this.search_key
        };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.dataSource = new MatTableDataSource(res['data']['plans_list']);
                this.totalSize = res['data']['total_records'];
            }
        });
    }
    deleteStudyPlanner(id){
        let param = {url:"study-plan/delete", study_plan_id: id};
        this.http.post(param).subscribe(res=>{
            if(res['error']==false){
                this.toster.success(res['message'], "Success", {closeButton:true});
                this.applyFilters();
            }
            else{
                this.toster.error(res['message'], "Error", {closeButton:true});
            }
        })
    }
}
