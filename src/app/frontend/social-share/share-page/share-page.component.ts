import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-share-page',
  templateUrl: './share-page.component.html',
  styleUrls: ['./share-page.component.scss']
})
export class SharePageComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'platform','datetime','aproval_status','earned','consumed','actions'];
  dataSource = new MatTableDataSource();
  public model_status = false;
  public view_platform = '';
  public view_uploaded_date = '';
  public view_uploaded_url = '';
  public view_attachments = [];
  public bucket_url = '';
  public approved_count = 0;

  constructor(private http: CommonService, private toster: ToastrService, public translate: TranslateService) {this.translate.setDefaultLang(this.http.lang);}

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(){
    let params={url: 'social-share'};
    this.http.get(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['social_share_list']);
      this.bucket_url = res['data']['bucket_url'];
      this.approved_count = res['data']['social_share_list'].filter(i => (i.approval_status == 1 && i.credits_consumed == 0)).length;
    });
  }

  closeViewModel() {
    this.model_status = false;  
  }

  openViewModel(param:any){
    this.model_status = true;     
    this.view_platform = param.platform;
    this.view_uploaded_date = param.published_date;
    this.view_uploaded_url = param.published_url;  
    this.view_attachments = []; 
    param.attachments_csv.forEach((file_path) => {
      this.view_attachments.push(this.bucket_url + file_path);
    });
  }

  deleteRecord(id){
    let param = {
      url: 'social-share/'+id,
    };
    this.http.delete(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.applyFilters();
      } else {
        this.toster.error(res['message'], 'Error', {
          closeButton: true,
        });
      }
    });
  }

}
