import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
    public meetings = [];
    constructor(private http: CommonService, public translate: TranslateService, private route: Router, private toster: ToastrService) { 
        this.translate.setDefaultLang(this.http.lang);
    }
    ngOnInit(){
        this.getList(0);
    }
    getList(tab) {
        let param = {url: 'class/get-classes', tab: tab};
        this.http.post(param).subscribe((res) => {
            if (res['error'] == false) {
                this.meetings = res['data'];
            }
            else{

            }
        });
    }
    switchTab(event){
        this.getList(event.index);
    }
    joinClass(meeting_id){
        let string = this.http.getRandomString(6);
        localStorage.setItem('ip_address', string);
        let param = {
            url: 'class/join',
            meeting_id:''+meeting_id,
            redirect_to: window.location.href,
            verify_string: string,
        };
        this.http.post(param).subscribe((res) => {
            if(res['error']==false)
                this.route.navigateByUrl(res['data']['url']);
            else{
                this.translate.get("something_went_wrong_text").subscribe(text=>{
                    this.translate.get("error_text").subscribe(error_text=>{
                        this.toster.error(text, error_text, {closeButton:true});
                    })
                });
            }
        })
    }
}
