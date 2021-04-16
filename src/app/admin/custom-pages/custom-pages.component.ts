import { Component, OnInit, Inject } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { UploadAdapter } from './UploadAdapter';

@Component({
  selector: 'app-custom-pages',
  templateUrl: './custom-pages.component.html',
  styleUrls: ['./custom-pages.component.scss']
})
export class CustomPagesComponent implements OnInit {
  isRequired: boolean = true;
  isMenuRequired: boolean = true;
  isMenuDisplay: boolean = true;
  isPageDisplay: boolean = true;
  customPage = {
    "old_page_name": "",
    "new_page_name": "",
    "new_menu_name": "",
    "old_menu_name": "",
    "isNewPageChecked": "",
    "isNewMenuChecked": "",
    "isShowChecked": "",
    "Page_content": "",
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
  getMenusAndPages() {
    let params = {
      "url": "menu-pages"
    };
    this.http.post(params).subscribe((res) => {
      this.menuList = res['menu'];
      this.pagesList = res['pages'];
      console.log(res['menu']);
    });
  }
  selectPage() {
    if (this.customPage.old_page_name != "") {
      this.isPageDisplay = false;
      this.isRequired = false;
    } else {
      this.isRequired = true;
      this.isPageDisplay = true;
    }
  }
  selectMenu() {
    if (this.customPage.old_menu_name != "") {
      this.isMenuDisplay = false;
      this.isMenuRequired = false;
    } else {
      this.isMenuRequired = true;
      this.isMenuDisplay = true;
    }

  }

  onReady(eventData) {
    let apiUrl = environment.apiUrl;
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
        var data =new UploadAdapter(loader,apiUrl+'upload-image');
        return data;
    };
  }

  createCustomPage() {
    if (this.customPage.Page_content == "") {
      this.toaster.error("page content is required", 'Error', { progressBar: true });
      return;
    }
    let params = {
      'url': 'create-page',
      'page_name': (this.customPage.old_page_name) ? this.customPage.old_page_name : this.customPage.new_page_name,
      'page_checked': this.customPage.isNewPageChecked,
      'menu_name': (this.customPage.old_menu_name) ? this.customPage.old_menu_name : this.customPage.new_menu_name,
      'menu_check': (this.customPage.old_menu_name) ? true : false,
      'page_content': this.customPage.Page_content,
      'show_menu': (this.customPage.isShowChecked) ? this.customPage.isShowChecked : false,
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toaster.success(res['message'], 'Success', {
          progressBar: true,
        });
        this.isMenuRequired = true;
        this.isMenuDisplay = true;
        this.isRequired = true;
        this.isPageDisplay = true;
        (<HTMLFormElement>document.getElementById('custom_page_form')).reset();
        this.getMenusAndPages();
      } else {
        this.toaster.error(res['message'], 'Error', { progressBar: true });
      }
    });
  }
}