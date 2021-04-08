import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import { CommonService } from '../../services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalPopupComponent } from './model-popup/model-popup.component';
import { environment } from '../../../environments/environment';
import {MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-newsletter-list',
  templateUrl:`./newsletter-list.component.html`,
  styleUrls: ['./newsletter-list.component.css']
})
export class NewsletterListComponent implements OnInit  {
  displayedColumns: string[] = ['id', 'email', 'status', 'created_at','action'];
  dataSource:any=[];
  apiURL:string;
  public num_newsletters: number = 0;
  public page = 0;
  public pageSize = 10;
  public sort_by: any;
  hrefPDF:string;
  hrefEXL:string
  value="";
  constructor( 
    private http: CommonService,
    public dialog: MatDialog
    ) {
      this.apiURL = environment.apiUrl;
      this.hrefPDF=environment.apiUrl+'export-newsletter/PDF';
     this.hrefEXL=environment.apiUrl+'export-newsletter/EXL';
     console.log();
     }
     

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getNewsLetterList();
  }
  getNewsLetterList(){
    let param = { url: 'newsletter-list',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by};
    this.http.post(param).subscribe((res: Response) => {
      console.log(res);
      this.dataSource = new MatTableDataSource(res['newsletters']);
      this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.num_newsletters = res['newsletters_count'];
    }); 
  } 
  
  manageTemplate(id) {
    const dialogRef = this.dialog.open(ModalPopupComponent, {
      width: '400px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getNewsLetterList();
      }
    });
  }

  public getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
    this.applyFilters( );
  }
  public doFilter = (value: string) => {
    let key=value;
    console.log(key);
    

    this.dataSource.filter = value.trim().toLocaleLowerCase();
    this.hrefEXL=environment.apiUrl+'export-newsletter/EXL'+key;
    this.hrefPDF=environment.apiUrl+'export-newsletter/PDF'+key;
    //console.log(this.dataSource);
  };

  applyFilters(){
    let param = { url: 'newsletter-list',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by};
    this.http.post(param).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res['newsletters']);
      this.dataSource.sort = this.sort;
    });
  }

  sortData(event) {
		this.sort_by = event;
		if (this.sort_by.direction != '')
			this.applyFilters( );
	}


}

export interface NewsLetter {
  id: number;
  email: string;
  status: number;
  reason: string;
  action?:any
}

export interface Response {
	error: boolean;
	message: string;
	errors?: any;
  newsletterList?:any;
  }