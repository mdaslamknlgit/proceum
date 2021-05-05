import { Component, OnInit, Inject } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { UploadAdapter } from '../UploadAdapter';

@Component({
  selector: 'app-create-custom-pages',
  templateUrl: './create-custom-pages.component.html',
  styleUrls: ['./create-custom-pages.component.scss']
})
export class CreateCustomPagesComponent implements OnInit {
  isPageRequired: boolean = true;
  isMenuRequired: boolean = true;
  isMenuDisplay: boolean = true;
  isPageDisplay: boolean = true;
  customPage = {
    "old_page_name": "",
    "new_page_name": "",
    "new_menu_name": "",
    "old_menu_name": "",
    "isShowChecked": "",
    "page_content": "",
  };
  public Editor = ClassicEditor;
  menuList: any;
  pagesList: any;
  constructor(
    private http: CommonService, private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.getMenusAndPages();
  }
  htmlEditorConfig = {
    mediaEmbed: {
        previewsInData: true
    }
}

  getMenusAndPages() {
    let params = {
      "url": "get-menu-pages"
    };
    this.http.post(params).subscribe((res) => {
      this.menuList = res['menu'];
    });
  }

  getPages(){
    this.pagesList =[];
    let params = {
      "url": "pages",
      'parent_id':this.customPage.old_menu_name
    };
    this.http.post(params).subscribe((res) => {
      this.pagesList = res['pages'];
    });
  }

  selectPage() {
    if (this.customPage.old_page_name != "") {
      this.isPageDisplay = false;
      this.isPageRequired = false;
      this.customPage.new_page_name="";
    } else {
      this.isPageRequired = true;
      this.isPageDisplay = true;
    }
  }

  selectMenu() {
    if (this.customPage.old_menu_name != "") {
      this.isMenuDisplay = false;
      this.isMenuRequired = false;
      this.customPage.new_menu_name="";
    } else {
      this.isMenuRequired = true;
      this.isMenuDisplay = true;
    }
  this.getPages();
  }
  
  onReady(eventData) {
    let apiUrl = environment.apiUrl;
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
        var data =new UploadAdapter(loader,apiUrl+'upload-image');
        return data;
    };
  }

  createCustomPage() {
    let i=0;
    if (this.isMenuRequired) {
      if(this.customPage.new_menu_name.trim()==""){
        this.customPage.new_menu_name=this.customPage.new_menu_name.trim();
        i++;
      }
    }
    if (this.isPageRequired) {
      if(this.customPage.new_page_name.trim()==""){
        this.customPage.new_page_name=this.customPage.new_page_name.trim();
        i++;
      }
    }
    if(i!=0){
      return;
    }
    let params = {
      'url': 'create-page',
      'page_name': (this.customPage.old_page_name) ? this.customPage.old_page_name : this.customPage.new_page_name,
      'menu_name': (this.customPage.old_menu_name) ? this.customPage.old_menu_name : this.customPage.new_menu_name,
      'menu_check': (this.isMenuRequired) ? false : true,
      'page_check': (this.isPageRequired) ? true : false,
      'page_content': this.customPage.page_content,
      'show_menu': (this.customPage.isShowChecked) ? this.customPage.isShowChecked : false,
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toaster.success(res['message'], 'Success', { closeButton: true });
        this.isMenuRequired = true;
        this.isMenuDisplay = true;
        this.isPageRequired = true;
        this.isPageDisplay = true;
        (<HTMLFormElement>document.getElementById('custom_page_form')).reset();
        this.getMenusAndPages();
      } else {
        this.toaster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }
}


