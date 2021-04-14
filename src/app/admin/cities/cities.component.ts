import { Component, OnInit,ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  displayedColumns: string[] = ['pk_id', 'city_name', 'state_name', 'country_name', 'status', 'action'];
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
  public state_name="";
  public country_name="";
  public maxSize: number = 5; // 5MB
  public fileExt: string = "xlsx";
  public search_txt="";
  constructor(private http:CommonService,private route: Router,private activatedRoute: ActivatedRoute,private toastr: ToastrService) {
    this.country_id = this.activatedRoute.snapshot.params.country_id;
    this.state_id = this.activatedRoute.snapshot.params.state_id;
   }

  ngOnInit(): void {
    let params={url: 'get-all-cities',country_id:this.country_id,state_id:this.state_id,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,search_txt:this.search_txt};
    this.http.post(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['cities']);
      this.num_cities = res['data']['cities_count'];
      this.country_name = res['data']['country_name'];
      this.state_name = res['data']['state_name'];
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
    let params={url: 'get-all-cities',country_id:this.country_id,state_id:this.state_id,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,search_txt:this.search_txt};
    this.http.post(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['cities']);
      this.num_cities = res['data']['cities_count'];
    });
  }

  sortData(event) {
		this.sort_by = event;
		if (this.sort_by.direction != '')
			this.applyFilters();
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
          this.city_name ="";
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
          this.city_name ="";
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

  cityFileChange(event:any) {
    let files = event.target.files;
    this.uploadFiles(files);
  }

  uploadFiles(files:any) {
    if (this.isValidFileExtension(files)) {
      let formData: FormData = new FormData();
      formData.append("import_file", files[0], files[0].name);
      formData.append("state_id",this.state_id);
      let params = {url:"import-cities"};
      this.http.import(params,formData).subscribe((res: Response) => {
          console.log(res);
          if (res.error) {
            this.toastr.error(res.message , 'Error', { closeButton: true , timeOut: 3000});
          }else{
            this.toastr.success(res.message , 'Success', { closeButton: true , timeOut: 3000});
            this.toggleModel();
            this.applyFilters();
          }
      });
    }
  }



  private isValidFileExtension(files) {

    var extensions = (this.fileExt.split(',')).map(function (x) { return x.toLocaleUpperCase().trim() });

    for (var i = 0; i < files.length; i++) {
      var ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
      var exists = extensions.includes(ext);
      if (ext != "CSV") {
        this.toastr.error("Invalid File Extension" , 'Error', { closeButton: true , timeOut: 3000});
         return false
      }
      return this.isValidFileSize(files[i]);
    }
  }

  private isValidFileSize(file) {
    var fileSizeinMB = file.size / (1024 * 1000);
    var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
    if (size > this.maxSize){
      let message = "Error (File Size): " + file.name + ": exceed file size limit of " + this.maxSize + "MB ( " + size + "MB )";
      this.toastr.error(message , 'Error', { closeButton: true , timeOut: 3000});
      
      return false
    }
    return true;
  }

}
export interface Response {
  error: boolean;
  message: string;
  errors?: any;
}

