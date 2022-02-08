import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-assessment-report',
    templateUrl: './assessment-report.component.html',
    styleUrls: ['./assessment-report.component.scss']
})
export class AssessmentReportComponent implements OnInit {
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    public page = 0;
    public pageSize = environment.page_size;
    public page_size_options = environment.page_size_options;
    public displayedColumns: string[] = ['s_no', 'name','email', 'year', 'semister', 'group', 'right', 'wrong', 'percentage', 'result', 'actions'];
    public dataSource = new MatTableDataSource();
    public report_count = 0;
    public status = 1;
    public search_key = '';
    public assessment_id = 0;
    public apiUrl = "";
    public assessment = [];
    public user = [];
    public partner_id = 0;
    constructor(private http: CommonService, public toster: ToastrService, private activatedRoute: ActivatedRoute, public translate: TranslateService) {
        this.translate.setDefaultLang(this.http.lang);
        this.apiUrl = this.http.apiURL;
     }

    ngOnInit(): void {
        this.user = this.http.getUser();
        this.partner_id = this.user['partner_id'];
        this.activatedRoute.params.subscribe(res=>{
            this.assessment_id = res.assessment_id
            if(this.assessment_id > 0){
                this.getReports();
            }
        })
        
    }
    getReports() {
        let param = { url: 'assessment/get-reports',"offset": this.page, "limit": this.pageSize, "status": this.status, "assessment_id": this.assessment_id };
        this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
            let data = res['data'];
            this.dataSource = new MatTableDataSource(data['reports']);
            this.report_count = data['report_count'];
            this.assessment = [];
            this.assessment.push(data['assessment']);
            if (this.dataSource.paginator == undefined) {
                this.dataSource.paginator = this.paginator;
            }
        } else {
            this.toster.error(res['message'], 'Error', { closeButton: true });
        }
        });
    }
    public resetFilters(){
    }
    public getServerData(event?: PageEvent) {
        this.pageSize = event.pageSize;
        this.page = (event.pageSize * event.pageIndex);
        let params={url:'assessment/get-reports',"offset": this.page, "limit": this.pageSize,"search_key": this.search_key,"status": this.status, "assessment_id": this.assessment_id};
        this.http.post(params).subscribe((res: Response) => {
            this.dataSource = new MatTableDataSource(res['data']['reports']);
            this.report_count =  res['data']['report_count'];
        });
    }
    applyFilters(){
        let params={url:'assessment/get-reports',"offset": 0, "limit": this.pageSize,"search_key": this.search_key,"status": this.status, "assessment_id": this.assessment_id};
        this.http.post(params).subscribe((res: Response) => {
        this.dataSource = new MatTableDataSource(res['data']['reports']);
        this.report_count =  res["data"]['report_count'];
        });
    }
}
