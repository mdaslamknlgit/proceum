import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  public recipient_emails = '';
  public recipient_emails_list = [];
  public model_status = false;
  public shwCpncd = false;
  public show_details_modal = false;
  user: any;
  url: any = '../../../../assets/images/Demo-placeholder.jpeg';
  src: any;
  isrequired: boolean = false;
  isdisplay: boolean = true;
  user_id: string;
  errClass: string;
  imagePath: any;
  imgMessage: any;
  errPwdMsg: string;
  confirm_check: boolean = false;
  curpwd_check: boolean = true;
  newpwd_check: boolean = true;
  current_password_hide: boolean = true;
  new_password_hide: boolean = true;
  confirm_password_hide: boolean = true;
  profile: Profile = {
    first_name: '',
    last_name: '',
    email: '',
    profile_pic: '',
    current_password: '',
    new_password: '',
    confirm_pwd: '',
    referral_code: '',
    frnd_referral_code: '',
  };
  public auto_generate = false;
  public dis_frnd_referral_code = true;
  public domain: string;

  constructor(
    private http: CommonService,
    private toaster: ToastrService,
    private http1: AuthService
  ) {}
  filedata: any;
  ngOnInit(): void {
    this.domain = location.origin;
    this.src = this.url;
    this.getStudentProfile();
  }

  addEmail(){
    if(this.recipient_emails != ''){
      let recipient_emails = this.recipient_emails.split(',');  
      recipient_emails.forEach((opt, index) => {
        this.recipient_emails_list.push(opt);
      });
      this.recipient_emails = '';
    }
  }

  removeEmail(index){
    this.recipient_emails_list.splice(index, 1);
  }

  closeViewModel() {
    this.model_status = false;  
  }

  openViewModel(){
    this.model_status = true; 
  }

  sendReferral(){
    if(this.recipient_emails_list.length > 0){
      let param = { url: 'send_referral_code', recipient_emails: this.recipient_emails_list, referral_code:this.profile.referral_code, domain:this.domain};
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          this.recipient_emails_list = [];
          this.closeViewModel();
          this.toaster.success(res['message'], 'Success', { closeButton: true });
        } else {
          this.toaster.error(res['message'], 'Error', { closeButton: true });
        }
      });
    }
  }

  autoGrowTextZone(e) {
    if(e.keyCode == 13){
      this.addEmail();
      e.target.style.height = "50px";
    }else if(e.target.scrollHeight > 60){
      e.target.style.height = "0px";
      e.target.style.height = (e.target.scrollHeight)+"px";
    }
  }

  fileEvent(e) {
    this.filedata = e.target.files;
    // this.src = e.target.value;
    // console.log(this.src);

    const mimeType = this.filedata[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.imgMessage = 'Only images are supported like jpg,png,jpeg.';
      return;
    } else {
      this.imgMessage = '';
      this.src = this.url;
    }
    let size = this.filedata[0].size;
    if (size >= 256000) {
      this.imgMessage = 'Profile Picture must be less than 250kb';
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
        if (height > 250 || width > 250) {
          this.imgMessage =
            'Profile Picture height and width must be less than 250 pixels';
          this.src = this.url;
          return;
        }
      };
      this.src = reader.result;
    };
  }

  checked(e) {
    if (e.checked == true) {
      this.isrequired = true;
      //this.isdisplay = true;
    } else {
      this.isrequired = false;
      //this.isdisplay = false;
      this.profile.current_password = '';
      this.profile.new_password = '';
      this.profile.confirm_pwd = '';
    }
  }
  getStudentProfile() {
    this.user = JSON.parse(atob(localStorage.getItem('user')));
    this.user_id = this.user['id'];
    let params = {
      url: 'get-student-profile',
      id: this.user_id,
      role: this.user['role'],
    };
    this.http.post(params).subscribe((res) => {
      this.profile = {
        first_name: res['data'].first_name,
        last_name: res['data'].last_name,
        email: res['data'].email,
        profile_pic: '',
        current_password: '',
        new_password: '',
        confirm_pwd: '',
        referral_code: res['data'].referral_code?res['data'].referral_code:'',
        frnd_referral_code: res['data'].frnd_referral_code?res['data'].frnd_referral_code:'',
      };
      this.auto_generate = res['data'].referral_code?false:true;
      this.dis_frnd_referral_code = res['data'].frnd_referral_code?true:false;
      this.src = res['data'].profile_pic ? res['data'].profile_pic : this.url;
    });
  }

  passwordVerification() {
    if (this.profile.confirm_pwd != '') {
      if (this.profile.confirm_pwd !== this.profile.new_password) {
        this.confirm_check = true;
        this.errClass = 'mat-form-field-invalid';
      } else {
        this.confirm_check = false;
        this.errClass = '';
      }
    }
  }
  passwordFun(type) {
    if (type == 'new') {
      this.new_password_hide = !this.new_password_hide;
    } else if (type == 'old') {
      this.current_password_hide = !this.current_password_hide;
    } else {
      this.confirm_password_hide = !this.confirm_password_hide;
    }
  }

  updateProfile() {
    const pwdregex = new RegExp(
      '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#^()><?/:;,.])[A-Za-zd$@$!%*?&#^()><?/:;,.].{7,15}'
    );
    var myFormData = new FormData();
    if (this.isrequired) {
      let current_password = pwdregex.test(this.profile.current_password);
      let new_password = pwdregex.test(this.profile.new_password);

      if (new_password == false) {
        this.newpwd_check = false;
        return;
      }
      if (this.profile.confirm_pwd !== this.profile.new_password) {
        this.confirm_check = true;
        this.errClass = 'mat-form-field-invalid';
        // this.errClass='input-border-color';
        return;
      }
      this.errClass = '';
      this.confirm_check = false;
      myFormData.append(
        'current_password',
        this.profile.current_password.trim()
      );
      myFormData.append('new_password', this.profile.new_password.trim());
    }
    if (this.filedata && this.imgMessage == '') {
      let mimeType = this.filedata[0].type;
      let size = this.filedata[0].size;
      if (mimeType.match(/image\/*/) == null) {
        this.imgMessage = 'Only images are supported like jpg,png,jpeg.';
        return;
      }
      if (size >= 256000) {
        this.imgMessage = 'Profile Picture must be less than 250kb';
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
          if (height > 250 || width > 250) {
            this.imgMessage =
              'Profile Picture height and width must be less than 250 pixels';
            this.src = this.url;
            return;
          }
        };
      };

      this.imgMessage = '';
      myFormData.append('profile_pic', this.filedata[0]);
    } else if (this.user_id == '') {
      this.imgMessage = 'Please upload the Profile Picture';
      return;
    }
    myFormData.append('id', this.user_id);
    myFormData.append('first_name', this.profile.first_name);
    myFormData.append('last_name', this.profile.last_name);
    myFormData.append('referral_code', this.profile.referral_code);
    myFormData.append('frnd_referral_code', this.profile.frnd_referral_code);
    let param = {
      url: 'update-student-profile',
    };
    this.http.imageUpload(param, myFormData).subscribe((res) => {
      this.imgMessage = '';
      if (res['error'] == false) {
        this.toaster.success(res['message'], 'Success', { closeButton: true });
        (<HTMLFormElement>document.getElementById('profile_form')).reset();
        this.isrequired = false;
        //this.isdisplay = false;
        this.getStudentProfile();
      } else {
        this.toaster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }

  applyReferralCode() {
    let param = { url: 'apply_referral_code', frnd_referral_code: this.profile.frnd_referral_code, id: this.user_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toaster.success(res['message'], 'Success', { closeButton: true });
        this.getStudentProfile();
      } else {
        this.toaster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }
}
export interface Response {
  name: string;
  role: number;
  id: number;
}

export interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  current_password: any;
  new_password: any;
  confirm_pwd: any;
  profile_pic: string;
  referral_code: string;
  frnd_referral_code: string;
}
