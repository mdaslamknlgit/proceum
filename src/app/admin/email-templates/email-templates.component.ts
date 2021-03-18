import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss'],
})
export class EmailTemplatesComponent implements OnInit {
  public template = {
    email_template: '',
    email_name: '',
  };
  public Editor = ClassicEditor;
  constructor() {}

  ngOnInit(): void {}
}
