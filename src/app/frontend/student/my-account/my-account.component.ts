import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import {NgForm} from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  user:any;
  url:any="../../../../assets/images/Demo-placeholder.jpeg";
  src:any;
  isrequired:boolean=false;
  isdisplay:boolean=false;
  user_id:string;
  imagePath:any;
  imgMessage:any;
  errPwdMsg:string;
  confirm_check:boolean=true;
  curpwd_check:boolean=true;
  newpwd_check:boolean=true;
  new_password_hide: boolean = true;
  confirm_password_hide: boolean = true;
  profile:Profile={
    "first_name":'',
    "last_name":'',
    "email":'',
    "profile_pic":'',
    "current_password": '',
    "new_password":'',
    "confirm_pwd":'',
  };
  
  constructor(
    private http: CommonService,private toaster: ToastrService,
    private http1:  AuthService
    ) {}
  filedata:any;
  ngOnInit(): void {
    this.src=this.url;
      this.getStudentProfile() ; 
  }

  fileEvent(e){
    this.filedata = e.target.files;
    // this.src = e.target.value;
    // console.log(this.src);
    
    const mimeType = this.filedata[0].type;
    if (mimeType.match(/image\/*/) == null) {
        this.imgMessage = "Only images are supported like jpg,png,jpeg.";
        return;
    }else{
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

  checked(e){
    if(e.checked == true){
      this.isrequired=true;
      this.isdisplay=true;
    }else{
      this.isrequired=false;
      this.isdisplay=false;
    }
  }
  getStudentProfile(){
    this.user= JSON.parse(atob(sessionStorage.getItem('user')));
    this.user_id=this.user['id'];
    let params={
      'url':'student-profile',
      'id':this.user_id,
      'role':this.user['role']      
    }
    this.http.post(params).subscribe((res) => {
        this.profile = {
          "first_name":res['data'].first_name,
          "last_name":res['data'].last_name,
          "email":res['data'].email,
          "profile_pic":'',
          "current_password": '',
          "new_password":'',
          "confirm_pwd":'',
        };  
        this.src=(res['data'].profile_pic)?res['data'].profile_pic:this.url;
    });
  }
  passwordFun(type) {
    if(type== 'new'){
    this.new_password_hide = !this.new_password_hide;
    }else{
      this.confirm_password_hide = !this.confirm_password_hide;
    }
  }

  updateProfile() {
    const pwdregex = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#^()><?/:;,.])[A-Za-z\d$@$!%*?&#^()><?/:;,.].{7,15}');
    var myFormData = new FormData();
    if(this.isrequired){
      let current_password = pwdregex.test(this.profile.current_password);
      let new_password = pwdregex.test(this.profile.new_password);

      if(new_password == false ){
        this.newpwd_check = false;
        return;
      }
      if( this.profile.confirm_pwd !==  this.profile.new_password){
        this.confirm_check = true;
        return;
      }     
      this.confirm_check = false;
      myFormData.append('current_password', this.profile.current_password.trim());
      myFormData.append('new_password', this.profile.new_password.trim());
    }
    if(this.filedata){
        let mimeType = this.filedata[0].type;
        let size = this.filedata[0].size;
        if (mimeType.match(/image\/*/) == null) {
            this.imgMessage = "Only images are supported like jpg,png,jpeg.";
            return;
        }
        if(size >= 256000){
          this.imgMessage = "Profile image must be less than 250kb";
          return;
        }
          this.imgMessage = "";
          myFormData.append('profile_pic', this.filedata[0]);            
    }
    myFormData.append('id',   this.user_id);
    myFormData.append('first_name',   this.profile.first_name);
    myFormData.append('last_name',   this.profile.last_name);
    let param={
      'url':'update-student-profile'
    };
    this.http.imageUpload(param,myFormData).subscribe((res) => {
      if(res['error'] ==false){
        this.toaster.success(res['message'], 'Success', {
          progressBar: true,
        });
        (<HTMLFormElement>document.getElementById('profile_form')).reset();
        this.isrequired=false;
        this.isdisplay=false;
        this.getStudentProfile();
      }else{
        this.toaster.error(res['message'], 'Error', { progressBar: true });
      }
    }); 
  }

}
export interface Response {
  name:string;
  role: number;
  id:number;
}

export interface Profile {
  first_name:string;
  last_name:string;
  email: string;
  current_password: any;
  new_password: any;
  confirm_pwd:any;
  profile_pic:string;
  
}