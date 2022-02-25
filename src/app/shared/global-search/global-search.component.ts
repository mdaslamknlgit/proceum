import { Component, Input, OnInit, OnChanges, HostListener, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss']
})
export class GlobalSearchComponent implements OnInit {
  @Input() key = '';
  public search_result = [];
  public result_cond;
  public result_count = 0;
  public timer;
  public offset = 0;
  public limit = 50;
  public synchronous = false;
  public pageSize = 50; //environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  public sort_by: any;
  public type = 0;
  public page = 0;
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: CommonService,private router: Router,private authHttp: AuthService,) { }

  ngOnInit(): void {
    if (this.key)
    {
      this.globalsearch();
    }
  }
  ngOnChanges():void{
    if (this.key)
    {
      this.globalsearch();
    }
  }
  globalsearch(){
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let param = { url: 'search?key='+this.key,offset: this.page,limit: this.pageSize};
      let user = this.http.getUser();
        if(user){
          this.http.post(param).subscribe((res) => {
          if(res['error'] == false) {
            this.search_result =  res['data'];
            this.result_cond = false;
          }else{
            this.search_result = res['data'];
            this.result_cond = true;
          }
          let keys = Object.keys(res['data']);
          this.result_count = res['total_count'];
          this.limit = this.limit + 50;
          this.synchronous = true;

          // if (this.paginator != undefined) {
          //   this.paginator.pageIndex = 0;
          //   this.paginator.firstPage();
          // }
          // this.dataSource = new MatTableDataSource(res['data']);
          // this.totalSize = res['total_count'];
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;


        });
      }else{
        this.authHttp.post(param).subscribe((res) => {
          if(res['error'] == false) {
            this.search_result =  res['data'];
            this.result_cond = false;
          }else{
            this.search_result = res['data'];
            this.result_cond = true;
          }
          let keys = Object.keys(res['data']);
          this.result_count = res['total_count'];
          this.limit = this.limit + 50;
          this.synchronous = true;

          // if (this.paginator != undefined) {
          //   this.paginator.pageIndex = 0;
          //   this.paginator.firstPage();
          // }
          // this.dataSource = new MatTableDataSource(res['data']);
          // this.totalSize = res['total_count'];
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;

        });
      }      
    },1000);
  }
  navigateTo(url){
    this.router.navigateByUrl("index/curriculum/"+url);
  }
  // public getServerData(event?: PageEvent) {
  //   console.log("called");
  //   this.page = event.pageSize * event.pageIndex;
  //   clearTimeout(this.timer);
  //   this.timer = setTimeout(() => {
  //     let param = { url: 'search?key='+this.key,offset: this.page,limit: this.pageSize};
  //     let user = this.http.getUser();
  //       if(user){
  //         this.http.post(param).subscribe((res) => {
  //         if(res['error'] == false) {
  //           // this.search_result =  res['data'];
  //           this.result_cond = false;
  //         }else{
  //           // this.search_result = res['data']; //[];
  //           this.result_cond = true;
  //         }
  //         // let keys = Object.keys(res['data']);
  //         // this.result_count = res['total_count'];
  //         // this.limit = this.limit + 50;
  //         // this.synchronous = true;

  //         if (this.paginator != undefined) {
  //           this.paginator.pageIndex = 0;
  //           this.paginator.firstPage();
  //         }
  //         this.dataSource = new MatTableDataSource(res['data']);
  //         this.totalSize = res['total_count'];
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;


  //       });
  //     }else{
  //       this.authHttp.post(param).subscribe((res) => {
  //         if(res['error'] == false) {
  //           // this.search_result =  res['data'];
  //           this.result_cond = false;
  //           // this.search_result.sort();
  //         }else{
  //           // this.search_result = res['data']; //[];
  //           this.result_cond = true;
  //         }
  //         // let keys = Object.keys(res['data']);
  //         // this.result_count = res['total_count'];
  //         // this.limit = this.limit + 50;
  //         // this.synchronous = true;

  //         if (this.paginator != undefined) {
  //           this.paginator.pageIndex = 0;
  //           this.paginator.firstPage();
  //         }
  //         this.dataSource = new MatTableDataSource(res['data']);
  //         this.totalSize = res['total_count'];
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;

  //       });
  //     }      
  //   },1000);
  // }
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.bottomReached() && (this.limit < this.result_count) && this.synchronous) {
      this.synchronous = false;
      this.globalsearch();
    }
  }
  bottomReached(): boolean {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
  }
}
