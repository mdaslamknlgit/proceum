import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  symbol1: string;
}
@Component({
  selector: 'app-questions-management',
  templateUrl: './questions-management.component.html',
  styleUrls: ['./questions-management.component.scss']
})
export class QuestionsManagementComponent implements OnInit {
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public topics: ReplaySubject<any> = new ReplaySubject<any>(1);
    public displayedColumns: string[] = ['id', 'question','actions'];
    public dataSource = new MatTableDataSource();
    public page_size_options = environment.page_size_options;
    public is_loaded = false;
    public filter_array = {question_flag:'', question_usage:0, question_bank:'', curriculum_id:0, level_id:0};
    public search_box = '';
    public slected_content_ids = [];
    public page = 0;
    public pageSize = environment.page_size;
    public questions_count: number = 0;
    public search_q_type = '';
    public search_key = null;
    public search_source = "";
    public q_banks = [];
    public curriculum_list = [];
    public curriculum_labels = [];
    public level_options = [];
    public all_level_options = [];
    public selected_level = [];
    constructor(private http: CommonService, public toster: ToastrService) { }
    ngOnInit(): void {
        this.getQLists();
        this.getQBanks();
    }
    getQBanks() {
        let params = {
        url: 'qlists/banks',

        };
        this.http.post(params).subscribe((res) => {
        if (res['error'] == false) {
            this.curriculum_list = res['data']['curriculums'];
            if(!this.curriculum_list){
                this.toster.error("No Curriculums Found", "Error" , { closeButton: true })
            }
            this.q_banks = res['data']['qbanks'];
        }
        });
    }
    getQLists() {
        let param = { url: 'qlists/index',"offset": this.page, "limit": this.pageSize };
        this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
            this.dataSource = new MatTableDataSource(res['data']['qlists']);
            if (this.is_loaded == true || true) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.questions_count = res['questions_count'];
            }
        } else {
            this.toster.error(res['message'], 'Error', { closeButton: true });
        }
        });
    }
    getcurriculums(type) {
        this.level_options = [];
        this.all_level_options = [];
        this.selected_level = [];
        this.filter_array.level_id=0;
        this.filter_array.curriculum_id = 0;
        this.curriculum_labels = [];
        this.applyFilters();
        let params = {
            url: 'get-courses-or-qbanks', type: this.filter_array['question_usage'] == 3 ?2:1
        };
        this.http.post(params).subscribe((res) => {
            if (res['error'] == false) {
                if (res['data']['list'].length > 0)
                    this.curriculum_list = res['data']['list'];
                else
                this.curriculum_list = [];
            }
        });
    }
    getLabels(){
        this.applyFilters();
        this.level_options = [];
        this.all_level_options = [];
        this.selected_level = [];
        this.filter_array.level_id=0;
        let param = {
            url: 'get-curriculum-labels',
            curriculum_id: this.filter_array.curriculum_id,
        };
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.applyFilters();
            let data = res['data'];
            this.level_options[1] = data['level_1'];
            this.all_level_options[1] = data['level_1'];
            this.curriculum_labels = data['curriculum_labels'];
                if(this.curriculum_labels.length == 0){
                    this.level_options = [];
                    this.all_level_options = [];
                    this.selected_level = [];
                }
            }
        });
    }
    ucFirst(string) {
        return this.http.ucFirst(string);
    }
    getLevels(level_id) {
        this.filter_array.level_id = this.selected_level[level_id];
        this.applyFilters();
        let param = {
        url: 'get-levels-by-level',
        step_id: this.selected_level[level_id],
        };
        this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
            let data = res['data'];
            this.level_options[level_id + 1] = data['steps'];
            this.all_level_options[level_id + 1] = data['steps'];
            this.level_options.forEach((opt, index) => {
            if (index > level_id + 1) this.level_options[index] = [];
            });
            this.selected_level.forEach((opt, index) => {
                if (index > level_id) this.selected_level[index] = 0;
            });
        }
        });
    }
    searchLevelByName(search,level){
        let options = this.all_level_options[level];
        this.level_options[level] = options.filter(
            item => item.level_name.toLowerCase().includes(search.toLowerCase())
        );
    }
    public doFilter = () => {
        let value = this.search_box;
        this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    public resetFilters(){
        this.search_key = '';
        this.filter_array = {question_flag:'', question_usage:0, question_bank:'', curriculum_id:0, level_id:0};
        this.curriculum_labels = [];
        this.selected_level = [];
        this.level_options = [];
        this.all_level_options = [];
        this.applyFilters();
    }
    public getServerData(event?: PageEvent) {
        this.pageSize = event.pageSize;
        this.page = (event.pageSize * event.pageIndex);
        let params={url:'qlists/index',"offset": this.page, "limit": this.pageSize,"search_key": this.search_key,"filter_array": this.filter_array, "selected_level": this.selected_level};
        this.http.post(params).subscribe((res: Response) => {
            this.dataSource = new MatTableDataSource(res['data']['qlists']);
            this.questions_count =  res['questions_count'];
        });
        
    }
    changeQSource(){
        this.applyFilters();
    }
    applyFilters(){
        let params={url:'qlists/index',"offset": 0, "limit": this.pageSize,"search_key": this.search_key,"filter_array": this.filter_array, "selected_level": this.selected_level};
        this.http.post(params).subscribe((res: Response) => {
        this.dataSource = new MatTableDataSource(res['data']['qlists']);
        this.questions_count =  res['questions_count'];
        });
    }
    deleteQuestion(id, status) {
        let param = {
        url: 'qlists/delete',
        id: id,
        };
        this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
            this.toster.success(res['message'], 'Success', { closeButton: true });
            this.applyFilters();
        } else {
            this.toster.error(res['message'], res['message'], {
            closeButton: true,
            });
        }
        });
    }
}
