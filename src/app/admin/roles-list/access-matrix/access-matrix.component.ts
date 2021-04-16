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
  roles = [];
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
  checkAccess(permissions, value) {
    if (permissions['permisions'] != null) {
      let permissions_array = permissions['permisions'].split(',');
      if (permissions_array.includes('' + value)) return true;
      else return false;
    }
  }
  setAccess(value, role_id) {
    let access_number = value.source.value;
    let access = value.checked;
    let param = {
      url: 'role/access-matrix',
      access_number: access_number,
      access: access,
      role_id: role_id,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success');
      } else {
        this.toster.error(res['message'], 'Error');
      }
    });
  }
}
