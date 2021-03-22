import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CommonService } from 'src/app/services/common.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  public template = {
    id: '2',
    template: '',
    template_title: '',
    template_name: '',
  };
  public Editor = ClassicEditor;
  constructor(private http: CommonService) {}
  ngOnInit(): void {
    this.getTemplates();
  }
  getTemplates() {
    let param = { url: 'email-template' };
    this.http.get(param).subscribe((res) => {
      console.log(res);
    });
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
