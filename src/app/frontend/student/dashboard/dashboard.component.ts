import { Component, HostListener, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private socialAuthService: SocialAuthService,
    private http: CommonService,
    public toster: ToastrService,
    private router: Router,
    ) {}
  //User variables
  public user:any = [];
  public user_id:any = '';
  public role_id:any = '';

  //wishlist items variables
  public wish_list:any = []; 
  public expiration_courses:any = []; 
  public bookmarks:any = [];
  public favorites:any = [];
  public case_question:any = [];
  public quiz_case_model = true;
  public quiz_case_rslt = false;
  public case_model = true;
  public quiz_questions = [];
  public case= [];
  public active_case_index = 0;
  public active_mcq_index = 0;
  public active_q_index= 0;
  public xt = '';
  public checked_options = [];
  public validated_questions = [];
  public active_question = [];
  public is_test_end = false;
  public allow_end_test: boolean = false;
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {alert()
      // Your logic on beforeunload
  }
  ngOnInit(): void {
    this.socialAuthService.signOut(true);
    this.user = this.http.getUser(); 
    if(this.user){
      this.user_id = this.user['id'];
      this.role_id =  Number(this.user['role']);
      this.getWishList();
      this.getBookmarksFavorite();
      this.getRandomQuestions();
      this.getPackagesAboutToExpire();
    }
  }
  //Get wishlist items
  getWishList(){
    let param = { url: 'get-wishlist', id: this.user_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data'].length){
          this.wish_list = res['data'];
        }else{
          //this.toster.error("Your cart is empty!. Please add items to cart!", 'Error');
        }
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }
  getBookmarksFavorite(){
    let param = { url: 'student-bookmarks-favorite', id: this.user_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data']){
          this.bookmarks = res['data'].bookmarks;
          this.favorites = res['data'].favorites;
          // console.log(res['data'].bookmarks.length);
        }
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }
  updateBookmarkFavorite(source_id,type){
    let param = { url: 'manage-statistics', source_id: source_id,type:type};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.getBookmarksFavorite();
        this.toster.success(res['message'], 'Success', { closeButton: true });
      }else{
        this.toster.error(res['message'], 'Error', {
          closeButton: true,
        });
      }
    })
  }
  //Get random questions
  getRandomQuestions(){
    let param = { url: 'get-random-questions'};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        // console.log(res['data']['caseoftheday']);
        this.quiz_questions = res['data']['questions'];
        this.case = res['data']['caseoftheday'];
        if(this.quiz_questions.length > 0)
          this.getQuestionOptions(0);
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }
  getQuestionOptions(index){
    this.active_q_index = index;
    this.active_question = this.quiz_questions[index];
    if(this.quiz_questions[index]['options'].length == 0){
        let param = {url: "study-plan/get-question-options", question_id:this.active_question['id']};
        this.http.post(param).subscribe(res=>{
            if(res['error'] == false){
                this.active_question['options'] = this.quiz_questions[index]['options'] = res['data']['options'];
                this.getXtToken();
            }
            else{
                this.toster.error(res['message'], "Error", {closeButton:true});
            }
        });
    }
    else{
        this.getXtToken();
    }
  }
  //Get package expirations of user
  getPackagesAboutToExpire(){
    let param = { url: 'get-user-packages-about-to-expire'};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data'].length){
          this.expiration_courses = res['data'];
        }
      }
    });
  }
  navigateTo(url){
    this.router.navigateByUrl("student/curriculum/details/"+url);
  }
  kpoint_iframe_url='';
  getXtToken(){
    if(this.active_question['q_source'] == 'KPOINT'){
          let param = {"url": "get-kpoint-token"};
          this.xt = '';
          this.http.post(param).subscribe(res=>{
              this.xt = res['data']['xt'];
              this.kpoint_iframe_url = "https://proceum.kpoint.com/kapsule/"+this.active_question['q_source_value']+"/nv3/embedded?xt="+this.xt;
              
          });
      }
  }
  setAnswer(event, option_id){
    this.allow_end_test = true;
    if(event.checked == true){
      if(this.active_question['answer'].indexOf(""+option_id) == -1){
          //this.active_question['answer'].push(''+option_id);
        this.quiz_questions[this.active_q_index]['answer'].push(''+option_id);
         this.active_question = this.quiz_questions[this.active_q_index];
          //console.log(this.quiz_questions[this.active_q_index]['answer'])
      }
    }
    else{
        let index = this.active_question['answer'].indexOf(''+option_id);
        this.active_question['answer'].splice(index,1);
        let index2 = this.quiz_questions[this.active_q_index]['answer'].indexOf(''+option_id);
        this.quiz_questions[this.active_q_index]['answer'].splice(index2,1);
    }
  }
    showDetails(){
        this.quiz_case_rslt = true;
    }
    hideDetails(){
        this.quiz_case_rslt = false;
    }
    public correct_answers = 0;
    public wrong_answers = 0;
    public not_answered = 0;
    public free_text_qs = 0;
    showResult(){
         Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure to end this test?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                this.is_test_end = true;
                let check = false;
                let fff;
                this.quiz_questions.forEach((q,index)=>{
                    if([3,6,9,12].includes(q['q_type'])){
                        this.free_text_qs = this.free_text_qs+1;
                        return true;
                    }
                    if(q['answer'].length == 0){
                        this.not_answered = this.not_answered+1;
                    }
                    else if(q['s_no'].split(',').length == q['answer'].length){
                        const array2Sorted = q['answer'].slice().sort();
                        check = q['s_no'].split(',').length === q['answer'].length && q['s_no'].split(',').slice().sort().every(function(value, index) {
                            return value === array2Sorted[index];
                        });
                        if(check == true){
                          this.correct_answers = this.correct_answers+1;
                        }
                        else{
                          this.wrong_answers = this.wrong_answers+1;
                        }
                    }
                    else{
                      this.wrong_answers = this.wrong_answers+1;
                    }
                });
                this.reviewQuestions();
                this.quiz_case_rslt = true;
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                
            }
        });
    }
  checkAnswer(){
  }
  reviewQuestions(){
    this.quiz_questions.forEach((q,index)=>{
        this.quiz_questions[index]['show_answer'] = true;
    });
    // this.hideDetails();
  }
  ValidateAnswer(question_id){
    this.validated_questions.push(question_id)
  }
  getOptionClass(question_id, correct_ans_ids, option_id){
    let answers = correct_ans_ids.split(',');
    if(this.validated_questions.includes(question_id) && answers.includes(''+option_id)){
        return "crrct_rdo";
    }
    else if(this.validated_questions.includes(question_id) && !answers.includes(''+option_id)){
        return "wrng_rdo";
    }
  }
  selectOption(value) {
    this.case[this.active_case_index]['selected_option'] = value;
  }
  closeModal(){
    this.getRandomQuestions();
    this.quiz_case_rslt = false;
    this.quiz_case_model = !this.quiz_case_model;
  }
  CloseCaseModal(){
    this.getRandomQuestions();
    this.case_model = !this.case_model;
  }
}
