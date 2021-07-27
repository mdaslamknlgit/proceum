import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

interface CurriculumNode {
  id?: number;
  name: string;
  curriculum_id?: number;
  selected?: boolean;
  indeterminate?: boolean;
  parentid?: number;
  is_curriculum_root?: boolean;
  children?: CurriculumNode[];
  has_children?: boolean;
  ok?: boolean;
}
//const TREE_DATA: CurriculumNode[]= [];

@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.scss']
})
export class CreatePackageComponent implements OnInit {

  public user = [];
  public package_id = 0;
  public package_prices = [{pk_id:0, country_id:'', price_amount:'', status:'1', placeholder:'Price'}];
  public sample_videos = [{pk_id:0, title:'', source_type:'YOUTUBE', video_source:'', video_source_exist:'', title_exist:'', status:1}];
  public faqs = [{pk_id:0, question:'', answer:'', status:1}];
  public video_types = [{name: "KPoint", value:'KPOINT'}, {name: "Youtube", value:'YOUTUBE'}]
  public countries = [];
  public package_name = '';
  public package_img = '';
  public package_desc = '';
  public pricing_model = 'fixed';
  public courses_ids_csv = '';
  public applicable_to_university = '';
  public applicable_to_college = '';
  public applicable_to_institute = '';
  public valid_up_to : any = '';
  public billing_frequency = 'monthly';
  public today_date = new Date();
  public edit_model_status = false;
  public courses_arr = [];
  public courses_div = false;
  public selected_courses = [];
  public selected_countires = [];
  all_countries: ReplaySubject<any> = new ReplaySubject<any>(1);
  
  //Code starts here for course selection
  treeControl = new NestedTreeControl<CurriculumNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CurriculumNode>();

  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  hasChild = (_: number, node: CurriculumNode) =>
    !!node.children && node.children.length > 0;

  setParent(data, parent) {
   
    if(data.children === undefined){
      data.has_children = false;
    }else{
      data.has_children = true;
    }
    data.parent = parent;
    if (data.children) {
      data.children.forEach(x => {
        this.setParent(x, data);
      });
    }
  }

  checkAllParents(node) {
    if (node.parent) {
      const descendants = this.treeControl.getDescendants(node.parent);
      node.parent.selected = descendants.every(child => child.selected);
      node.parent.indeterminate = descendants.some(child => child.selected);
      this.checkAllParents(node.parent);
    }
  }

  todoItemSelectionToggle(checked, node) {
    node.selected = checked;
    if (node.children) {
      node.children.forEach(x => {
        this.todoItemSelectionToggle(checked, x);
      });
    }
    this.checkAllParents(node);
  }

  setChildOk(text: string, node: any) {
    node.forEach(x => {
      x.ok = x.name.indexOf(text) >= 0;
      if (x.parent) this.setParentOk(text, x.parent, x.ok);
      if (x.children) this.setChildOk(text, x.children);
    });
  }
  
  setParentOk(text, node, ok) {
    node.ok = ok || node.ok || node.name.indexOf(text) >= 0;
    if (node.parent) this.setParentOk(text, node.parent, node.ok);
  }

  //For check the values
  getList2(node: any, result: any = null) {
    result = result || {};
    node.forEach(x => {
      result[x.name] = {};
      result[x.name].ok = x.ok;
      if (x.children) result[x.name].children = this.getList2(x.children);
    });
    return result;
  }
  //Another way to check the values, we can not use {{datasource.node}}
  getList(node: any) {
    return node.map(x => {
      const r: any = {
        name: x.name + ' - ' + x.ok,
        children: x.children ? this.getList(x.children) : null
      };
      if (!r.children) delete r.children;
      return r;
    });
  }

  submitCourses() {
    let result = [];let selected_ids = [];
    this.dataSource.data.forEach(node => {
      result = result.concat(
        this.treeControl
          .getDescendants(node)
          .filter(x => x.selected && x.id).map(x => [x.id,x.curriculum_id,x.has_children,x.name,x.parentid])
      );
      selected_ids = selected_ids.concat(
        this.treeControl
          .getDescendants(node)
          .filter(x => x.selected && x.id).map(x => x.id)
      );
    });
    this.selected_courses = result.filter(function(node) {
      if(selected_ids.indexOf(node[4]) == -1){
        return node;
      }
    }).map(x => x[3]);
    console.log(this.selected_courses);
    if(this.selected_courses){
      this.courses_div = true;
      this.edit_model_status = false;
      this.courses_ids_csv = selected_ids.join();
      this.courses_arr = result;
    }else{
      this.courses_div = false;
      this.edit_model_status = false;
      this.courses_ids_csv = '';
      this.courses_arr = result;
    }
    console.log(this.courses_ids_csv);
  }

