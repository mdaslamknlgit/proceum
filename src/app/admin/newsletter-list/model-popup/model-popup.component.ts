import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-model-popup',
  templateUrl: './model-popup.component.html',
  styleUrls: ['./model-popup.component.scss']
})
export class ModalPopupComponent implements OnInit {

  constructor(
    private http: CommonService,
    private toaster: ToastrService,
    public dialogRef: MatDialogRef<ModalPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
id:any;
title:any;
created_at: string;
updated_at: string;
reason: string;
status: boolean;
public isupdated = false;

close(): void {
  this.dialogRef.close(this.isupdated);
}
  ngOnInit(): void {
    let param = { id: this.data.id };
    this.getTemplate(param);
  }

  getTemplate(data) {
      this.created_at="";
      this.updated_at="";
      this.reason="";
      let param = { url: 'newsletter/' + data.id };
      this.http.get(param).subscribe((res:Response) => {
        this.created_at=res.created_at;
        this.updated_at=res.updated_at;
        this.reason=res.status_reason;
        this.status=(res.status == 0)? true: false;
      });
    this.id=data.id;
    this.title="View Details";
  }

}
export interface DialogData {
  id: number;
}

export interface Response {
  created_at: any;
  updated_at: any;
  status_reason: any;
  status: number;
  id:number;
}