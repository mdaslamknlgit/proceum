import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss']
})
export class EditPackageComponent implements OnInit {

  public user = [];
  public package_id = 0;
  public package_prices = [{pk_id:0, country_id:'', price_amount:'', status:'',placeholder:'0.00'}];
  public countries = [];
  public package_name = '';
  public package_img = '';
  public package_desc = '';
  public pricing_model = '';
  public courses_ids_csv = '';
  public applicable_to_university = '';
  public applicable_to_college = '';
  public applicable_to_institute = '';
  public valid_up_to : any = '';
  public billing_frequency = '';
  public today_date = new Date();
  all_countries: ReplaySubject<any> = new ReplaySubject<any>(1);


  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.http.getUser();
    this.activatedRoute.params.subscribe((param) => {
      this.package_id = param.id;
      if (this.package_id != undefined) {
        this.getPackage();
      }
      else{
          this.package_id = 0;
      }
    });
    this.getCountries();
  }
  getPackage() {
    let data = { url: 'edit-package/' + this.package_id };
    this.http.post(data).subscribe((res) => {
      if (res['error'] == false) {
        let package_data = res['data']['package_data'];
        this.package_name = package_data.package_name;
        this.package_img = package_data.package_img;
        this.package_desc = package_data.package_desc;
        this.pricing_model = package_data.pricing_model;
        this.applicable_to_university = package_data.applicable_to_university;
        this.applicable_to_college = package_data.applicable_to_college;
        this.applicable_to_institute = package_data.applicable_to_institute;
        this.billing_frequency = package_data.billing_frequency;
        //For reccuring datetime
        if(package_data.valid_up_to !== null){
          let valid_date = package_data.valid_up_to.split('-');
          console.log(valid_date);
          this.valid_up_to = new Date(
            package_data.valid_up_to
          );
          console.log(this.valid_up_to); 
          this.today_date = this.valid_up_to;
        }
        // For package prices
        if(res['data']['package_prices_data'].length > 0){
          this.package_prices = res['data']['package_prices_data'];
        }
      }
    });
  }

  getCountries(){
    let param = { url: 'get-countries' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.countries = res['data']['countries'];
        if(this.countries != undefined){
          this.all_countries.next(this.countries.slice());
          
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  uploadImage(event) {
    let allowed_types = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];
    const uploadData = new FormData();
    let files = event.target.files;
    let file = files[0];
    if (files.length == 0) return false;
    let ext = file.name.split('.').pop().toLowerCase();
    if (allowed_types.includes(ext)) {
      uploadData.append('upload', file);
    } else {
      this.toster.error(
        ext +
          ' Extension not allowed file (' +
          files.name +
          ') not uploaded'
      );
      return false;
    }
    let param = { url: 'upload-picture' };
    this.http.imageUpload(param, uploadData).subscribe((res) => {
      console.log(res);
      if (res['error'] == false) {
        //this.toastr.success('Files successfully uploaded.', 'File Uploaded');
        this.package_img = res['url'];
      }
    });
  }


  addPackagePriceField(){
    this.package_prices.push({pk_id:0, country_id:'', price_amount:'', status:'', placeholder:'0:00'});
  }
  removePackagePrice(index){
    this.package_prices[index]['status'] = "delete";
  }

  updatePackageService(){
    let form_data = {
      package_id : this.package_id,
      package_name : this.package_name,
      package_img : this.package_img,
      package_desc : this.package_desc,
      pricing_model : this.pricing_model,
      package_prices : this.package_prices,
      courses_ids_csv : this.courses_ids_csv,
      applicable_to_university : this.applicable_to_university,
      applicable_to_college : this.applicable_to_college,
      applicable_to_institute : this.applicable_to_institute,
      valid_up_to : this.valid_up_to,
      billing_frequency : this.billing_frequency,
    };
    let params = { url: 'update-package', form_data: form_data };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        //this.navigateTo('manage-content');
      } else {
          this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }

  addCurrencyToField(currency,index){
    this.package_prices[index]['placeholder'] = currency.toUpperCase();
    ;
  }

}
