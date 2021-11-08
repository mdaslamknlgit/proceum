import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-qbank-tests-page',
  templateUrl: './qbank-tests-page.component.html',
  styleUrls: ['./qbank-tests-page.component.scss']
})
export class QbankTestsPageComponent implements OnInit {
    public show_q_numbers = true;
    public study_plan_id = 0;
    public day = 0;
    public questions_list = [];
    public active_q_index= 0;
    public active_question = [];
    public bucket_url = '';
    public kpoint_iframe_url = '';
    public xt = '';
    public breadcome = [];
    public curriculum = [];
    public curriculum_id = 0;
    public level_id = 0;
    public level_parent_id = 0;
    constructor(private http: CommonService,private toster: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param) => {
            this.curriculum_id = param.curriculum_id;
            this.level_id = param.level_id ? param.level_id : 0;
            this.level_parent_id = param.level_parent_id ? param.level_parent_id : 0;
            //this.day = param.day;
            //this.study_plan_id = param.plan_id;
            this.getTestQuestions();
        });
        
    }
    getTestQuestions(){
        let param = {url: "qbank/get-qbank-test-questions", curriculum_id:this.curriculum_id, level_parent_id: this.level_parent_id, level_id: this.level_id};
        this.http.post(param).subscribe(res=>{
            if(res['error'] == false){
                this.questions_list = res['data']['questions'];
                this.bucket_url = res['data']['bucket_url'];
                this.breadcome = res['data']['breadcome'];
                this.curriculum.push(res['data']['curriculum'])
                if(this.questions_list.length > 0)
                    this.getQuestionOptions(0);
            }
            else{
                this.toster.error(res['message'], "Error", {closeButton:true});
                this.router.navigateByUrl('/student/study-planner');
            }
        });
    }
    getQuestionOptions(index){
        this.active_q_index = index;
        this.active_question = this.questions_list[index];
        if(this.questions_list[index]['options'].length == 0){
            let param = {url: "study-plan/get-question-options", question_id:this.active_question['id']};
            this.http.post(param).subscribe(res=>{
                if(res['error'] == false){
                    this.active_question['options'] = this.questions_list[index]['options'] = res['data']['options'];
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
        if(event.checked == true){
            this.active_question['answer'].push(''+option_id);
            this.questions_list[this.active_q_index]['answer'].push(''+option_id);
        }
        else{
            let index = this.active_question['answer'].indexOf(''+option_id);
            this.active_question['answer'].splice(index,1);
            let index2 = this.questions_list[this.active_q_index]['answer'].indexOf(''+option_id);
            this.questions_list[this.active_q_index]['answer'].splice(index2,1);
        }
    }
    checkAnswer(){
        this.active_question['show_answer'] = true;
        this.questions_list[this.active_q_index]['show_answer'] = true;
    }
}
