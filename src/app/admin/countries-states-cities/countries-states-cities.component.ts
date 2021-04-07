import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-countries-states-cities',
  templateUrl: './countries-states-cities.component.html',
  styleUrls: ['./countries-states-cities.component.scss']
})

export class CountriesStatesCitiesComponent implements OnInit {
  displayedColumns: string[] = ['s_no', 'country_name', 'language', 'currency', 'status', 'action'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public num_rows: number = 0;
  public page = 0;
  public pageSize = 10;
  public sort_by: any;
  public model_status = false;
  public edit_country_model = false;
  country: Country = { country_code:'', country_name:'', currency_text: '', currency_symbol: '', language_code: '',language:'',country_flag:'' };
  constructor(private http:CommonService,private route: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    let params={
      url: 'get-all-countries'
    };
    this.http.get(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['countries']);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilters(){
    let params={
      url: 'get-all-countries'
    };
    this.http.get(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['countries']);
    });
  }
  
  toggleModel() {
    this.model_status = !this.model_status;
  }
  openEditModel(param){
    this.edit_country_model = !this.edit_country_model;
    this.country.country_code=param.country_code;
    this.country.country_name=param.country_name;
    this.country.currency_text=param.currency_text;
    this.country.currency_symbol=param.currency_symbol;
    this.country.language_code=param.language_code;
    this.country.language=param.country_language;
    this.country.country_flag=param.country_flag_icon;
  }

  public navigateTo(country_id:any) {
    let param = { url: 'curriculum/' + country_id };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.route.navigateByUrl(
          '/admin/countries/' +
          country_id
        );
      }
    });
  }

  saveCountryDetails(){
    console.log(this.country.currency_symbol);
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

export interface Country {
  country_code:string;
  country_name:string;
  currency_text: string;
  currency_symbol: string;
  language_code:string;
  language:string;
  country_flag:string;
}

