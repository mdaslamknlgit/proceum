import { Component, OnInit} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-analysis-report',
    templateUrl: './analysis-report.component.html',
    styleUrls: ['./analysis-report.component.scss']
})  
export class AnalysisReportComponent implements OnInit {
   
    constructor(private http: CommonService, private toster: ToastrService) { }
    ngOnInit(): void {
       
    }
}
