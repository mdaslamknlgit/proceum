import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



@Component({
  selector: 'app-whiteboardgallery',
  templateUrl: './whiteboardgallery.component.html',
  styleUrls: ['./whiteboardgallery.component.scss']
})
export class WhiteboardgalleryComponent implements OnInit {
  //displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns: string[] = ['id','title','created_by','created_at','actions'];
  dataSource = new MatTableDataSource(); 
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public num_rows: number = 0;
  public page = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public sort_by: any;
  public search_txt ="";
  public show_list_view = true;
  public properties_popup: boolean = false;
  public preview_path = '';
  public title = '';
  public tname = '';
  public created_at = '';
  whiteboard: any = {
    search_text: ''
  }
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    //this.getWhiteboardGallery();
    this.changeView('list');
  }

  changeView(parm){
    if(parm == 'list'){
      this.page = 0;
      this.pageSize = environment.page_size;
      this.show_list_view = true;
      console.log('Page => '+this.page+', limit => '+this.pageSize)
      let param = { url: 'get-whiteboard-gallery',"parmType":"list","offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by, "search":this.whiteboard.search_text.trim()};
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          this.dataSource = new MatTableDataSource(res['whiteboard']);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.num_rows = res['whiteboard_count'];
        } else {
          this.toster.info(res['message'], 'Info');
        }
        
      });
    }
    if(parm == 'grid'){
      this.whiteboard.search_text = '';
      this.show_list_view = false;
      let param = { url: 'get-whiteboard-gallery',"parmType":"gird", "search":this.search_txt};
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          this.dataSource = res['whiteboard'];
        } else {
          this.toster.info(res['message'], 'Info');
        }
        
      });

    }
  }

  deleteContentData(id, type) {
    let param = {
      url: 'whiteboard-delete/' + id ,
      delete:1
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        if(type == 'list'){
          this.changeView(type);
        }
        if(type == 'grid'){
          this.changeView(type);
        }        
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }

  public getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
    this.pageFilter();
  }
  
  public pageFilter(){
    let param = { url: 'get-whiteboard-gallery',"parmType":"list","offset": this.page, "limit": this.pageSize, "search":this.whiteboard.search_text.trim()};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['whiteboard']);
        this.num_rows = res['whiteboard_count'];
      } else {
        this.toster.info(res['message'], 'Info');
      }
      
    });
  }

  public doFilter(){
    //console.log('okkk'+this.whiteboard.search_text.trim());
    //console.log('Page => '+this.page+', limit => '+this.pageSize)
    this.changeView('list');
    /*let param = { url: 'get-whiteboard-gallery',"parmType":"list","offset": this.page, "limit": this.pageSize, "search":this.whiteboard.search_text.trim()};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['whiteboard']);
        //this.dataSource.paginator = this.paginator;
        this.num_rows = res['whiteboard_count'];
      } else {
        this.toster.info(res['message'], 'Info');
      }
      
    });*/
  }

  showPropertisModal(image_path,title,tname,created_at) {
    this.preview_path = image_path;
    this.title = title;
    this.tname = tname;
    this.created_at = created_at;
    this.properties_popup = true;
  }

  ClosePropertisModal() {
    this.properties_popup = false;
  }

}
