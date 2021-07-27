import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss']
})
export class PackageDetailsComponent implements OnInit {
  public package_id = 0;
  public package_data:any = '';
  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.package_id = param.id;
      if (this.package_id != undefined) {
        this.getPackage();
      }
      else{
          this.package_id = 0;
      }
    });
  }

  public getPackage() {
    let data = { url: 'get-package/' + this.package_id };
    this.http.nonAuthenticatedPost(data).subscribe((res) => {
      if (res['error'] == false) {
        this.package_data = res['data']['package_data'];        
      }
    });
  }


}
