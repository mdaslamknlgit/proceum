import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-countries-states-cities',
  templateUrl: './countries-states-cities.component.html',
  styleUrls: ['./countries-states-cities.component.scss']
})

export class CountriesStatesCitiesComponent implements OnInit {
  displayedColumns: string[] = ['s_no', 'country_name', 'state_name', 'city_name', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public num_rows: number = 0;
  public page = 0;
  public pageSize = 10;
  public sort_by: any;
  constructor(private http:CommonService) { }

  ngOnInit(): void {
    let params={
      url: 'get-countries-states-cities'
    };
    this.http.get(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['countries']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  
  public model_status = false;
  toggleModel() {
    this.model_status = !this.model_status;
  }

}

export interface Response {
  error: boolean;
  message: string;
  errors?: any;

}

