import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';

export interface PeriodicElement {
  
}

const ELEMENT_DATA: PeriodicElement[] = [

]

@Component({
  selector: 'app-assessment-list',
  templateUrl: './assessment-list.component.html',
  styleUrls: ['./assessment-list.component.scss']
})
export class AssessmentListComponent implements OnInit {
  displayedColumns: string[] = ['Sno', 'SubName', 'assNme', 'dtndTm', 'qstns', 'eqDrtn', 'invTd',  'acTn']; //'appeRd', 'absnTee',
  
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public page: number = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public editStatus = 0;

  constructor(private http: CommonService, public translate: TranslateService, private toster: ToastrService, private router: Router,) {
    this.translate.setDefaultLang(this.http.lang);
   }

  ngOnInit(): void {
    this.pageFilter();
  }

  getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
    this.pageFilter();
  }

  public pageFilter(){
    let param = { url: 'assessment/get-list', offset: this.page, limit: this.pageSize};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['assessments']);
        this.dataSource.sort = this.sort;
        this.totalSize = res['assessments_count'];
      } else {
        this.dataSource = new MatTableDataSource([]);
        this.toster.info(res['message'], 'Info');
      }
      
    });
  }

  public deleteContentData(id){
    let param = {
      url: 'assessment-delete/' + id ,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.pageFilter();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }

}
