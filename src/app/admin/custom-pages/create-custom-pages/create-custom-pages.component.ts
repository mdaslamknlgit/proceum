import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-create-custom-pages',
  templateUrl: './create-custom-pages.component.html',
  styleUrls: ['./create-custom-pages.component.scss'],
})
export class CreateCustomPagesComponent implements OnInit {
  isPageRequired: boolean = true;
  isMenuRequired: boolean = true;
  isMenuDisplay: boolean = true;
  isPageDisplay: boolean = true;
  customPage = {
    old_page_name: '',
    new_page_name: '',
    new_menu_name: '',
    old_menu_name: '',
    isShowChecked: '',
    page_content: '',
  };
  public Editor;
  menuList: any;
  pagesList: any;
  constructor(
    private http: CommonService, private toaster: ToastrService,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.getMenusAndPages();
  }
  htmlEditorConfig = environment.editor_config;

  getMenusAndPages() {
    let params = {
      url: 'get-menu-pages',
    };
    this.http.post(params).subscribe((res) => {
      this.menuList = res['menu'];
    });
  }

  getPages() {
    this.pagesList = [];
    let params = {
      url: 'pages',
      parent_id: this.customPage.old_menu_name,
    };
    this.http.post(params).subscribe((res) => {
      this.pagesList = res['pages'];
    });
  }

  selectPage() {
    if (this.customPage.old_page_name != '') {
      this.isPageDisplay = false;
      this.isPageRequired = false;
      this.customPage.new_page_name="";
      let params = {
        "url": 'get-page-content',
        'pk_id':this.customPage.old_page_name
      };
      this.http.post(params).subscribe((res) => {
        this.customPage.page_content=res['content'];
        this.customPage.isShowChecked=(res['show_menu'])?'checked':'';
      });
    } else {
      this.isPageRequired = true;
      this.isPageDisplay = true;
      this.customPage.page_content="";
    }
  }

  selectMenu() {
    if (this.customPage.old_menu_name != '') {
      this.isMenuDisplay = false;
      this.isMenuRequired = false;
      this.customPage.new_menu_name = '';
    } else {
      this.isMenuRequired = true;
      this.isMenuDisplay = true;
      this.customPage.page_content="";
      this.customPage.old_page_name="";
      this.pagesList=[];
      this.isPageRequired=true;
      this.isPageDisplay = true;
    }
    this.getPages();
  }

  onReady(event){
    event.editor.on( 'fileUploadRequest', function( evt ) {
        var xhr = evt.data.fileLoader.xhr;
        var fileLoader = evt.data.fileLoader;
        xhr.open( 'POST', fileLoader.uploadUrl, true );
        
        xhr = fileLoader.xhr;
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('_token'));
        var formData = new FormData();
        formData.append( 'file0', fileLoader.file);
        formData.append("number_files", '1');
        formData.append("path", 'images/content_images');
        fileLoader.xhr.send( formData );
        evt.stop();
    } );
}

  createCustomPage() {
    let i = 0;
    if (this.isMenuRequired) {
      if (this.customPage.new_menu_name.trim() == '') {
        this.customPage.new_menu_name = this.customPage.new_menu_name.trim();
        i++;
      }
    }
    if (this.isPageRequired) {
      if (this.customPage.new_page_name.trim() == '') {
        this.customPage.new_page_name = this.customPage.new_page_name.trim();
        i++;
      }
    }
    if (i != 0) {
      return;
    }
    let params = {
      'url': 'create-page',
      'page_name': (this.customPage.old_page_name) ? this.customPage.old_page_name : this.customPage.new_page_name,
      'menu_name': (this.customPage.old_menu_name) ? this.customPage.old_menu_name : this.customPage.new_menu_name,
      'menu_flag': (this.isMenuRequired) ? true : false,
      'page_flag': (this.isPageRequired) ? true : false,
      'page_content': this.customPage.page_content,
      'show_menu': (this.customPage.isShowChecked) ? true: false,
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toaster.success(res['message'], 'Success', { closeButton: true });
        this.isMenuRequired = true;
        this.isMenuDisplay = true;
        this.isPageRequired = true;
        this.isPageDisplay = true;
        (<HTMLFormElement>document.getElementById('custom_page_form')).reset();
        this.route.navigate(['admin/custom-page']);
        this.getMenusAndPages();
      } else {
        this.toaster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }
}
