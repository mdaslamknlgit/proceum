import { Component, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-revenue-report',
    templateUrl: './revenue-report.component.html',
    styleUrls: ['./revenue-report.component.scss']
})  
export class RevenueReportComponent implements OnInit {
   
    constructor(private http: CommonService, private toster: ToastrService) { }
    ngOnInit(): void {
       
    }
}
