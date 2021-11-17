import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-material-description',
  templateUrl: './material-description.component.html',
  styleUrls: ['./material-description.component.scss']
})
export class MaterialDescriptionComponent implements OnInit {
  public material_id = 0;
  public materials = [];
  public bucket_url = '';
  public curriculumn = '';
  public breadcome = [];
  hrefZIP: string;
  description:any=[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: CommonService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.material_id = param.material_id != undefined ? param.material_id : 0;
      let params={url: 'get-all-materials',material_id: this.material_id};
      this.http.post(params).subscribe((res: Response) => {
        if (res['error'] == false) {
          this.materials = res['data']['materials'];
          this.bucket_url = res['data']['bucket_url'];
          this.breadcome = res['data']['breadcome'];
          //console.log(this.breadcome);
          this.hrefZIP = environment.apiUrl + 'download-attachments/' + this.material_id;
          this.curriculumn = res['data']['curriculum'];
          this.description=this.sanitizer.bypassSecurityTrustHtml(this.materials[0]['description']);
        } else {
          this.materials = [];
        }
      });
    });
  }

}
