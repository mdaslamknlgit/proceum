import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  symbol1: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', symbol1: 'H' },
];


@Component({
  selector: 'app-questions-management',
  templateUrl: './questions-management.component.html',
  styleUrls: ['./questions-management.component.scss']
})
export class QuestionsManagementComponent implements OnInit {
  displayedColumns: string[] = ['id', 'question', 'question_type', 'q_bank','actions'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  page_size_options = environment.page_size_options;
  is_loaded = false;
  public search_box = '';
  public slected_content_ids = [];
  public page = 0;
  public pageSize = environment.page_size;
  public questions_count: number = 0;
  search_q_type = '';
  search_key = null;
  search_source = "";
  constructor(private http: CommonService,
    public toster: ToastrService
  ) { }

  ngOnInit(): void {
    this.getQLists()
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

  public doFilter = () => {
    let value = this.search_box;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  public getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
    this.applyFilters();
    
  }

  changeQSource(event){
    this.search_source = event.value;
    this.applyFilters();
  }

  applyFilters(){
    let params={url:'qlists/index',"offset": this.page, "limit": this.pageSize,"search_key": this.search_key,"search_source": this.search_source};
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
        this.getQLists();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }
}
