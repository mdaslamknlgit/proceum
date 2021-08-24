import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
    selector: 'app-lab-values',
    templateUrl: './lab-values.component.html',
    styleUrls: ['./lab-values.component.scss']
})  
export class LabValuesComponent implements OnInit {
    public displayedColumns: string[] = ['s_no', 'heading', 'sub_heading', 'name', 'ref_range', 'si_reference', 'actions'];
    //public dataSource = ELEMENT_DATA;
    public dataSource = new MatTableDataSource();
    public heading = '';
    public headings = [];
    public all_headings = [{pk_id:1, name: "one"}, {pk_id:2, name: "two"}, {pk_id:3, name: "three"}];
    public sub_heading = '';
    public sub_headings = [];
    public all_sub_headings = [];
    public parameter_name = '';
    public ref_range = '';
    public si_ref = '';
    public lab_value_id = 0;
    public values_count = 0;
    public pageSize = environment.page_size;
    public page = 0;
    public page_size_options = environment.page_size_options;
    public search_key = '';
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(private http: CommonService, private toster: ToastrService) { }
    ngOnInit(): void {
        let params = {url: 'get-lab-values',"offset": 0, "limit": this.pageSize};
        this.http.post(params).subscribe((res) => {
            if (res['error'] == false) {
                this.dataSource = new MatTableDataSource(res['data']['values']);
                this.values_count =  res['values_count'];
                this.dataSource.paginator = this.paginator;
            }
        });
    }
    applyFilters(){
        let params = {url: 'get-lab-values',"offset": 0, "limit": this.pageSize, search: this.search_key};
        this.http.post(params).subscribe((res) => {
            if (res['error'] == false) {
                this.dataSource = new MatTableDataSource(res['data']['values']);
                this.values_count =  res['values_count'];
                this.dataSource.paginator = this.paginator;
            }
        });
    }
    public headingFilter(){
        const filterValue = this.heading.toLowerCase();
        this.headings = this.all_headings.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    public subHeadingFilter(){
        const filterValue = this.sub_heading.toLowerCase();
        this.sub_headings = this.all_sub_headings.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    public getServerData(event?: PageEvent) {
        this.pageSize = event.pageSize;
        this.page = (event.pageSize * event.pageIndex);
        let params={url:'get-lab-values',"offset": this.page, "limit": this.pageSize};
        this.http.post(params).subscribe((res: Response) => {
            this.dataSource = new MatTableDataSource(res['data']['values']);
            this.values_count =  res['values_count'];
        });
        
    }
    saveValues(){
        let param = {
            url: 'store-lab-values',
            heading: this.heading,
            sub_heading: this.sub_heading,
            parameter_name: this.parameter_name,
            ref_range: this.ref_range,
            si_ref: this.si_ref,
            lab_value_id: this.lab_value_id
          };
          this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.parameter_name = '';
                this.ref_range = '';
                this.si_ref = '';
                this.toster.success(res['message'], 'Success', { closeButton: true });
             } else {
              this.toster.error(res['message'], 'Error', { closeButton: true });
            }
          });
    }
    editValues(element){
        this.heading = element['heading'];
        this.sub_heading = element['sub_heading'];
        this.parameter_name = element['parameter_name'];
        this.ref_range = element['ref_range'];
        this.si_ref = element['si_reference'];
        this.lab_value_id = Number(element['id']);

    }
}
