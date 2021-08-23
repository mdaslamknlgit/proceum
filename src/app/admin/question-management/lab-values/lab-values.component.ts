import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-lab-values',
    templateUrl: './lab-values.component.html',
    styleUrls: ['./lab-values.component.scss']
})  
export class LabValuesComponent implements OnInit {
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
    constructor(private http: CommonService, private toster: ToastrService) { }
    ngOnInit(): void {
        
    }
    public headingFilter(){
        const filterValue = this.heading.toLowerCase();
        this.headings = this.all_headings.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    public subHeadingFilter(){
        const filterValue = this.sub_heading.toLowerCase();
        this.sub_headings = this.all_sub_headings.filter(option => option.name.toLowerCase().includes(filterValue));
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
              this.toster.success(res['message'], 'Success', { closeButton: true });
             } else {
              this.toster.error(res['message'], 'Error', { closeButton: true });
            }
          });
    }
}
