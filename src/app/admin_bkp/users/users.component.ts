import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  constructor(private http: CommonService) {}
  public user: User = { name: '', email: '', password: '', role: '' };
  ngOnInit(): void {
    let param = this.user;
    param['url'] = 'user';
    this.http.get(param).subscribe((res) => {
      console.log(res);
    });
  }
  createUser() {
    let param = this.user;
    param['url'] = 'user';
    this.http.post(param).subscribe((res) => {
      console.log(res);
    });
  }
  getUser() {
    let param = this.user;
    param['url'] = 'user/1';
    this.http.get(param).subscribe((res) => {
      console.log(res);
    });
  }
  updateUser() {
    let param = this.user;
    param['url'] = 'user/3';
    this.http.put(param).subscribe((res) => {
      console.log(res);
    });
  }
  deleteUser() {
    let param = this.user;
    param['url'] = 'user/3';
    this.http.delete(param).subscribe((res) => {
      console.log(res);
    });
  }
}
export interface User {
  name: String;
  email: String;
  role: any;
  password: String;
}
