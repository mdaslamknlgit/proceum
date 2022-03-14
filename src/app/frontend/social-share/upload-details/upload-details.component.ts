import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss']
})
export class UploadDetailsComponent implements OnInit {
  public platform_value = '';
  public publish_url_div = false;
  public publish_url = '';
  public description = '';
  public imageSrc = [];
  public valid_files = [];
  publish_date = new Date('');
  today_date = new Date();
  min_date = new Date(
    this.today_date.getFullYear(),
    this.today_date.getMonth() - 1,
    this.today_date.getDate()
  );
  public bucket_url = '';
  constructor(private activatedRoute: ActivatedRoute,private http: CommonService, private toster: ToastrService, public translate: TranslateService) {this.translate.setDefaultLang(this.http.lang);}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      if(param.upload_id != undefined){
        let params={url: 'social-share/'+param.upload_id+'/edit'};
        this.http.get(params).subscribe((res: Response) => {
          if (res['error'] == false) {
            let data = res['data']['social_share_details'];
            this.platform_value = data['platform'];
            this.bucket_url = res['data']['bucket_url'];
            if(this.platform_value == 'WHATSAPP'){
              this.publish_url_div = false;
            }else{
              this.publish_url_div = true;
            }
            let published_date = data['published_date'].split('-');
            this.publish_date = new Date(
              Number(published_date[2]),
              Number(published_date[1]) - 1,
              Number(published_date[0])
            );
            this.publish_url = data['published_url']?data['published_url']:'';
            this.description = data['description']?data['description']:'';
            data['attachments_csv'].forEach((file_path) => {
              this.imageSrc.push(this.bucket_url + file_path);
              this.valid_files.push(file_path);
            });
          }
        });
      }
    });  
  }

  changePlatform(){
    this.publish_url = '';
    if(this.platform_value == 'WHATSAPP'){
      this.publish_url_div = false;
    }else{
      this.publish_url_div = true;
    }
  }

  autoGrowTextZone(e) {
    if(e.target.scrollHeight > 60){
      e.target.style.height = "0px";
      e.target.style.height = (e.target.scrollHeight)+"px";
    }
  }

  uploadFiles(event) {
    let allowed_types = [];
    allowed_types = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];
    let files = event.target.files;
    if (files.length == 0) return false;
    for (var i = 0; i < files.length; i++) {
      let ext = files[i].name.split('.').pop().toLowerCase();
      if (allowed_types.includes(ext)) {
        let size = files[i].size;
        size = Math.round(size / 1024);
        if(size > 2048){
          let size_of_file = '';
          this.translate.get('student.socialshare.upload_details.size_of_file').subscribe((data)=> {
            size_of_file = data;
          });
          let max_allowed_size_2mb = '';
          this.translate.get('student.socialshare.upload_details.max_allowed_size_2mb').subscribe((data)=> {
            max_allowed_size_2mb = data;
          });
          this.toster.error(
            ext +
            size_of_file +
              files[i].name +
              max_allowed_size_2mb
          );
        } else {
          this.valid_files.push(files[i]);
          const reader = new FileReader();
          reader.readAsDataURL(files[i]);
          reader.onload = (event) => {
              this.imageSrc.push(reader.result);
          }
        }
      } else {
        let extension_not_allowed = '';
          this.translate.get('student.socialshare.upload_details.extension_not_allowed').subscribe((data)=> {
            extension_not_allowed = data;
          });
          let not_uploaded = '';
          this.translate.get('student.socialshare.upload_details.not_uploaded').subscribe((data)=> {
            not_uploaded = data;
          });
        this.toster.error(
          ext +
          extension_not_allowed +
            files[i].name +
            not_uploaded
        );
      }
    }
  }

  removeFile(index) {
    this.valid_files.splice(index, 1);
    this.imageSrc.splice(index, 1);
  }

  createSocialSharing(){
    if (this.publish_url != '') {
      var regExp = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
      var match = this.publish_url.match(regExp);
      if (!match) {
        let invalid_publish_url = '';
        this.translate.get('student.socialshare.upload_details.invalid_publish_url').subscribe((data)=> {
          invalid_publish_url = data;
        });
        this.toster.error(invalid_publish_url, "Error", {
          closeButton: true
      });
        return false;
      }
    }

    if (this.imageSrc.length == 0) {
      let please_upload_screenshots = '';
        this.translate.get('student.socialshare.upload_details.please_upload_screenshots').subscribe((data)=> {
          please_upload_screenshots = data;
        });
      this.toster.error(please_upload_screenshots, "Error", {
          closeButton: true
      });
      return false;
    }
    let filesData = this.valid_files;
    const formData = new FormData();
    formData.append('platform', this.platform_value);
    formData.append('published_date', JSON.stringify(this.publish_date));
    formData.append('publish_url', this.publish_url);
    formData.append('description', this.description);
    if (Object.keys(filesData).length > 0) {
      Object.keys(filesData).map(function(key) {
        formData.append('files'+key, filesData[key]);
      });
    }
    let files_length:any = this.valid_files.length;
    formData.append('files_length', files_length);
    this.activatedRoute.params.subscribe((param) => {
      if(param.upload_id != undefined){
        formData.append('upload_id', param.upload_id);
      }
    });     
    let param = {
        url: 'social-share'
    };
    this.http.imageUpload(param, formData).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', {
          closeButton: true
        });
        window.history.back()
      } else {
        this.toster.error(res['message'], 'Error', {
          closeButton: true
        });
      }
    });
  }

}
