import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
    public meetings = [];
    constructor(private http: CommonService, public translate: TranslateService) { 
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
}
