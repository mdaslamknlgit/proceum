import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  filedata: any;
  imgMessage: any;
  gstin_check: boolean = true;
  email_check: boolean = true;
  address_check: boolean = true;
  imagePath: any;
  mode_check: boolean = true;
  color: string;
  touchUi;
  url: any = "./assets/images/sample_logo.png";
  src: any;
  public model_status = false;
  systemMode: any;
  organization_name_check:boolean;
  contact_name_check:boolean;
  data:any;
  id:string='';
  ischecked:boolean;
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
    this.getSettingsList();
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
    let size = this.filedata[0].size;
    if (size >= 256000) {
      this.imgMessage = "Logo must be less than 250kb";
      return;
    }
    const reader = new FileReader();
    this.imagePath = this.filedata;
    reader.readAsDataURL(this.filedata[0]);
    reader.onload = (_event) => {
      
      const img = new Image();
      img.src = reader.result as string;
        img.onload = () => {
          const height = img.naturalHeight;
          const width = img.naturalWidth;
          if(height > 250 || width > 250)
          {
            this.imgMessage = "System Logo height and width must be less than 250 pixels";
            this.src = this.url;
            return;
          }
        };
        this.src = reader.result;
    }
  }

  getSystemMode() {
    let params = {
      "url": 'get-system-mode'
    }
    this.http.post(params).subscribe((res) => {
     // this.systemMode = (res['sys_mode'].value == "maintenance") ? true : false;
     this.ischecked=(res['sys_mode'].value == "maintenance") ? true : false;
    });
  }
  
  getSettingsList() {
    let param = { url: 'settings-list'};
    this.http.post(param).subscribe((res: Response) => {
      this.data=res['settings'].organization_name;
      if(this.data){
      this.settings = {
        "organization_name": res['settings'].organization_name,
        "contact_name": res['settings'].contact_name,
        "gstin_number": res['settings'].gstin_number,
        "contact_number_1": res['settings'].contact_number_1,
        "contact_number_2":  (res['settings'].contact_number_2 == "null")?'':res['settings'].contact_number_2,
        "contact_email_1": res['settings'].contact_email_1,
        "contact_email_2":  (res['settings'].contact_email_2 == "null")?'':res['settings'].contact_email_2,
        "full_address": res['settings'].full_address,
        "date_format": res['settings'].date_format,
        "time_format": res['settings'].time_format,
        "list_view_limit": res['settings'].list_view_limit,
        "theme_color": res['settings'].theme_color,
        "copy_right": (res['settings'].copyright_text == "undefined" ||res['settings'].copyright_text == "null")?'':res['settings'].copyright_text,
      };
      this.src = res['settings'].logo_path;
      this.id = res['settings'].pk_id;
    }
    });
  }

  saveSettings() {
    var myFormData = new FormData();
    let i=0;
    if (this.settings.organization_name.trim() !== "") {
      myFormData.append('organization_name', this.settings.organization_name.trim());
    }else{
      this.settings.organization_name=this.settings.organization_name.trim();
    i++;
    }
    //address validation
    if (this.settings.contact_name.trim() !== "") {
      myFormData.append('contact_name', this.settings.contact_name.trim());
    }else{
      this.settings.contact_name=this.settings.contact_name.trim();
      i++;
    }
    //address validation
    if (this.settings.full_address.trim() === "") {
      this.settings.full_address=this.settings.full_address.trim();
      i++;
    }
    if(i!=0){
      return;
    }
    //logo
    
      if (this.filedata && this.imgMessage == '') {
        let mimeType = this.filedata[0].type;
        let size = this.filedata[0].size;
        if (mimeType.match(/image\/*/) == null) {
          this.imgMessage = "Only images are supported like jpg,png,jpeg.";
          return;
        }

        if (size >= 256000) {
          this.imgMessage = "Logo must be less than 250kb";
          return;
        }

        const reader = new FileReader();
        this.imagePath = this.filedata;
        reader.readAsDataURL(this.filedata[0]);
        reader.onload = (_event) => {          
          const img = new Image();
          img.src = reader.result as string;
            img.onload = () => {
              const height = img.naturalHeight;
              const width = img.naturalWidth;
              if(height > 250 || width > 250)
              {
                this.imgMessage = "System Logo height and width must be less than 250 pixels";
                this.src = this.url;
                return;
              }
            };
        }

        this.imgMessage = "";
        myFormData.append('logo', this.filedata[0]);
      }else if(this.id == ""){
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
    myFormData.append('date_format', this.settings.date_format.trim());
    myFormData.append('time_format', this.settings.time_format.trim());
    myFormData.append('list_view_limit', this.settings.list_view_limit);
    myFormData.append('theme_color', this.settings.theme_color);
    myFormData.append('copyright_text', copy_right);
    myFormData.append('id', this.id);

    let param = {
      'url': 'create-settings'
    };
    this.http.imageUpload(param, myFormData).subscribe((res) => {
      this.imgMessage = "";
      if (res['error'] == false) {
        this.toaster.success(res['message'], 'Success', { closeButton: true });
        this.src = this.url;
        this.getSettingsList();
      } else {
        this.toaster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }
  
  openModel(e) {
    if(e.checked == true){
      this.systemMode=true;
      this.ischecked=true;
      this.model_status = true;
    }else{
      this.systemMode=false;
      this.ischecked=false;
      this.updateSysMode();
    }
  }
  closeModel() {
      this.model_status = false;
      this.ischecked=false;
  }

  updateSysMode() {
    let mode= (this.systemMode == true) ? "maintenance" : "live";
    this.model_status =false;
    const user = JSON.parse(atob(sessionStorage.getItem('user')));
    let param = {
      'url': 'update-system-mode',
      "mode": mode,
      "user_id": user.id,
      "role_id":user.role
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toaster.success(res['message'], 'Success', { closeButton: true });
        this.getSystemMode();
      } else {
        this.toaster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }
}
