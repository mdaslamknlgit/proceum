import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
selector: 'app-study-mode',
templateUrl: './study-mode.component.html',
styleUrls: ['./study-mode.component.scss']
})
export class StudyModeComponent implements OnInit {
    public show_q_numbers = true;
    public lst_grdclk = true;
    public filter_array = {qbank_id:0, source_id:0};
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
    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: CommonService, private toster: ToastrService) { }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param) => {
            this.filter_array.qbank_id = param.qbank_id;
            this.filter_array.source_id = param.source_id;
            this.getTestQuestions();
        });
    }
    getTestQuestions(){
        let param = {url: "qbank/get-qbank-test-questions", curriculum_id:this.filter_array.qbank_id, level_parent_id: this.filter_array.source_id};
        this.http.post(param).subscribe(res=>{
            if(res['error'] == false){
                this.questions_list = res['data']['questions'];
                this.bucket_url = res['data']['bucket_url'];
                this.breadcome = res['data']['breadcome'];
                this.curriculum.push(res['data']['curriculum']);
                if(this.questions_list.length > 0)
                    this.getQuestionOptions(0);
            }
            else{
                this.toster.error(res['message'], "Error", {closeButton:true});
                this.router.navigateByUrl('/student/qbank/create-exam/'+this.filter_array.qbank_id);
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
        this.setResult(this.active_q_index);
    }
    setResult(q_index){
        let check = false;
               //this.questions_list.forEach((q,index)=>{
                   let q = this.questions_list[q_index];
                   if(q['answer'].length > 0){
                        if([3,6,9,12].includes(q['q_type'])){
                            //this.free_text_qs = this.free_text_qs+1;
                            this.questions_list[q_index]['result'] = "orng";//skipped
                        }
                        if(q['answer'].length == 0){
                            this.questions_list[q_index]['result'] = "";
                        }
                        else if(q['s_no'].length == q['answer'].length){
                            const array2Sorted = q['answer'].slice().sort();
                            check = q['s_no'].length === q['answer'].length && q['s_no'].slice().sort().every(function(value, index) {
                                return value === array2Sorted[index];
                            });
                            if(check == true){
                                this.questions_list[q_index]['result'] = "grn";//correct
                            }
                            else{
                                this.questions_list[q_index]['result'] = "rd";//wrong
                            }
                        }
                        else{
                            this.questions_list[q_index]['result'] = "rd";//wrong
                        }
                   }
               //});
   }
}
