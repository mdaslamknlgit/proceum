import { Component, OnInit, Inject } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-create',
  templateUrl: './manage-template.component.html',
  styleUrls: ['./manage-template.component.scss'],
})
export class ManageTemplateComponent implements OnInit {
  public template = {
    id: '0',
    template: '',
    template_title: '',
    template_name: '',
  };
  public Editor = ClassicEditor;
  public title = '';
  constructor(
    private http: CommonService,
    public dialogRef: MatDialogRef<ManageTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  close(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    let param = { id: this.data.id };
    this.getTemplate(param);
  }
  getTemplate(data) {
    if (data.id > 0) {
      this.title = 'Edit Template';
      let param = { url: 'email-template/' + data.id };
      this.http.get(param).subscribe((res) => {
        if (res['error'] == false) {
          let template = res['data']['template'];
          this.template = {
            id: template['id'],
            template: template['template'],
            template_title: template['title'],
            template_name: template['name'],
          };
        }
      });
    } else {
      this.title = 'Create Template';
    }
  }
  submitTemplate() {
    let param = this.template;
    param['url'] = 'email-template';
    if (this.template.id == '') {
      this.http.post(param).subscribe((res) => {
        console.log(res);
      });
    } else {
      param['url'] = param['url'] + '/' + this.template.id;
      this.http.put(param).subscribe((res) => {
        console.log(res);
      });
    }
  }
}
export interface DialogData {
  id: number;
}
