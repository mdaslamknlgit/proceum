import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-student-topbar',
  templateUrl: './student-topbar.component.html',
  styleUrls: ['./student-topbar.component.scss'],
})
export class StudentTopbarComponent implements OnInit {
  public sidemenu_status: string = sessionStorage.getItem('sidemenu');
  public user;
  constructor(private http: CommonService, private route: Router) {
    this.http.menu_status = sessionStorage.getItem('sidemenu');
  }
  ngOnInit(): void {
    this.user = this.http.getUser();
  }

  toggleSidemenu(param) {
    this.sidemenu_status =
      this.sidemenu_status == 'sd_opn' ? 'sd_cls' : 'sd_opn';
    sessionStorage.setItem('sidemenu', this.sidemenu_status);
    this.http.menu_status = this.sidemenu_status;
  }

  logout() {
    let login_id = JSON.parse(atob(sessionStorage.getItem('user'))).login_id;
    let params = { url: 'logout', login_id: login_id };
    this.http.post(params).subscribe((res) => {
      this.http.removeSession();
      this.route.navigate(['/login']);
    });
  }
}
