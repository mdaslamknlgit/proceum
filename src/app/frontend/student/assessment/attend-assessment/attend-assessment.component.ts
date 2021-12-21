import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import Swal from 'sweetalert2';
import {Location} from '@angular/common';
@Component({
  selector: 'app-attend-assessment',
  templateUrl: './attend-assessment.component.html',
  styleUrls: ['./attend-assessment.component.scss']
})
export class AttendAssessmentComponent implements OnInit {
    public show_q_numbers = true;
    public lst_grdclk = true;
    public assessment_id = 0
    //public filter_array = {qbank_id:0, exam_id:0};
    public questions_list = [];
    public assessment = [];
    public active_q_index= 0;
    public active_question = [];
    public bucket_url = '';
    public kpoint_iframe_url = '';
    public xt = '';
    public show_details_modal = false;
    public is_test_end = false;
    public allow_end_test: boolean = false;
    public remain_time = '';
    public seconds = 0;
    constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: CommonService, private toster: ToastrService, public translate: TranslateService, private location: Location) { 
        this.translate.setDefaultLang(this.http.lang);
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param) => {
            this.assessment_id = param.id;
            this.active_q_index = param.active_q_index?Number(param.active_q_index):0;console.log(this.active_q_index)
            this.getTestQuestions();
        });
    }
    getTestQuestions(){
        let param = {url: "assessment/get-questions", assessment_id:this.assessment_id};
        this.http.post(param).subscribe(res=>{
            if(res['error'] == false){
                this.questions_list = res['data']['questions'];
                this.assessment.push(res['data']['assessment']);
                this.bucket_url = res['data']['bucket_url'];
                if(this.questions_list.length > 0)
                {
                    this.getOptions(this.active_q_index);
                    let minutes = this.assessment[0]['time_per_question'] * this.questions_list.length;
                    if(res['data']['time_left_seconds'] <= 0){
                        this.toster.error("Assessment time has completed.", "Error", {closeButton:true});
                        this.router.navigateByUrl("/student/assessments/list");
                    }
                    this.seconds = res['data']['time_left_seconds']?res['data']['time_left_seconds']:minutes*60;
                    let set_interval = setInterval(res=>{
                        this.seconds = this.seconds-1;
                        if(this.seconds >= 0)
                        {
                            this.startTimer(this.seconds);
                            if(this.seconds == 60){
                                this.toster.info("Assessment will be end in a minute", "Remain Time", {closeButton:true});
                            }
                        }
                        else{
                            clearInterval(set_interval);
                            this.toster.info("This Assessment time has been completed.", "Timeup", {closeButton:true});
                            //this.caluculateResult();
                            this.endTest();
                        }
                    },1000);
                }
            }
            else{
                this.toster.error(res['message'], "Error", {closeButton:true});
                this.router.navigateByUrl("/student/assessments/list");
            }
        });
    }
    getOptions(index){
        this.active_prev_q_index = index;
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
    public active_prev_q_index = 0;
    getQuestionOptions(index){
        this.active_prev_q_index = this.active_q_index;
        this.saveAnswer(this.active_prev_q_index)
        this.active_q_index = index;
        if(this.active_q_index > 0)
            this.location.replaceState("/student/assessments/exam/"+this.assessment_id+"/"+this.active_q_index);
        else
            this.location.replaceState("/student/assessments/exam/"+this.assessment_id);
        if(this.active_q_index == (this.questions_list.length)){
            this.showResult();
        }
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
    saveAnswer(index){
        let status = this.checkAnswer(this.questions_list[index]);
        if(status >= 0){
            let param = {"url": "assessment/save-answer", question_id: this.questions_list[index]['id'], answer: this.questions_list[index]['answer'], assessment_id: this.assessment_id, result: this.questions_list[index]['result'], is_saved: this.questions_list[index]['is_saved'], status: status, answer_id: this.questions_list[index]['answer_id']};
            console.log(param, index)
            console.log(this.questions_list, index);
            this.http.post(param).subscribe(res=>{
                if(res['error'] == false)
                {
                    this.questions_list[index]['is_saved'] = true;
                    this.questions_list[index]['answer_id'] = res['data']['answer_id'];
                }
                else{
                    console.log("not updated", this.questions_list[index]);
                    this.questions_list[index]['is_saved'] = false;
                }
            });
        }
    }
    checkAnswer(q){
        let check = false;
            if([3,6,9,12].includes(q['q_type'])){
                return 3;
            }
            if(q['result'] == 'skppd'){
                return 4;
            }
            if(q['result'] == 'orng'){
                return 5;
            }
            if(q['answer'].length == 0){
                return 0;
            }
            else if(q['s_no'].length == q['answer'].length){
                const array2Sorted = q['answer'].slice().sort();
                check = q['s_no'].length === q['answer'].length && q['s_no'].slice().sort().every(function(value, index) {
                    return value === array2Sorted[index];
                });
                if(check == true){
                    return 1;
                }
                else{
                    return 2;
                }
            }
            else{
                return 2;
            }
    }
    startTimer(secs){
        secs = Math.round(secs);
        var hours = Math.floor(secs / (60 * 60));
    
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60);
    
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds);
        let s = new String(seconds);
        let f_seconds = s.length == 1?'0'+seconds:seconds;
        let m = new String(minutes);
        let f_minutes = m.length == 1?'0'+minutes:minutes;
        let h = new String(hours);
        let f_hours = h.length == 1?'0'+hours:hours;
        this.remain_time = f_hours+" : "+f_minutes+" : "+f_seconds;
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
        this.allow_end_test = true;
        if(event.checked == true){
            if(this.active_question['answer'].indexOf(""+option_id) == -1){
                this.questions_list[this.active_q_index]['answer'].push(''+option_id);
                this.active_question = this.questions_list[this.active_q_index];
            }
        }
        else{
            let index = this.active_question['answer'].indexOf(''+option_id);
            this.active_question['answer'].splice(index,1);
            let index2 = this.questions_list[this.active_q_index]['answer'].indexOf(''+option_id);
            this.questions_list[this.active_q_index]['answer'].splice(index2,1);
        }
        if(this.questions_list[this.active_q_index]['answer'].length>0){
            this.questions_list[this.active_q_index]['result'] = '';
        }
    }
    showDetails(){
        this.show_details_modal = true;
    }
    hideDetails(){
        this.show_details_modal = false;
    }
    skipQuestion(index){
        this.questions_list[index]['answer'] = [];
        this.questions_list[index]['result'] = "skppd";
        if(index == (this.questions_list.length-1)){
            this.showResult();
        }
        else{
            this.getQuestionOptions(index+1);
        }
    }
    markQuestion(index){
        this.questions_list[index]['result'] = "orng";
        if(index == (this.questions_list.length-1)){
            this.showResult();
        }
        else{
            this.getQuestionOptions(index+1);
        }
    }
    public correct_answers = 0;
    public wrong_answers = 0;
    public not_answered = 0;
    public free_text_qs = 0;
    showResult(){
         Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure to end this Assessment?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                let index = this.active_q_index;
                let status = this.checkAnswer(this.questions_list[index]);
                if(status >= 0){
                    let param = {"url": "assessment/save-answer", question_id: this.questions_list[index]['id'], answer: this.questions_list[index]['answer'], assessment_id: this.assessment_id, result: this.questions_list[index]['result'], is_saved: this.questions_list[index]['is_saved'], status: status, answer_id: this.questions_list[index]['answer_id']};
                    this.http.post(param).subscribe(res=>{
                        if(res['error'] == false)
                        {
                            this.questions_list[index]['is_saved'] = true;
                            this.endTest();
                        }
                        else{
                            console.log("not updated", this.questions_list[index]);
                            this.questions_list[index]['is_saved'] = false;
                        }
                    });
                }
                
                //this.caluculateResult();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                
            }
        });
    }
    endTest(){
        let param = {"url": "assessment/end", assessment_id: this.assessment_id};
        this.http.post(param).subscribe(res=>{
            if(res['error'] == false)
            {
                this.router.navigateByUrl("/student/assessments/result/"+this.assessment_id)
            }
            else{
                console.log(res);
            }
        });
    }
    caluculateResult(){
        this.is_test_end = true;
        let check = false;
        this.questions_list.forEach((q,index)=>{
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
}
