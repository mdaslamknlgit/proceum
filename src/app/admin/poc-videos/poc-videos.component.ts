import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-poc-videos',
  templateUrl: './poc-videos.component.html',
  styleUrls: ['./poc-videos.component.scss']
})
export class PocVideosComponent implements OnInit {

  public url = '';
  constructor(
    private http: CommonService,
    public toster: ToastrService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    let param = { url: 'poc-videos'};
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        window.location.href = res['message'];
        /*this.url = res['message'];
        window.open(
          this.url,
          '_blank' // <- This is what makes it open in a new window.
        );*/
        //console.log(res['message']);
      } else {
        this.toster.info(res['message'], 'Info');
      }
      
    });
  }

}
