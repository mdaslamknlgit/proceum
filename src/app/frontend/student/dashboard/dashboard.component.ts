import { Component, HostListener, OnInit } from '@angular/core';
import { SocialAuthService } from 'angularx-social-login';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';

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
    public translate: TranslateService
    ) {
      this.translate.setDefaultLang(this.http.lang);
    }
  //User variables
  public user:any = [];
  public user_id:any = '';
  public role_id:any = '';

  //wishlist items variables
  public wish_list:any = []; 
  public free_content:any = [];
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
  public bucket_url = '';
  public wish_list_data:any = [];
  public notes = 0;
  public assessments = 0;
  public classes = 0;
  public subjectknowledge;
  public lineChartLegend = false;
  public lineChartType = 'bar';
  public inlinePlugin: any;
  public textPlugin: any;
  public lineChartData:any = [];
  public lineChartLabels:any = [];
  public lineChartOptions:any;
  public chartColors: any[] = [
    { 
      backgroundColor:[
        "#303641", "#f56954", "#0073b7", "#00b29e", "#ba79cb", "#ec3b83", "#701c1c",
        "#6c541e","#303641", "#ffa812", "#311B92", "#B71C1C", "#4A148C", "#1A237E",
        "#0D47A1", "#004D40", "#FF6F00", "#BF360C", "#3E2723", "#990000", "#6633FF", 
        "#FBC02D", "#FF7043", "#8E24AA", "#00897B", "#FDD835", "#0277BD", "#6D4C41"
    ] 
    }];
  public individual = environment.ALL_ROLES.INDIVIDUAL;
  public student = environment.ALL_ROLES.STUDENT;
  public referral_count = 0;
  public social_count = 0;
  public usr_order_cnt = 0;
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
      this.getPackagesAboutToExpire();
      this.getDashboardCount();
      if(this.role_id && this.role_id == this.individual){
        this.getMyEarnings();
        this.getOrders();
      }
      this.getRandomQuestions();
      this.getSubjectKnowledge();
      this.getFreeContent();
      this.getBookmarksFavorite();
      this.getWishList();      
    }
  }
  //Get wishlist items
  getWishList(){
    let param = { url: 'get-wishlist', id: this.user_id};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data']){
          this.wish_list = res['data']['cart'];
          this.wish_list_data = res['data']['wishlist'];
        }else{
          //this.toster.error("Your cart is empty!. Please add items to cart!", 'Error');
        }
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }

  //Get free content
  getFreeContent(){
    let param = { url: 'get-free-content'};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.free_content = res['data'];
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }

  getMyEarnings() {
    let param = { url: 'referral-earnings-list' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.referral_count = res['data']['referral_earnings_list'].filter(i => (i.course_purchased == 1 && i.credits_consumed == 0)).length;
      }
    });

    let params = { url: 'social-share' };
    this.http.get(params).subscribe((res: Response) => {
      this.social_count = res['data']['social_share_list'].filter(i => (i.approval_status == 1 && i.credits_consumed == 0)).length;
    });
  }

  getOrders() {
    let param = { url: 'get-user-orders', status: 2 };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.usr_order_cnt = res['total_records'];
      }
    });
  }

  //Get dashboard Count
  getDashboardCount(){
    let param = { url: 'student-dashboard'};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.notes = res['data'].notes_accesed;
        this.assessments = res['data'].assessment;
        this.classes = res['data'].meetings;
      }
    });
  }
  getSubjectKnowledge(){
    let subject = [];
    let subject_val = [];
    let param = { url: 'subject-knowledge'};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.subjectknowledge = res['data'];
        this.subjectknowledge.forEach((opt, index) => {
          for(let key in opt) {
            subject.push(key);
            subject_val.push(opt[key].percentage);
          }        
        })
        let subject_knowledge = '';
        this.translate.get('student.dashboard.subject_knowledge').subscribe((data)=> {
          subject_knowledge = data;
        });
        this.lineChartData = [
          {
            label: subject_knowledge,
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: subject_val,//[96, 20, 25 , 80, 81, 56, 55, 90, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 50, 56, 55, 40],
              barThickness: 16,
            // maxBarThickness: 8,
            // minBarLength: 2,
          },
        ];
        this.lineChartLabels = subject;//['Human Anatomy', 'Pysiology', 'Pharmacology', 'General Medicine', 'Biochemistry', 'Clinical Essentials', 'Gynecology', 'Paediatrics', 'Community Medicine'];
        this.lineChartOptions = {
          responsive: true,
          annotation: {
            annotations: [
              {
                drawTime: 'afterDraw',
                // type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 0,
                borderColor: '#000000',
                borderWidth: 2,
                scales: {
                  xAxes: [{
                      // gridLines: {
                      //      display:false
                      // }
                      // ticks: {
                      //   maxTicksLimit: 20,
                      // },
                      ticks: { fontColor: 'black' },
                      gridLines: { color: 'rgba(255,255,255,0.1)' }
                  }],
                  // yAxes: [{
                  //     gridLines: {
                  //         // display:false
                  //         ticks: { fontColor: 'black',  style: 'percent', min: 0, stepValue : 10, max : 100, },
                  //         gridLines: { color: 'rgba(255,255,255,0.1)' },
                  //     }   
                  // }],
                  yAxes: [{
                    barPercentage: 6.0,
                    categoryPercentage: 6.0,
                    ticks: {
                     beginAtZero: true,
                      callback: function (value, index, values) {
                        return '$' + value + 'k';
                      },
                    }
                  }]
                },
                gradient : true,
                showDataLabel : true,
                label: {
                  backgroundColor: 'red',
                  content: 'global plugin',
                  enabled: true,
                  position: 'center',
                }
              }
            ]
          }
        };       
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
        this.getFreeContent();
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
        this.bucket_url = res['data']['bucket_url'];
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
    /* this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        if(res['data'].length){
          this.expiration_courses = res['data'];
        }
      }
    }); */
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
    let are_you_sure_text = '';
    this.translate.get('are_you_sure_text').subscribe((data)=> {
      are_you_sure_text = data;
    });
    let are_you_sure_end_text = '';
    this.translate.get('student.dashboard.are_you_sure_end_text').subscribe((data)=> {
      are_you_sure_end_text = data;
    });
    let yes_text = '';
    this.translate.get('yes_text').subscribe((data)=> {
      yes_text = data;
    });
    let no_text = '';
    this.translate.get('no_text').subscribe((data)=> {
      no_text = data;
    });
       Swal.fire({
          title: are_you_sure_text,
          text: are_you_sure_end_text,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: yes_text,
          cancelButtonText: no_text
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
