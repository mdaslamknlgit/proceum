import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-social-approval',
  templateUrl: './social-approval.component.html',
  styleUrls: ['./social-approval.component.scss']
})
export class SocialApprovalComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'username','email','phone','platform','datetime','aproval_status','actions'];
  dataSource = new MatTableDataSource();
  public model_status = false;
  public upload_id = 0;
  public view_platform = '';
  public view_uploaded_date = '';
  public view_uploaded_url = '';
  public view_attachments = [];
  public bucket_url = '';

  constructor(private http: CommonService, private toster: ToastrService) { }

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(){
    let params={url: 'social-share'};
    this.http.get(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['social_share_list']);
      this.bucket_url = res['data']['bucket_url'];
    });
  }

  closeViewModel() {
    this.model_status = false;  
  }

  openViewModel(param:any){
    this.model_status = true;   
    this.upload_id = param.id;
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

  public changeApprovalStatus(status){
    let param = {
      url: 'change-approval-status',
      id: this.upload_id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.closeViewModel();
        this.applyFilters();
      } else {
        this.toster.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });   
  }

}
