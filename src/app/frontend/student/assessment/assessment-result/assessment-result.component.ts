import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-assessment-result',
  templateUrl: './assessment-result.component.html',
  styleUrls: ['./assessment-result.component.scss']
})

export class AssessmentResultComponent implements OnInit {
    public assessment = [];
    public assessment_id = 0;
    public student_details = [];
    public assessment_date_time = '';
    public remain_time = '';
    public total_time = '';
    public assessment_details = [];
    public answered_questions = '';
    public correct_answers = '';
    public wrong_answers = '';
    public skiped_questions = '';
    public not_ans_questions = '';
    public percentage = '';
    constructor(private http: CommonService, public translate: TranslateService, public activatedRoute: ActivatedRoute) {
        this.translate.setDefaultLang(this.http.lang);
    }
    ngOnInit(): void {
        this.activatedRoute.params.subscribe((param) => {
            this.assessment_id = param.id;
            this.getResult();
        });
    }
    getResult(){
        let param = {url: "assessment/result", assessment_id:this.assessment_id};
        this.http.post(param).subscribe(res=>{
            if(res['error'] == false){
                let data = res['data'];
                this.assessment.push(data['assessment']);
                this.student_details = data['student_details'];
                this.assessment_date_time = data['assessment_date_time'];
                let total_time = data['assessment']['total_questions_count'] * data['assessment']['time_per_question']*60;
                this.total_time = this.startTimer(total_time);
                this.assessment_details = data['assessment_details'];
                this.answered_questions = data['answered_questions'];
                this.correct_answers = data['correct_answers'];
                this.wrong_answers = data['wrong_answers'];
                this.skiped_questions = data['skiped_questions'];
                this.not_ans_questions = data['not_ans_questions'];
                this.percentage = data['percentage'];
            }
        })
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
        let remain_time = f_hours+" : "+f_minutes+" : "+f_seconds;
        return remain_time;
    }
}
