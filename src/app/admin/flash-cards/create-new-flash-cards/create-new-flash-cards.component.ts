import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UploadAdapter } from '../../../classes/UploadAdapter';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-create-new-flash-cards',
  templateUrl: './create-new-flash-cards.component.html',
  styleUrls: ['./create-new-flash-cards.component.scss']
})
export class CreateNewFlashCardsComponent implements OnInit {

  //dataSource = new MatTableDataSource();

  public user = [];
  public curriculum_list = [];
  public curriculum_id = 1;
  public curriculum_labels = [];
  public selected_level = [];
  public level_options = [];
  public all_level_options = [];
  public current_level_id = 0;
  public question: string = '';
  public answer: string = '';
  public library_popup: boolean = false;
  public active_question_index = 0;
  public library_purpose: any;
  public active_tab = 'images';
  private subscription:Subscription;
  public subject_csv = '';
  liteEditorConfig = environment.liteEditorConfig;
  public selected_content = [];
  public totalSize: 0;

  questionArray = [{
    question_text: '',
    answer_text: '',
    question_images: [],
    answer_images: [],
    question_images_files: [],
    answer_images_files: []
  }];
  public max_options = 10;


  constructor(private http:CommonService,private route: Router,private activatedRoute: ActivatedRoute,private toastr: ToastrService) { }


  ngOnInit(): void {
    this.getCurriculumnHierarchy();
    this.getChildData();
  }

  getCurriculumnHierarchy(){
    let param = {
      url: 'content-map-list',
      offset: 0,
      limit: 0,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data']?res['data']:[];
        this.curriculum_id = data['curricculum_id'];
        this.curriculum_list = data['curriculums'];
        if(!this.curriculum_list){
        this.toastr.error("No Curriculums Found", "Error" , { closeButton: true })
      }
      this.curriculum_labels = data['curriculum_labels'];
        this.selected_level = [];
        this.level_options = [];
        this.all_level_options = [];
        this.level_options[1] = data['level_1'];
        this.all_level_options[1] = data['level_1'];
      }
    });
  }

  applyFilters(level_id) {
    
    this.current_level_id = level_id;
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
            if (index > level_id) this.selected_level[index] = 0;
        });
      }
    });
  }

  ucFirst(string) {
    return this.http.ucFirst(string);
  }

  onReady(eventData) {
    let apiUrl = environment.apiUrl;
    eventData.plugins.get('FileRepository').createUploadAdapter = function (
      loader
    ) {
      var data = new UploadAdapter(loader, apiUrl + 'flash-cards_images');
      return data;
    };
  }
  CloseModal() {
    this.library_popup = false;
  }

  openAssetsLibrary(tab, purpose, index) {
    this.library_purpose = purpose;
    this.active_tab = tab;
    this.library_popup = true;
    this.active_question_index = index;
  }

  removeFile(questionIndex, questionImagesIndex, purpose) {
    if (purpose == 'question_images') {
      const index2 = this.questionArray[questionIndex].question_images_files.indexOf(
        this.questionArray[questionIndex].question_images[questionImagesIndex]['file_path']
      );
      if (index2 > -1) {
        this.questionArray[questionIndex].question_images_files.splice(index2, 1);
        this.questionArray[questionIndex].question_images.splice(questionImagesIndex, 1);
      }      
    }
    if (purpose == 'answer_images') {
      const index2 = this.questionArray[questionIndex].answer_images_files.indexOf(
        this.questionArray[questionIndex].answer_images[questionImagesIndex]['file_path']
      );
      if (index2 > -1) {
        this.questionArray[questionIndex].answer_images_files.splice(index2, 1);
        this.questionArray[questionIndex].answer_images.splice(questionImagesIndex, 1);
      }      
    }
  }

  getChildData() {
    this.subscription = this.http.child_data.subscribe((res) => {
      if (this.library_purpose == 'question_images') {
        let obj = {file_path: res['file_path'], path: res['path'] };
        if (this.questionArray[this.active_question_index].question_images_files.includes(obj['file_path'])) {
          this.toastr.error('File is already used', 'File Exists', {
            closeButton: true,
          });
        } else {
          this.toastr.success('Files Added.', 'File', { closeButton: true });
          this.questionArray[this.active_question_index].question_images.push(obj);
          this.questionArray[this.active_question_index].question_images_files.push(obj['file_path']);
        }
      }
      if (this.library_purpose == 'answer_images') {
        let obj = { file_path: res['file_path'], path: res['path'] };
        if (this.questionArray[this.active_question_index].answer_images_files.includes(obj['file_path'])) { 
          this.toastr.error('File is already used', 'File Exists', {
            closeButton: true,
          });
        } else {
          this.toastr.success('Files Added.', 'File', { closeButton: true });
          this.questionArray[this.active_question_index].answer_images.push(obj);
          this.questionArray[this.active_question_index].answer_images_files.push(obj['file_path']);
        }
      }
      this.CloseModal();
    });
  }

  addOption(index) {
    this.questionArray.push({
      question_text: '',
      answer_text: '',
      question_images: [],
      answer_images: [],
      question_images_files: [],
      answer_images_files:[]
    });
  }

  removeOption(index) {
    this.questionArray.splice(index, 1);
    //this.questionArray['option' + (index + 1)] = '';
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

    this.user = this.http.getUser();
    //If everything clear, send data to backend
    let form_data = {
      curriculum_id: this.curriculum_id,
      subject_csv: this.subject_csv,
      user_id:this.user['id'],
      role_id:this.user['role'],
      questionArray: this.questionArray,
    };
    //console.log(form_data);//return false;

    let params = { url: 'save-flash-cards', form_data: form_data };
    //let params = { url: 'save-flash-cards', "curriculum_id": this.curriculum_id,"subject_csv": this.subject_csv,user_id:this.user['id'],role_id:this.user['role'],"questionArray": this.questionArray, };
    this.http.post(params).subscribe((res) => {
      //console.log(res);
      if (res['error'] == false) {
        this.toastr.success(res['message'], 'Success', { closeButton: true });
        this.navigateTo('manage-flash-cards');
        //this.navigateTo('create-flash-cards');
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

}
