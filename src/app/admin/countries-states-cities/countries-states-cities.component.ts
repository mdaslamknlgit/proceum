import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-countries-states-cities',
  templateUrl: './countries-states-cities.component.html',
  styleUrls: ['./countries-states-cities.component.scss']
})

export class CountriesStatesCitiesComponent implements OnInit {
  displayedColumns: string[] = ['s_no', 'country_name', 'language', 'currency','currency_symbal', 'status', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public num_countries: number = 0;
  public page = 0;
  public pageSize = 10;
  public sort_by: any;
  public model_status = false;
  public edit_country_model = false;
  public country_id:any;
  public maxSize: number = 5; // 5MB
  public fileExt: string = "xlsx";
  public search_txt = "";
  country: CountryDetails = { country_code:'', country_name:'', currency_text: '', currency_symbol: '', language_code: '',language:'',country_flag:'' };
  constructor(private http:CommonService,private route: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    let params={url: 'get-all-countries',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,search_txt:this.search_txt};
    this.http.post(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['countries']);
      this.num_countries = res['data']['countries_count'];
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
    let params={url: 'get-all-countries',"offset": this.page, "limit": this.pageSize, "sort_by": this.sort_by,search_txt:this.search_txt};
    this.http.post(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['countries']);
      this.num_countries = res['data']['countries_count'];
    });
  }
  
  toggleModel() {
    this.model_status = !this.model_status;
  }
  toggleCountryModel(){
    this.edit_country_model = !this.edit_country_model;
  }
  openEditModel(param:any){
    this.edit_country_model = !this.edit_country_model;
    this.country.country_code=param.country_code;
    this.country.country_name=param.country_name;
    this.country.currency_text=param.currency_text;
    this.country.currency_symbol=param.currency_symbol;
    this.country.language_code=param.language_code;
    this.country.language=param.country_language;
    this.country.country_flag=param.country_flag_icon;
    this.country_id = param.id;
  }

  public navigateTo(country_id:any) {
    this.route.navigateByUrl('/admin/countries/' +country_id);
  }

  saveCountryDetails(){
    if(this.country.country_code == "" || this.country.country_name == "" || this.country.currency_text == "" || this.country.currency_symbol == "" || this.country.language_code == "" || this.country.language == ""){
      this.toastr.error("Fields marked with * are mandatory" , 'Error', { closeButton: true , timeOut: 3000});
    }else{
      let params = { url: 'save-country',
      country_code:this.country.country_code,
      country_name:this.country.country_name,
      currency_text:this.country.currency_text,
      currency_symbol:this.country.currency_symbol,
      language_code:this.country.language_code,
      language:this.country.language,
      country_flag:this.country.country_flag};

      this.http.post(params).subscribe((res: Response) => {
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

  updateCountryDetails(){

    if(this.country.country_code == "" || this.country.country_name == "" || this.country.currency_text == "" || this.country.currency_symbol == "" || this.country.language_code == "" || this.country.language == ""){
      this.toastr.error("Fields marked with * are mandatory" , 'Error', { closeButton: true , timeOut: 3000});
    }else{
      let params = { url: 'update-country',
      country_code:this.country.country_code,
      country_name:this.country.country_name,
      currency_text:this.country.currency_text,
      currency_symbol:this.country.currency_symbol,
      language_code:this.country.language_code,
      language:this.country.language,
      country_flag:this.country.country_flag,
      country_id:this.country_id
    };

      this.http.post(params).subscribe((res: Response) => {
        if (res.error) {
          this.toastr.error(res.message , 'Error', { closeButton: true , timeOut: 3000});
        }else{
          this.toastr.success(res.message , 'Success', { closeButton: true , timeOut: 3000});
          this.toggleCountryModel();
          this.applyFilters();
        }
      });

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

  onCountrySelected(event:any){

  }

  countryFileChange(event:any) {
    let files = event.target.files;
    this.uploadFiles(files);
  }

  uploadFiles(files:any) {
    if (this.isValidFileExtension(files)) {
      let formData: FormData = new FormData();
      formData.append("import_file", files[0], files[0].name);
      let params = {url:"import-countries"};
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

export interface CountryDetails {
  country_code:string;
  country_name:string;
  currency_text: string;
  currency_symbol: string;
  language_code:string;
  language:string;
  country_flag:string;
}

