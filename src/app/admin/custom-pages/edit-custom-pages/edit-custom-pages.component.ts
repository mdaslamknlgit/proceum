import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-custom-pages',
  templateUrl: './edit-custom-pages.component.html',
  styleUrls: ['./edit-custom-pages.component.scss'],
})
export class EditCustomPagesComponent implements OnInit {
  isPageRequired: boolean = true;
  isMenuRequired: boolean = true;
  isMenuDisplay: boolean = true;
  isPageDisplay: boolean = true;
  page_content: any;
  page_id: number;
  data: any;
  customPage = {
    page_name: '',
    new_page_name: '',
    menu_name: '',
    old_menu_name: '',
    isShowChecked: '',
    page_content: '',
  };
  public Editor ;
  menuList: any;
  pagesList: any;
  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private http: CommonService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((routeParams) => {
      this.page_id = routeParams.id;
      this.getMenusAndPages();
    });
  }

  htmlEditorConfig = environment.editor_config;

  getMenusAndPages() {
    let params = {
      url: 'get-menu-pages',
      page_id: this.page_id,
    };
    this.http.post(params).subscribe((res) => {
      this.menuList = res['menu'];
      this.pagesList = res['pages'];
      this.customPage.page_name = res['page'].name;
      this.customPage.menu_name = res['page'].parent_id;
      this.customPage.isShowChecked = (res['page'].show_menu == 1) ? "checked" : "";
      this.customPage.page_content = res['page'].content;
    });
  }

  getPages() {
    this.pagesList = [];
    let params = {
      url: 'pages',
      parent_id: this.customPage.menu_name,
    };
    this.http.post(params).subscribe((res) => {
      this.pagesList = res['pages'];
    });
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

  updateCustomPage() {
    let params = {
      url: 'update-page',
      page_name: this.customPage.page_name,
      menu_name: this.customPage.menu_name,
      page_content: this.customPage.page_content,
      pk_id: this.page_id,
      show_menu: this.customPage.isShowChecked ? true : false,
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toaster.success(res['message'], 'Success', { closeButton: true });
        this.route.navigate(['admin/custom-page']);
        this.getMenusAndPages();
      } else {
        this.toaster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }
}
