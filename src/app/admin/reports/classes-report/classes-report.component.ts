import { Component, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-classes-report',
    templateUrl: './classes-report.component.html',
    styleUrls: ['./classes-report.component.scss']
})  
export class ClassesReportComponent implements OnInit {
   
    constructor(private http: CommonService, private toster: ToastrService) { }
    ngOnInit(): void {
       
    }
}
