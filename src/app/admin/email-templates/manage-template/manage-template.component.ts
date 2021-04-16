import { Component, OnInit, Inject } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CommonService } from 'src/app/services/common.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { UploadAdapter } from 'src/app/admin/custom-pages/UploadAdapter';

@Component({
  selector: 'app-create',
  templateUrl: './manage-template.component.html',
  styleUrls: ['./manage-template.component.scss'],
})
export class ManageTemplateComponent implements OnInit {
  public template = {
    id: '0',
    template: '',
    template_subject: '',
    template_name: '',
    template_placeholders: '',
  };
  public isupdated = false;
  public Editor = ClassicEditor;
  public title = '';
  constructor(
    private http: CommonService,
    private toaster: ToastrService,
    public dialogRef: MatDialogRef<ManageTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  close(): void {
    this.dialogRef.close(this.isupdated);
  }
  ngOnInit(): void {
    let param = { id: this.data.id };
    this.getTemplate(param);
  }

  onReady(eventData) {
    let apiUrl = environment.apiUrl;
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
        var data =new UploadAdapter(loader,apiUrl+'upload-image');
        return data;
    };
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
            template_subject: template['subject'],
            template_name: template['name'],
            template_placeholders: template['placeholders'],
          };
        }
      });
    } else {
      this.title = 'Create Template';
    }
  }
  submitTemplate() {
    if (this.template.template == '') {
      this.toaster.error('Template content is required', 'Error', {
        progressBar: true,
      });
      return false;
    }
    let param = this.template;
    param['url'] = 'email-template';
    if (this.template.id == '0') {
      this.http.post(param).subscribe((res) => {
        if (res['error'] == false) {
          this.isupdated = true;
          this.toaster.success(res['message'], 'Success', {
            progressBar: true,
          });
          this.close();
        } else {
          this.toaster.error(res['message'], 'Error', { progressBar: true });
        }
      });
    } else {
      param['url'] = param['url'] + '/' + this.template.id;
      this.http.put(param).subscribe((res) => {
        if (res['error'] == false) {
          this.isupdated = true;
          this.toaster.success(res['message'], 'Success', {
            progressBar: true,
          });
          this.close();
        } else {
          this.toaster.error(res['message'], 'Error', { progressBar: true });
        }
      });
    }
  }
}
export interface DialogData {
  id: number;
}
