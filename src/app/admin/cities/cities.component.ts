import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  displayedColumns: string[] = ['s_no', 'city_name', 'state_name', 'country_name', 'status', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public num_cities: number = 0;
  public page = 0;
  public pageSize = 10;
  public sort_by: any;
  public model_status = false;
  public model_edit_status = false;
  public country_id:any;
  public state_id:any;
  public city_name='';
  public city_id:any;
  constructor(private http:CommonService,private route: Router,private activatedRoute: ActivatedRoute,private toastr: ToastrService) {
    this.country_id = this.activatedRoute.snapshot.params.country_id;
    this.state_id = this.activatedRoute.snapshot.params.state_id;
   }

  ngOnInit(): void {
    let params={url: 'get-all-cities',state_id:this.state_id,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by};
    this.http.post(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['cities']);
      this.num_cities = res['data']['cities_count'];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
    this.applyFilters();
  }

  applyFilters(){
    let params={url: 'get-all-cities',state_id:this.state_id,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by};
    this.http.post(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['cities']);
      this.num_cities = res['data']['cities_count'];
    });
  }

  toggleModel() {
    this.model_status = !this.model_status;
  }

  toggleCityModel(){
    this.model_edit_status = !this.model_edit_status;
  }

  saveCity(){
    if(this.city_name !=''){
      let params={url: 'save-city',city_name:this.city_name,state_id:this.state_id};
      this.http.post(params).subscribe((res: Response) => {
        if (res.error) {
          this.toastr.error(res.message , 'Error', { closeButton: true , timeOut: 3000});
        }else{
          this.toastr.success(res.message , 'Success', { closeButton: true , timeOut: 3000});
          this.toggleModel();
          this.applyFilters();
        }
      });
    }else{
      this.toastr.error("City Name is required" , 'Error', { closeButton: true , timeOut: 3000});
    }
  }

  openEditModel(param:any){
    this.model_edit_status = !this.model_edit_status;
    this.city_name = param.city_name;
    this.city_id = param.city_id;

  }

  updateCity(){
    if(this.city_name !=''){
      let params={url: 'update-city',city_name:this.city_name,city_id:this.city_id};
      this.http.post(params).subscribe((res: Response) => {
        if (res.error) {
          this.toastr.error(res.message , 'Error', { closeButton: true , timeOut: 3000});
        }else{
          this.toastr.success(res.message , 'Success', { closeButton: true , timeOut: 3000});
          this.toggleCityModel();
          this.applyFilters();
        }
      });
    }else{
      this.toastr.error("City Name is required" , 'Error', { closeButton: true , timeOut: 3000});
    }
  }

  changeStatus(id:any,type:any){
    let params={url: 'update-status',type: type,id:id};
    this.http.post(params).subscribe((res: Response) => {
      if (res.error) {
        this.toastr.error(res.message , 'Error', { closeButton: true , timeOut: 3000});
      }else{
        this.toastr.success(res.message , 'Success', { closeButton: true , timeOut: 3000});
        this.applyFilters();
      }
    });
  }

}
export interface Response {
  error: boolean;
  message: string;
  errors?: any;
}

