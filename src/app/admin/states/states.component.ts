import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss']
})
export class StatesComponent implements OnInit {
  displayedColumns: string[] = ['pk_id', 'state_name', 'country_name', 'status', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public num_states: number = 0;
  public page = 0;
  public pageSize = 10;
  public sort_by: any;
  public model_status = false;
  public model_state_status = false;
  public country_id:any;
  public country_name="";
  public state_name = '';
  public state_id:any;
  public maxSize: number = 5; // 5MB
  public fileExt: string = "xlsx";
  public search_txt = "";
  constructor(private http:CommonService,private route: Router,private activatedRoute: ActivatedRoute,private toastr: ToastrService) {
    this.country_id = this.activatedRoute.snapshot.params.country_id;
   }

  ngOnInit(): void {
    let params={url:'get-all-states',country_id:this.country_id,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,search_txt:this.search_txt};
    this.http.post(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['states']);
      this.num_states = res['data']['states_count'];
      this.country_name = res['data']['country_name'];
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
    let params={url:'get-all-states',country_id:this.country_id,"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,search_txt:this.search_txt};
    this.http.post(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['states']);
      this.num_states = res['data']['states_count'];
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
  toggleStateModel() {
    this.model_state_status = !this.model_state_status
  }

  public navigateTo(country_id:any,state_id:any) {
        this.route.navigateByUrl('/admin/countries/' +country_id + "/" + state_id);
  }

  saveState(){
    if(this.state_name !=''){
      let params={url: 'save-state',state_name:this.state_name,country_id: this.country_id};
      this.http.post(params).subscribe((res: Response) => {
        if (res.error) {
          this.toastr.error(res.message , 'Error', { closeButton: true , timeOut: 3000});
        }else{
          this.toastr.success(res.message , 'Success', { closeButton: true , timeOut: 3000});
          this.state_name ="";
          this.toggleModel();
          this.applyFilters();
        }
      });
    }else{
      this.toastr.error("State Name is required" , 'Error', { closeButton: true , timeOut: 3000});
    }

  }

  openEditModel(param:any){
    console.log(param);
    this.model_state_status = !this.model_state_status;
    this.state_name = param.state_name;
    this.state_id = param.state_id;
  }

  updateState(){
    if(this.state_name !=''){
      let params={url: 'update-state',state_name:this.state_name,state_id: this.state_id};
      this.http.post(params).subscribe((res: Response) => {
        if (res.error) {
          this.toastr.error(res.message , 'Error', { closeButton: true , timeOut: 3000});
        }else{
          this.toastr.success(res.message , 'Success', { closeButton: true , timeOut: 3000});
          this.state_name ="";
          this.toggleStateModel();
          this.applyFilters();
        }
      });
    }else{
      this.toastr.error("State Name is required" , 'Error', { closeButton: true , timeOut: 3000});
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

  stateFileChange(event:any) {
    let files = event.target.files;
    this.uploadFiles(files);
  }

  uploadFiles(files:any) {
    if (this.isValidFileExtension(files)) {
      let formData: FormData = new FormData();
      formData.append("import_file", files[0], files[0].name);
      formData.append("country_id",this.country_id);
      let params = {url:"import-states"};
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
