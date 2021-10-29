import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-tests-page',
  templateUrl: './tests-page.component.html',
  styleUrls: ['./tests-page.component.scss']
})
export class TestsPageComponent implements OnInit {
    public show_q_numbers = true;
    public study_plan_id = 0;
    public day = 0;
    public questions_list = [];
    public active_q_index= 0;
    public active_question = [];
    public bucket_url = '';
    public kpoint_iframe_url = '';
    public xt = '';
    public study_plan = [];
    public show_details_modal = false;
    constructor(private http: CommonService,private toster: ToastrService, private activatedRoute: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param) => {
            this.day = param.day;
            this.study_plan_id = param.plan_id;
            this.getTestQuestions();
        });
        
    }
    getTestQuestions(){
        let param = {url: "study-plan/get-test-questions", day:this.day, plan_id: this.study_plan_id};
        this.http.post(param).subscribe(res=>{
            if(res['error'] == false){
                this.questions_list = res['data']['questions'];
                this.bucket_url = res['data']['bucket_url'];
                this.study_plan.push(res['data']['study_plan']);
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
            console.log(this.active_question['answer'].indexOf(""+option_id))
            if(this.active_question['answer'].indexOf(""+option_id) == -1){
                //this.active_question['answer'].push(''+option_id);
                this.questions_list[this.active_q_index]['answer'].push(''+option_id);
                this.active_question = this.questions_list[this.active_q_index];
                console.log(this.questions_list[this.active_q_index]['answer'])
            }
        }
        else{
            let index = this.active_question['answer'].indexOf(''+option_id);
            this.active_question['answer'].splice(index,1);
            let index2 = this.questions_list[this.active_q_index]['answer'].indexOf(''+option_id);
            this.questions_list[this.active_q_index]['answer'].splice(index2,1);
        }
    }
    hideDetails(){
        this.show_details_modal = false;
    }
    public correct_answers = 0;
    public wrong_answers = 0;
    public not_answered = 0;
    public free_text_qs = 0;
    showResult(){
        let check = false;
        this.questions_list.forEach((q,index)=>{
            this.questions_list[index]['show_answer'] = true;
            console.log(q['answer'], q['s_no']);
            if([3,6,9,12].includes(q['q_type'])){
                this.free_text_qs = this.free_text_qs+1;
                return true;
            }
            if(q['answer'].length == 0){
                this.not_answered = this.not_answered+1;
            }
            else if(q['s_no'].length == q['answer'].length){
                const array2Sorted = q['answer'].slice().sort();
                check = q['s_no'].length === q['answer'].length && q['s_no'].slice().sort().every(function(value, index) {
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
        this.show_details_modal = true;
    }
    checkAnswer(){
        this.active_question['show_answer'] = true;
        this.questions_list[this.active_q_index]['show_answer'] = true;
    }
}
