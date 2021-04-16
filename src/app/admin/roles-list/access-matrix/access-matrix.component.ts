import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-access-matrix',
  templateUrl: './access-matrix.component.html',
  styleUrls: ['./access-matrix.component.scss'],
})
export class AccessMatrixComponent implements OnInit {
  constructor(private http: CommonService, private toster: ToastrService) {}
  roles = [
    { role_name: 'Admin', pk_id: 1 },
    { role_name: 'Student', pk_id: 2 },
  ];
  ngOnInit(): void {
    this.getRoles();
  }
  getRoles() {
    let param = { url: 'role' };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.roles = res['data']['roles'];
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }
  setAccess(value, role_id) {
    let access_number = value.source.value;
    let access = value.checked;
    let param = { url: 'role', access_number: access_number, access: access };
    this.http.get(param).subscribe((res) => {
      if (res['error'] == false) {
        this.roles = res['data']['roles'];
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }
}
