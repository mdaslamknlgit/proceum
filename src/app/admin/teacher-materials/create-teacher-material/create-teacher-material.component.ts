import { Component, HostListener, OnInit,ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import * as ClassicEditor from '../../../../assets/ckeditor5/build/ckeditor';
import { UploadAdapter } from '../../../classes/UploadAdapter';
import { Subscription } from 'rxjs/internal/Subscription';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-create-teacher-material',
  templateUrl: './create-teacher-material.component.html',
  styleUrls: ['./create-teacher-material.component.scss']
})
export class CreateTeacherMaterialComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'uploaded_by', 'created_at', 'updated_at', 'action', 'status', 'download_flag'];
  displayedTeacherColumns: string[] = ['id', 'title', 'created_at', 'updated_at', 'action', 'status', 'download_flag'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('editor', { static: false }) editor: CKEditorComponent;
  public page = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public sort_by: any;
  public model_status = false;
  public model_edit_status = false;
  public material_name='';
  public material_id:any;
  public search_txt="";
  public subject_csv = '';
  public library_purpose: any;
  public active_tab = 'images';
  public library_popup: boolean = false;
  public attachments = [];
  public attachment_files = [];
  private subscription:Subscription;
  private subscription_editor:Subscription;
  public material_description: string = '';
  public selected_courses = [];
  public curriculum_list = [];
  public curriculum_id = 1;
  public curriculum_labels = [];
  public selected_level = [];
  public level_options = [];
  public all_level_options = [];
  public user = [];
  public usersList = [];
  public teacher_id = '';
  public page_title = 'Add Teacher Material';
  public material_name_error = false;
  constructor(private http:CommonService,private route: Router,private activatedRoute: ActivatedRoute,private toastr: ToastrService) {
  }

  public Editor = ClassicEditor;

  ngOnInit(): void {
    this.user = this.http.getUser();
    this.activatedRoute.params.subscribe((param) => {
      this.material_id = param.id;
      if (this.material_id != undefined) {
        this.page_title = 'Edit Teacher Material';
        let params={url: 'get-all-materials', material_id: this.material_id};
        this.http.post(params).subscribe((res: Response) => {
          this.openEditModel(res['data']['materials']);
        });
      }else{
        this.openAddModel();
        this.material_id = 0;
      }
    });
    this.getChildData();
    this.getChildDataEditor();
  }

  deleteRecord(id){
    let param = {
      url: 'delete-teacher-material',
      id: id,
    };
    this.http.post(param).subscribe((res) => {  
      if (res['error'] == false) {
        this.toastr.success(res['message'], 'Success', { closeButton: true });
        this.applyFilters();
      } else {
        this.toastr.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }

  public changeStatus(id, status){
    let param = {
      url: 'change-material-status',
      id: id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toastr.success(res['message'], 'Success', { closeButton: true });
        this.applyFilters();
      } else {
        this.toastr.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });   
  }

  public downloadStatus(id, status){
    let param = {
      url: 'download-attachments-status',
      id: id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toastr.success(res['message'], 'Success', { closeButton: true });
        this.applyFilters();
      } else {
        this.toastr.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });   
  }

  public changeVisibility(id, status){
    let param = {
      url: 'change-material-visibility',
      id: id,
      status: status,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toastr.success(res['message'], 'Success', { closeButton: true });
        this.applyFilters();
      } else {
        this.toastr.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }

  applyCourseFilters(level_id) {
    let param = {
      url: 'content-map-list',
      curriculum_id: this.curriculum_id,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        if (level_id == 0) {
          //console.log(data['curriculum_labels']);
          this.curriculum_labels = data['curriculum_labels'];
          this.selected_level = [];
          this.level_options = [];
          this.all_level_options = [];
          this.level_options[1] = data['level_1'];
          this.all_level_options[1] = data['level_1'];
        }
      }
    });
  }

  getLevels(level_id) {   
    let param = {
      url: 'get-levels-by-level',
      step_id: this.selected_level[level_id],
      level_id: level_id,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.level_options[level_id + 1] = data['steps'];
        this.all_level_options[level_id + 1] = data['steps'];
        this.level_options.forEach((opt, index) => {
          if (index > level_id + 1) this.level_options[index] = [];
        });
        //aded with out test here
        this.selected_level.forEach((opt, index) => {
          if (index > level_id) this.selected_level[index] = 0;
        });         
      }
    });
  }

  openEditModel(param:any){
    if(this.user['role'] == 1){
      let params = { url: 'get-user-list', role : 12 };
      this.http.post(params).subscribe((res) => {
        if (res['error'] == false) {
          this.usersList = res['data'];
          this.teacher_id = param[0]['uploaded_by_user_id'];
        }
      });
    }
    this.model_status = true;
    this.model_edit_status = true;
    this.material_id = param[0]['pk_id'];
    this.material_name = param[0]['title'];
    this.material_description = param[0]['description'];  
    let course_ids_csv = param[0]['course_ids_csv'].split(',').map(Number);  
    this.selected_level = [];
    this.level_options = [];
    this.all_level_options = [];
    let params = {
      url: 'content-map-list',
      curriculum_id: param[0]['curriculum_id'],
    };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data']?res['data']:[];
        this.curriculum_id = data['curricculum_id'];
        this.curriculum_list = data['curriculums'];
        this.curriculum_labels = data['curriculum_labels'];
        this.selected_level[1] = course_ids_csv[0];
        this.level_options[1] = data['level_1'];
        this.all_level_options[1] = data['level_1'];
      }
    });
    course_ids_csv.forEach((opt, index) => {
      let param = {
        url: 'get-levels-by-level',
        step_id: course_ids_csv[index],
      };
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          let data = res['data']; 
          this.selected_level[index + 2] = course_ids_csv[index + 1];       
          this.level_options[index + 2] = data['steps'];
          this.all_level_options[index + 2] = data['steps']; 
        }
      });
    }); 
    //console.log(this.selected_level[4]);  
    this.attachments = param[0]['attachments'];
    this.attachment_files = [];
    if (this.attachments.length > 0) {
      this.attachments.forEach((file) => {
        this.attachment_files.push(file['file_path']);
      });
    }
  }

  applyFilters(){
    let params={url: 'get-all-materials'};
    this.http.post(params).subscribe((res: Response) => {
      this.dataSource = new MatTableDataSource(res['data']['materials']);
    });
  }

  closeMaterialModel() {
    this.model_status = false;  
  }

  openAddModel() {
    if(this.user['role'] == 1){
      let params = { url: 'get-user-list', role : 12 };
      this.http.post(params).subscribe((res) => {
        if (res['error'] == false) {
          this.usersList = res['data'];
        }
      });
    }
    this.model_status = true;  
    this.model_edit_status = false;
    this.material_name ="";
    this.material_description ="";
    this.attachments = [];
    this.attachment_files = [];
    this.selected_level = [];
    this.level_options = [];
    this.all_level_options = [];
    let param = {
      url: 'content-map-list',
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data']?res['data']:[];
        this.curriculum_id = data['curricculum_id'];
        this.curriculum_list = data['curriculums'];
        this.curriculum_labels = data['curriculum_labels'];        
        this.level_options[1] = data['level_1'];
        this.all_level_options[1] = data['level_1'];
      }
    });
  }

  saveMaterial(){
    this.material_name_error = false;
    //this.selected_level.shift();
    this.subject_csv = this.selected_level.join().substr(1);
    //console.log(this.subject_csv);
    if(this.user['role'] == 12){
      var user_id = this.user['id'];
    }else{
      var user_id = this.teacher_id;
    }
    let params={url: 'save-teacher-material',curriculum_id:this.curriculum_id,subject_csv:this.subject_csv,user_id:user_id,role_id:this.user['role'],material_name:this.material_name,material_description:this.material_description,attachments: this.attachments};
    this.http.post(params).subscribe((res: Response) => {
      if (res.error) {
        if(res.message == 'This material title already used'){
          this.material_name_error = true;
        }
        this.toastr.error(res.message , 'Error', { closeButton: true , timeOut: 3000});
      }else{
        this.toastr.success(res.message , 'Success', { closeButton: true , timeOut: 3000});
        window.history.back();
      }
    });
  }

  updateMaterial(){
    this.material_name_error = false;
    //this.selected_level.shift();
    this.subject_csv = this.selected_level.join().substr(1);
    if(this.user['role'] == 12){
      var user_id = this.user['id'];
    }else{
      var user_id = this.teacher_id;
    }
    let params={url: 'update-teacher-material',material_name:this.material_name,user_id:user_id,role_id:this.user['role'],material_description:this.material_description,attachments: this.attachments,subject_csv: this.subject_csv,curriculum_id:this.curriculum_id,material_id:this.material_id};
    this.http.post(params).subscribe((res: Response) => {
      if (res.error) {     
        if(res.message == 'This material title already used'){
          this.material_name_error = true;
        }
        this.toastr.error(res.message , 'Error', { closeButton: true , timeOut: 3000});
      }else{
        this.toastr.success(res.message , 'Success', { closeButton: true , timeOut: 3000});
        window.history.back();
      }
    });
  }

  searchLevelByName(search,level){
    let options = this.all_level_options[level];
    this.level_options[level] = options.filter(
      item => item.level_name.toLowerCase().includes(search.toLowerCase())
    );
  }

  @HostListener('window:open_library', ['$event'])
  openCustomPopup(event) {
    this.openAssetsLibrary('images', 'editor');
  }

  editorConfig = {
    Plugins: [],
    placeholder: 'Enter content',
    toolbar: {
      items: environment.ckeditor_toolbar,
    },
    link: {
        decorators: {
            openInNewTab: {
                mode: 'manual',
                label: 'Open in a new tab',
                defaultValue: true,			// This option will be selected by default.
                attributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                }
            }
        }
    },
    image: {
      upload: ['png'],
      toolbar: [
        'imageStyle:alignLeft',
        'imageStyle:full',
        'imageStyle:alignRight',
        'imageStyle:side'
      ],
      styles: ['full', 'alignLeft', 'alignRight', 'side'],
    },
    // wproofreader: {
    //     serviceId: 'your-service-ID',
    //     srcUrl: 'https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js'
    // },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'TableProperties', 'TableCellProperties'],
    },
    highlight: {
        options: [
            {
                model: 'yellowMarker',
                class: 'marker-yellow',
                title: 'Yellow marker',
                color: 'var(--ck-highlight-marker-yellow)',
                type: 'marker'
            }]
        },
    mediaEmbed: {
      previewsInData: true,
    },
    language: 'en',
  };

  onReady(eventData) {
    let apiUrl = environment.apiUrl;
    eventData.plugins.get('FileRepository').createUploadAdapter = function (
      loader
    ) {
      var data = new UploadAdapter(loader, apiUrl + 'upload-image');
      return data;
    };
  }

  public doFilter = () => {
    let value = this.search_txt;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  getChildData() {
    this.subscription = this.http.child_data.subscribe((res) => {
      if (this.library_purpose == 'attachments') {
        let obj = { file_path: res['file_path'], path: res['path'] };
        if (this.attachment_files.includes(obj['file_path'])) {
          this.toastr.error('File is already used', 'File Exists', {
            closeButton: true,
          });
        } else {
          this.toastr.success('Files Added.', 'File', { closeButton: true });
          this.attachments.push(obj);
          this.attachment_files.push(obj['file_path']);
        }
      }     
    });
  }

  getChildDataEditor() {
    this.subscription_editor = this.http.child_data_editor.subscribe((res) => {
      if (this.library_purpose == 'editor') {
        let obj = { file_path: res['file_path'], path: res['path'] };
        this.addImage(res['path']);
        this.CloseLibraryModal();
      }
    });
  }

  addImage(src){
    this.editor.editorInstance.execute("insertImage", { source: src });
  }

  ngOnDestroy() { 
    this.subscription.unsubscribe();
    this.subscription_editor.unsubscribe();
  }

  CloseLibraryModal() {
    this.library_popup = false;
  }

  openAssetsLibrary(tab, purpose) {
    this.library_purpose = purpose;
    this.active_tab = tab;
    this.library_popup = true;
  }

  removeFile(index, purpose) {
    if (purpose == 'attachments') {
      const index2 = this.attachment_files.indexOf(
        this.attachments[index]['file_path']
      );
      if (index2 > -1) {
        this.attachment_files.splice(index2, 1);
        this.attachments.splice(index, 1);
      }
    }
  }

  ucFirst(string) {
    return this.http.ucFirst(string);
  }

}

export interface Response {
  error: boolean;
  message: string;
  errors?: any;
}
