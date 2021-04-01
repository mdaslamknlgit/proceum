import { Component, OnInit, Inject } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-custom-pages',
  templateUrl: './custom-pages.component.html',
  styleUrls: ['./custom-pages.component.scss']
})
export class CustomPagesComponent implements OnInit {
  isRequired:boolean=true;
  isMenuRequired:boolean=true;
customPage={
"old_Page_name":"",
"new_Page_name":"",
"new_menu_name":"",
"old_menu_name":"",
"isNewPageChecked":"",
"isNewMenuChecked":"",
"isShowChecked":"",
"Page_content":"",
};
public Editor = ClassicEditor;
  constructor(
    private http: CommonService,private toaster: ToastrService
    ) { }

  ngOnInit(): void {
  }

  checked(e){
    console.log(e);
    if(e.checked){
      this.isRequired=false;
    }else{
      this.isRequired=true;
    }
  }
  
  newMenuChecked(e){
    if(e.checked){
      this.isMenuRequired=false;
    }else{
      this.isMenuRequired=true;
    }
  }
  onSubmit(){
    console.log(this.customPage);

    let params={
      'url':'custom-page',      
      'page_name':(this.customPage.isNewPageChecked)?this.customPage.new_Page_name:this.customPage.old_Page_name,      
      'menu_name':(this.customPage.isNewMenuChecked)?this.customPage.new_menu_name:this.customPage.old_menu_name,      
      'page_content': this.customPage.Page_content,      
      'status': this.customPage.isShowChecked,      
    };
    
    this.http.post(params).subscribe((res) => {
      console.log(res);
      if(res['error'] == false){
        this.toaster.success(res['message'], 'Success', {
          progressBar: true,
        });
        // (<HTMLFormElement>document.getElementById('settings_form')).reset();
      }else{
        this.toaster.error(res['message'], 'Error', { progressBar: true });
      }
    }); 
  }

}
