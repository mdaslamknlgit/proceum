import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  filedata: any;
  imgMsg: any;
  imgMessage: any;
  gstin_check: boolean = true;
  email_check: boolean = true;
  address_check: boolean = true;
  imagePath: any;
  mode_check: boolean = true;
  color: string;
  touchUi;
  url: any = "./assets/images/ProceumLogo.png";
  src: any;
  public model_status = false;
  systemMode: any;
  settings: any = {
    "organization_name": "",
    "contact_name": "",
    "gstin_number": "",
    "contact_number_1": "",
    "contact_number_2": "",
    "contact_email_1": "",
    "contact_email_2": "",
    "full_address": "",
    "date_format": "",
    "time_format": "",
    "list_view_limit": "",
    "theme_color": "",
  }
  constructor(
    private http: CommonService, private toaster: ToastrService,
    private http1: AuthService
  ) { }

  ngOnInit(): void {
    this.src = this.url;
    this.getSystemMode();
    this.systemMode = 'live';
  }
  fileEvent(e) {
    this.filedata = e.target.files;
    const mimeType = this.filedata[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.imgMessage = "Only images are supported like jpg,png,jpeg.";
      return;
    } else {
      this.imgMessage = "";
      this.src = this.url;
    }
    const reader = new FileReader();
    this.imagePath = this.filedata;
    reader.readAsDataURL(this.filedata[0]);
    reader.onload = (_event) => {
      this.src = reader.result;
    }
  }

  getSystemMode() {
    let params = {
      "url": 'get-mode'
    }
    this.http.post(params).subscribe((res) => {
      console.log(res['sys_mode'].value);
      this.systemMode = (res['sys_mode'].value) ? res['sys_mode'].value : "live";
    });
  }


  createSettings() {
    var myFormData = new FormData();
    if (this.settings.organization_name.trim() !== "") {
      myFormData.append('organization_name', this.settings.organization_name.trim());
    }
    //address validation
    if (this.settings.full_address.trim() === "") {
      this.address_check = false;
      return;
    }
    //logo
    if (this.filedata) {
      let mimeType = this.filedata[0].type;
      let size = this.filedata[0].size;
      if (mimeType.match(/image\/*/) == null) {
        this.imgMessage = "Only images are supported like jpg,png,jpeg.";
        return;
      }

      if (size >= 204800) {
        this.imgMessage = "logo must be less than 200kb";
        return;
      }
      this.imgMessage = "";
      myFormData.append('logo', this.filedata[0]);
    }else{
      this.imgMessage = "Please upload the logo";
        return;
    }
    let contact_email_2=(this.settings.contact_email_2)?this.settings.contact_email_2.trim():this.settings.contact_email_2;
    let contact_number_2=(this.settings.contact_number_2)?this.settings.contact_number_2.trim():this.settings.contact_number_2;
    let copy_right=(this.settings.copy_right)?this.settings.copy_right.trim():this.settings.copy_right;
    
    myFormData.append('contact_email_1', this.settings.contact_email_1.trim());
    myFormData.append('contact_email_2', contact_email_2);
    myFormData.append('contact_number_1', this.settings.contact_number_1.trim());
    myFormData.append('contact_number_2', contact_number_2);
    myFormData.append('full_address', this.settings.full_address.trim());
    myFormData.append('gstin_number', this.settings.gstin_number.trim());
    myFormData.append('contact_name', this.settings.contact_name.trim());
    myFormData.append('date_format', this.settings.date_format.trim());
    myFormData.append('time_format', this.settings.time_format.trim());
    myFormData.append('list_view_limit', this.settings.list_view_limit);
    myFormData.append('theme_color', this.settings.theme_color);
    myFormData.append('copyright_text', copy_right);

    let param = {
      'url': 'settings'
    };
    this.http.imageUpload(param, myFormData).subscribe((res) => {
      if (res['error'] == false) {
        this.toaster.success(res['message'], 'Success', {
          progressBar: true,
        });
        (<HTMLFormElement>document.getElementById('settings_form')).reset();
      } else {
        this.toaster.error(res['message'], 'Error', { progressBar: true });
      }
    });
  }
  
  toggleModel() {
    console.log(this.systemMode);
    if(this.systemMode=="live"){
      this.updateSysMode();
    }else{
      this.model_status = !this.model_status;
    }
    
  }

  updateSysMode() {
    if(this.systemMode!="live"){
      this.model_status = !this.model_status;
    }

    const user = JSON.parse(atob(sessionStorage.getItem('user')));
    if (this.systemMode === "") {
      this.mode_check = false;
      return;
    } else {
      this.mode_check = true;
    }
    let param = {
      'url': 'update-settings-mode',
      "mode": this.systemMode,
      "user_id": user.id
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toaster.success(res['message'], 'Success', {
          progressBar: true,
        });
        (<HTMLFormElement>document.getElementById('settings_form')).reset();
      } else {
        this.toaster.error(res['message'], 'Error', { progressBar: true });
      }
    });
  }

}