  fillDivWithSelectedCourses(result,selected_ids){
    this.selected_courses = result.filter(function(node) {
      if(selected_ids.indexOf(node[4]) == -1){
        return node;
      }
    });
  }

  filterSelectedItems(){
    
  }

  ngOnInit(): void {
    this.getCountries();
    this.getCurriculumnHierarchy();
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
          //console.log(valid_date);
          this.valid_up_to = new Date(
            package_data.valid_up_to
          );
          //console.log(this.valid_up_to); 
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
    this.package_prices.push({pk_id:0, country_id:'', price_amount:'', status:'1', placeholder:'Price'});
  }

  removePackagePrice(index){
    this.package_prices[index]['status'] = "0";
  }

  createPackageService(){
    if(this.applicable_to_university == '' && this.applicable_to_college == '' && this.applicable_to_institute == ''){
      this.toster.error("Applicable to is required", 'Required!', { closeButton: true });
      return;
    }
    if(this.courses_ids_csv == ''){
      this.toster.error("Please select courses!", 'Required!', { closeButton: true });
      return;
    }

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
    let params = { url: 'create-package', form_data: form_data };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.navigateTo('prices-package-management');
      } else {
          this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }

  getCurriculumnHierarchy(){
    let params = { url: 'get-curriculumn-hierarchy'};
    this.http.post(params).subscribe((res) => {      
      if (res['error'] == false) {
        this.dataSource.data = res['data'];
        Object.keys(this.dataSource.data).forEach(x => {
          this.setParent(this.dataSource.data[x], null);
        });
      } else {
          this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }

  addCurrencyToField(currency,index,currency_id){
    if(this.selected_countires.indexOf(currency_id) === -1){
      this.package_prices[index]['placeholder'] = currency.toUpperCase();
      this.prepareSelectedCountriesArr();
    }
  }

  allAlphabetsWithSpaces(event){   
    var inp = String.fromCharCode(event.keyCode);

    if (/^[a-zA-Z ]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  emptyFields(){
    this.package_id = 0;
    this.package_name = '';
    this.package_img = '';
    this.package_desc = '';
    this.pricing_model = '';
    this.package_prices = [{pk_id:0, country_id:'', price_amount:'', status:'1', placeholder:'Price'}];
    this.courses_ids_csv = '';
    this.applicable_to_university = '';
    this.applicable_to_college = '';
    this.applicable_to_institute = '';
    this.valid_up_to = '';
    this.billing_frequency = '';
  }

  navigateTo(url){
    let user = this.http.getUser();
    if(user['role']== '1'){
        url = "/admin/"+url;
    }
    //Later we must change this
    if(user['role']== '3' || user['role']== '4' || user['role']== '5' || user['role']== '6' || user['role']== '7'){
      url = "/admin/"+url;
    }
      this.router.navigateByUrl(url);
  }

  prepareSelectedCountriesArr(){
    this.selected_countires = [];
    let prices = this.package_prices;
    this.selected_countires = prices.map(x => x.country_id);
  }

  addVideo(){
    this.sample_videos.push({pk_id:0, title:'', source_type:'YOUTUBE', video_source:'', video_source_exist:'', title_exist:'', status :1});
  }

  addFaq(){
    this.faqs.push({pk_id:0, question:'', answer:'', status :1});
  }
  
  removeSampleVideo(index){
    this.sample_videos[index]['status'] = 0;
  }

  removeFaq(index){
    this.faqs[index]['status'] = 0;
  }

  checkVideoTitleExist(index){
    let title = this.sample_videos[index]['title'];
    let titles = [];
    //Get all the titles
    for(let i = 0; i < this.sample_videos.length;i++){
      if(i !== index){
        titles.push(this.sample_videos[i]['title']);
      }
    }
    //Check title repeated
    if(titles.length > 0 && (titles.indexOf(title) !== -1)){
      this.sample_videos[index]['title_exist'] = "Ttile already given!";
      console.log("shash");
    }
    
  }
}
