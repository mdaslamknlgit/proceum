import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'app-manage-flash-cards',
  templateUrl: './manage-flash-cards.component.html',
  styleUrls: ['./manage-flash-cards.component.scss']
})
export class ManageFlashCardsComponent implements OnInit {
  displayedColumnsRow: string[] = ['s_no','question_text','status_text','created_by','created_at','actions'];
  displayedColumns: string[] = [];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true, read:true }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) content_paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) content_sort: MatSort;

  public num_rows: number = 0;
  public page: number = 0;
  public pageSize = environment.page_size;
  public page_size_options = environment.page_size_options;
  public totalSize = 0;
  modal_popup = false;

  public model_edit_status = false;

  // Edit Model Params
  public question_id:any;
  public curriculum_list = [];
  public curriculum_id = 1;
  public curriculum_labels = [];
  public selected_level = [];
  public level_options = [];
  public all_level_options = [];

  public library_purpose: any;
  public active_tab = 'images';
  public library_popup: boolean = false;
  private subscription:Subscription;

  public question_images_dis = [];
  public question_images = [];
  public answer_images_dis = [];
  public answer_images = [];
  public question_images_files = [];
  public answer_images_files = [];
  
  liteEditorConfig = environment.liteEditorConfig;

  public question_description: string = '';
  public answer_description: string = '';

  public subject_csv = '';
  public question_text = '';
  public answer_text = '';

  constructor(private http: CommonService, public toastr: ToastrService, private route: Router) { }

  ngOnInit(): void {
    this.pageFilter();
    this.getChildData();
  }


  getServerData(event?: PageEvent) {
    this.pageSize = event.pageSize;
		this.page = (event.pageSize * event.pageIndex);
    this.pageFilter();
  }

  public pageFilter(){
    let param = { url: 'get-flash-cards',"offset": this.page, "limit": this.pageSize};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.dataSource = new MatTableDataSource(res['questions']);
        this.dataSource.sort = this.sort;
        this.num_rows = res['questions_count'];
      } else {
        this.toastr.info(res['message'], 'Info');
      }
      
    });
  }

  openEditModel(param:any){
    this.model_edit_status = true;
    this.question_id = param.pk_id;
    let course_ids_csv = param.course_ids_csv.split(',').map(Number);  
    this.question_description = '';  
    this.answer_description = '';
    this.question_images = [];
    this.answer_images = [];
    this.question_images_files = [];
    this.answer_images_files = [];
    this.selected_level = [];
    this.level_options = [];
    this.all_level_options = [];
    let params = {
      url: 'content-map-list',
      offset: 0,
      limit: 0,
      curriculum_id: param.curriculum_id,
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
    
    let paramss = {
      url: 'get-flash-cards',
      question_id:this.question_id
    };
    this.http.post(paramss).subscribe((res) => {
      if (res['error'] == false) {
        //this.dataSource = new MatTableDataSource(res['questions']);
        this.question_description = res['questions'][0]['question_description'];  
        this.answer_description = res['questions'][0]['answer_description'];
        this.question_images_dis = res['questions'][0]['question_images'];
        this.answer_images_dis = res['questions'][0]['answer_images'];
        
        if (this.question_images_dis.length > 0) {
          this.question_images_dis.forEach((file) => {
            let obj = { file_path: file['file_path'], path: file['path'] };
            this.question_images.push(obj);
            this.question_images_files.push(obj['file_path']);
          });
        }
        if (this.answer_images_dis.length > 0) {
          this.answer_images_dis.forEach((file) => {
            let obj = { file_path: file['file_path'], path: file['path'] };
            this.answer_images.push(obj);
            this.answer_images_files.push(obj['file_path']);
          });
        }
      } else {
        this.toastr.info(res['message'], 'Info');
      }
    });
  }

  applyCourseFilters(level_id) {
    let param = {
      url: 'content-map-list',
      offset: 0,
      limit: 0,
      curriculum_id: this.curriculum_id,
      step_id: this.selected_level[level_id],
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        if (level_id == 0) {
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

  ucFirst(string) {
    return this.http.ucFirst(string);
  }

  getLevels(level_id) {   
    let param = {
      url: 'get-levels-by-level',
      step_id: this.selected_level[level_id],
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
          if (index > level_id) this.selected_level[index] = '';
        });         
      }
    });
  }

  toggleModel(){
    this.model_edit_status = false;
  }

  CloseModal() {
    this.library_popup = false;
  }

  openAssetsLibrary(tab, purpose) {
    this.library_purpose = purpose;
    this.active_tab = tab;
    this.library_popup = true;
  }

  removeFile(index, purpose) {
    if (purpose == 'question_images') {
      const index2 = this.question_images_files.indexOf(
        this.question_images[index]['file_path']
      );
      if (index2 > -1) {
        this.question_images_files.splice(index2, 1);
        this.question_images.splice(index, 1);
      }
    }
    if (purpose == 'answer_images') {
      const index2 = this.answer_images_files.indexOf(
        this.answer_images[index]['file_path']
      );
      if (index2 > -1) {
        this.answer_images_files.splice(index2, 1);
        this.answer_images.splice(index, 1);
      }
    }
  }

  getChildData() {
    this.subscription = this.http.child_data.subscribe((res) => {
      if (this.library_purpose == 'question_images') {    
        let obj = { file_path: res['file_path'], path: res['path'] };
        if (this.question_images_files.includes(obj['file_path'])) {
          this.toastr.error('File is already used', 'File Exists', {
            closeButton: true,
          });
        } else {
          this.toastr.success('Files Added.', 'File', { closeButton: true });
          this.question_images.push(obj);
          this.question_images_files.push(obj['file_path']);
        }
      }
      if (this.library_purpose == 'answer_images') {
        let obj = { file_path: res['file_path'], path: res['path'] };
        if (this.answer_images_files.includes(obj['file_path'])) {
          this.toastr.error('File is already used', 'File Exists', {
            closeButton: true,
          });
        } else {
          this.toastr.success('Files Added.', 'File', { closeButton: true });
          this.answer_images.push(obj);
          this.answer_images_files.push(obj['file_path']);
        }
      } 
      
    });
  }

  saveFlashCards(){
    if(this.selected_level){
      this.subject_csv = this.selected_level.join();
    }else{
      this.subject_csv = '';
    }
    if(this.subject_csv == ''){
      this.toastr.error("Please select subjects!", 'Error', { closeButton: true });
      return;
    }

    //If everything clear, send data to backend
    let form_data = {
      question_id : this.question_id,
      curriculum_id: this.curriculum_id,
      subject_csv: this.subject_csv,
      question: this.question_description,
      answer: this.answer_description,
      question_images: this.question_images,
      answer_images: this.answer_images,


    };
    //console.log(form_data);//return false;

    let params = { url: 'update-flash-cards', form_data: form_data };
    this.http.post(params).subscribe((res) => {
      //console.log(res);
      if (res['error'] == false) {
        this.model_edit_status = false;
        this.toastr.success(res['message'], 'Success', { closeButton: true });
        this.navigateTo('manage-flash-cards');
        this.pageFilter();
      } else {
          this.toastr.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }

  navigateTo(url){
    let user = this.http.getUser();
    if(user['role']== '1'){
        url = "/admin/"+url;
    }
    //Later we must change this
    if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
      url = "/admin/"+url;
    }
    this.route.navigateByUrl(url);
  }

  deleteContentData(pk_id){
    let param = {
      url: 'delete-flash-cards',
      id: pk_id,
    };
    this.http.post(param).subscribe((res) => {  
      if (res['error'] == false) {
        this.toastr.success(res['message'], 'Success', { closeButton: true });
        this.pageFilter();
      } else {
        this.toastr.error(res['message'], res['message'], {
          closeButton: true,
        });
      }
    });
  }

}

