import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss']
})
export class EditPackageComponent implements OnInit {
  displayedColumns: string[] = ['Sno', 'Course', 'Topic', 'Action'];
  public user = [];
  public package_id = 0;
  public package_prices = [{ pk_id: 0, country_id: '', price_amount: '', status: '1', placeholder: 'Price' }];
  public sample_videos = [];
  public faqs = [];
  public video_types = [{ name: "KPoint", value: 'KPOINT' }, { name: "Youtube", value: 'YOUTUBE' }]
  public countries = [];
  public package_name = '';
  public package_img = '';
  public package_desc = '';
  public pricing_model = '';
  public duration = '';
  public applicable_to_university = '';
  public applicable_to_college = '';
  public applicable_to_institute = '';
  public applicable_to_individual = '';
  public valid_up_to: any = '';
  public billing_frequency = '';
  public today_date = new Date();
  public edit_model_status = false;
  public course_count = 1;
  public courses_arr = [];
  public courses_div = false;
  public selected_courses = [];
  public selected_countires = [];
  public source_type = 'YOUTUBE';
  public title = '';
  public video_source = '';
  public title_error = '';
  public video_url_error = '';
  public hide_source_type = false;
  public sample_video_index = -1;
  public question = '';
  public answer = '';
  public faqs_index = -1;
  public pk_id = 0;
  public question_error = '';
  public answer_error = '';
  public addons_arr = [];
  public addons_list = [];
  public all_addons_list = [];
  public selected_course = '';
  public curriculums = [];
  public curriculum_id = '';
  public topic = '';
  selected_topic = '';
  public is_topic_exist = false;
  public enable_add_button = false;
  public selected_topics = [];
  public delete_topics = [];
  public parent_ids = [];
  public topics: ReplaySubject<any> = new ReplaySubject<any>(1);
  public dataSource = new MatTableDataSource();
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
      if (this.package_id != undefined && this.package_id) {
        this.getPackage();
      }
      else {
        this.toster.error('Invalid Package!', 'Error');
        this.navigateTo('prices-package-management');
      }
    });
    this.getCountries();
    this.getcurriculums();
    this.getAddons();
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
        this.duration = package_data.duration;
        if (res['data']['selected_topics'].length > 0) {
          this.selected_topics = res['data']['selected_topics'];
          this.dataSource = new MatTableDataSource(this.selected_topics);
        }
        this.applicable_to_university = package_data.applicable_to_university;
        this.applicable_to_college = package_data.applicable_to_college;
        this.applicable_to_institute = package_data.applicable_to_institute;
        this.applicable_to_individual = package_data.applicable_to_individual;
        this.billing_frequency = package_data.billing_frequency;

        //For reccuring datetime
        if (package_data.valid_up_to !== null) {
          let valid_date = package_data.valid_up_to.split('-');
          //console.log(valid_date);
          this.valid_up_to = new Date(
            package_data.valid_up_to
          );
          this.today_date = this.valid_up_to;
        }
        this.addons_arr = res['data']['addons_arr'];
        // For package prices
        if (res['data']['package_prices_data'].length > 0) {
          let prices = res['data']['package_prices_data'];
          this.selected_countires = prices.map(x => x.country_id);
          this.package_prices = res['data']['package_prices_data'];
        }
        this.sample_videos = res['data']['sample_videos'];
        this.faqs = res['data']['faqs'];
      } else {
        this.toster.error(res['message'], 'Error');
        this.navigateTo('prices-package-management');
      }
    });
  }

  getCountries() {
    let param = { url: 'get-countries' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.countries = res['data']['countries'];
        if (this.countries != undefined) {
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

  addPackagePriceField() {
    this.package_prices.push({ pk_id: 0, country_id: '', price_amount: '', status: '1', placeholder: 'Price' });
  }

  removePackagePrice(index) {
    this.package_prices[index]['status'] = "0";
  }

  updatePackageService() {

    if (this.applicable_to_university == '' && this.applicable_to_college == '' && this.applicable_to_institute == '' && this.applicable_to_individual == '') {
      this.toster.error("Applicable to is required", 'Error', { closeButton: true });
      return;
    }
    if (this.selected_topics.length < 1) {
      this.toster.error("Please select courses!", 'Required!', { closeButton: true });
      return;
    }
    let form_data = {
      package_id: this.package_id,
      package_name: this.package_name,
      package_img: this.package_img,
      package_desc: this.package_desc,
      pricing_model: this.pricing_model,
      duration: this.duration,
      package_prices: this.package_prices,
      sample_videos: this.sample_videos,
      faqs: this.faqs,
      selected_topics: this.selected_topics,
      delete_topics: this.delete_topics,
      applicable_to_university: this.applicable_to_university,
      applicable_to_college: this.applicable_to_college,
      applicable_to_institute: this.applicable_to_institute,
      applicable_to_individual: this.applicable_to_individual,
      valid_up_to: this.valid_up_to,
      billing_frequency: this.billing_frequency,
      addons_arr: this.addons_arr,
    };
    let params = { url: 'update-package', form_data: form_data };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        this.navigateTo('prices-package-management');
      } else {
        this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }

  addCurrencyToField(currency, index, currency_id) {
    if (this.selected_countires.indexOf(currency_id) === -1) {
      this.package_prices[index]['placeholder'] = currency.toUpperCase();
      this.prepareSelectedCountriesArr();
    }
  }

  allAlphabetsWithSpaces(event) {
    var inp = String.fromCharCode(event.keyCode);

    if (/^[a-zA-Z ]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  prepareSelectedCountriesArr() {
    this.selected_countires = [];
    let prices = this.package_prices;
    this.selected_countires = prices.map(x => x.country_id);
  }

  addVideo() {
    if (this.source_type != "" && this.title != "" && this.video_source != "") {
      //Check youtube url is valid
      let valid = this.validateYouTubeUrl(this.video_source);
      if (!valid) {
        this.video_url_error = 'Invalid youtube URL!';
        return;
      }
      //Check any duplicates found on title or video source
      let duplicate_found = this.checkSampleVideoDuplicates(this.title, this.video_source);
      if (duplicate_found) {
        return;
      } else {
        if (this.sample_video_index !== -1) {
          //Update
          this.sample_videos[this.sample_video_index] = { pk_id: this.pk_id, title: this.title, source_type: 'YOUTUBE', video_source: this.video_source, status: 1 };
          this.sample_video_index = -1;
          this.pk_id = 0;
        } else {
          this.sample_videos.push({ pk_id: 0, title: this.title, source_type: 'YOUTUBE', video_source: this.video_source, status: 1 });
        }
        //Clear data
        this.title = '';
        this.video_source = '';
      }
    } else {
      if (this.title == '') {
        this.title_error = "Title required!";
      }
      if (this.video_source == '') {
        this.video_url_error = 'Video URL required!';
      }
    }

  }

  checkSampleVideoDuplicates(title, video_source) {
    this.title_error = '';
    this.video_url_error = '';
    //llop through titles
    for (let i = 0; i < this.sample_videos.length; i++) {
      if ((title == this.sample_videos[i]['title'] || video_source == this.sample_videos[i]['video_source']) && (this.sample_videos[i]['status'] != 0 && this.sample_videos[i]['status'] != 2)) {
        if (title == this.sample_videos[i]['title']) {
          this.title_error = 'Title already given!';
        }
        if (video_source == this.sample_videos[i]['video_source']) {
          this.video_url_error = 'Video url already given!';
        }
        return true;
        break;
      }
    }
    if (this.title_error || this.video_url_error) {
      return true;
    } else {
      return false;
    }

  }

  checkTitle() {
    this.title_error = '';
    //Loop through titles
    for (let i = 0; i < this.sample_videos.length; i++) {
      if (this.title == this.sample_videos[i]['title'] && (this.sample_videos[i]['status'] != 0 && this.sample_videos[i]['status'] != 2)) {
        this.title_error = 'Title already given!';
        break;
      }
    }
  }

  checkURL() {
    this.video_url_error = '';
    //Loop through video urls
    for (let i = 0; i < this.sample_videos.length; i++) {
      if (this.video_source == this.sample_videos[i]['video_source'] && (this.sample_videos[i]['status'] != 0 && this.sample_videos[i]['status'] != 2)) {
        this.video_url_error = 'Video url already given!';
        break;
      }
    }
  }


  editVideo(index) {
    this.title = this.sample_videos[index]['title'];
    this.video_source = this.sample_videos[index]['video_source'];
    this.sample_video_index = index;
    this.pk_id = this.sample_videos[index]['pk_id'];
    this.sample_videos[index]['status'] = 2;

  }

  deleteVideo(index) {
    this.sample_videos[index]['status'] = 0;
  }

  addFaq() {
    if (this.question != "" && this.answer != "") {
      //Check any duplicates found 
      let duplicate_found = this.checkFaqsDuplicates(this.question);
      if (duplicate_found) {
        return;
      } else {
        if (this.faqs_index !== -1) {
          //Update
          this.faqs[this.faqs_index] = { pk_id: this.pk_id, question: this.question, answer: this.answer, status: 1 };
          this.faqs_index = -1;
          this.pk_id = 0;
        } else {
          this.faqs.push({ pk_id: 0, question: this.question, answer: this.answer, status: 1 });
        }
        //Clear data
        this.question = '';
        this.answer = '';
      }
    } else {
      if (this.question == '') {
        this.question_error = "Title required!";
      }
      if (this.answer == '') {
        this.answer_error = 'Video URL required!';
      }
    }
  }

  checkFaqsDuplicates(question) {
    this.question_error = '';
    //llop through titles
    for (let i = 0; i < this.faqs.length; i++) {
      if (question == this.faqs[i]['question'] && (this.faqs[i]['status'] != 0 && this.faqs[i]['status'] != 2)) {
        this.question_error = 'Question already given!';
        return true;
        break;
      }
    }
    return false;
  }

  checkQuestion() {
    this.question_error = '';
    //Loop through titles
    for (let i = 0; i < this.faqs.length; i++) {
      if (this.title == this.faqs[i]['question'] && (this.faqs[i]['status'] != 0 && this.faqs[i]['status'] != 2)) {
        this.question_error = 'Question already given!';
        break;
      }
    }
  }

  editFaq(index) {
    this.question = this.faqs[index]['question'];
    this.answer = this.faqs[index]['answer'];
    this.faqs_index = index;
    this.pk_id = this.faqs[index]['pk_id'];
    this.faqs[index]['status'] = 2;

  }

  deleteFaq(index) {
    this.faqs[index]['status'] = 0;
  }

  submitData() {
    if (this.package_name == "" || this.package_desc == "" || this.pricing_model == "" || this.duration == "" || this.package_prices.length < 1 || this.selected_topics.length < 1 || (this.applicable_to_university == "" && this.applicable_to_college == "" && this.applicable_to_institute == "" && this.applicable_to_individual == "") || this.valid_up_to == "" || this.billing_frequency == "") {
      this.toster.error("Please fill required Basic details first!", 'Error', { closeButton: true });
      return;
    }
    this.updatePackageService();
  }

  validateYouTubeUrl(url) {
    if (url != undefined || url != '') {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[2].length == 11) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getAddons() {
    let params = { url: 'get-addons' };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.addons_list = res['data'];
        this.all_addons_list = res['data'];
      } else {
        //this.course_count = 0;
        //this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }
  searchAddon(search) {
    this.addons_list = this.all_addons_list.filter(item => item.curriculumn_name.toLowerCase().includes(search.toLowerCase()));
  }
  navigateTo(url) {
    let user = this.http.getUser();
    if (Object.values(environment.ALL_ADMIN_SPECIFIC_ROLES).indexOf(Number(user['role'])) > -1) {
      url = "/admin/" + url;
      this.router.navigateByUrl(url);
    }
  }

  getcurriculums(type = 1, val = 0) {
    this.curriculum_id = '';
    let params = {
      url: 'get-courses-or-qbanks', type: type, assessment_type: val == 1 ? 1 : 0,
    };

    this.http.post(params).subscribe((res) => {
      this.topics.next([]);
      this.topic = '';
      if (res['error'] == false) {
        if (res['data']['list'].length > 0)
          this.curriculums = res['data']['list'];
        else
          this.curriculums = [];
      }
    });
  }
  getLabels() {
    this.level_options = [];
    this.all_level_options = [];
    this.selected_level = [];
    this.level_id = 0;
    let param = {
      url: 'get-curriculum-labels',
      curriculum_id: this.curriculum_id,
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        //this.applyFilters();
        let data = res['data'];
        this.level_options[1] = data['level_1'];
        this.all_level_options[1] = data['level_1'];
        this.curriculum_labels = data['curriculum_labels'];
        if (this.curriculum_labels.length == 0) {
          this.level_options = [];
          this.all_level_options = [];
          this.selected_level = [];
        }
      }
    });
  }
  ucFirst(string) {
    return this.http.ucFirst(string);
  }
  public curriculum_labels = [];
  public level_options = [];
  public all_level_options = [];
  public selected_level = [];
  public level_id = 0;
  getLevels(level_id) {
    this.level_id = level_id;
    this.topic = this.selected_level[level_id];
    this.is_topic_exist = false;
    let param = {
      url: 'get-levels-by-level',
      request_from: 'package',
      step_id: this.selected_level[level_id],
    };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        let data = res['data'];
        this.level_options[level_id + 1] = data['steps'];
        this.all_level_options[level_id + 1] = data['steps'];
        this.level_options.forEach((opt, index) => {
          if (index > level_id + 1) this.level_options[index] = [];
        });
        this.selected_level.forEach((opt, index) => {
          if (index > level_id) this.selected_level[index] = 0;
        });
        if (data['steps']) {
          this.enable_add_button = true;
        }

      }
    });
  }
  searchLevelByName(search, level) {
    let options = this.all_level_options[level];
    this.level_options[level] = options.filter(
      item => item.level_name.toLowerCase().includes(search.toLowerCase())
    );
  }
  setCourseText(args) {
    this.curriculums.forEach(res => {
      if (res['pk_id'] == args)
        this.selected_course = res['curriculumn_name'];
    })
  }
  addTopic() {
    let dropdown = this.level_options[this.level_id];
    let selectedObj = dropdown.filter((item) => this.topic == item.pk_id);
    let removeIndexs = [];
    let i = 0;
    //remove when topic finds in parent or already added
    this.selected_topics.forEach((item, index, object) => {
      let parentExist;
      if (item.source_parent_ids != null) {
        parentExist = item.source_parent_ids.split(',').includes(String(this.topic));
        if (parentExist) {
          removeIndexs.push(index)
        }
      }
      let topicExist = item.topic == this.topic;
      if(selectedObj[0].parent_ids != undefined && selectedObj[0].parent_ids != null){
        let exist = selectedObj[0].parent_ids.split(',').includes(String(item.topic));
        if (exist) {
          i++;
          this.toster.error("You have already added selelcted level parent!", 'Error', { closeButton: true });
          return false;
        }
      }
      if (topicExist) {
        removeIndexs.push(index)
      }
    });
    if (i) {
      return false;
    }
    removeIndexs.forEach(i => this.removeTopic(i));
    let data = {
      pk_id: 0,
      course_qbank: this.curriculum_id,
      course_qbank_text: this.selected_course,
      topic: this.topic,
      topic_text: selectedObj[0].level_name,
      is_delete: 0,
      level_id: selectedObj[0].level_id,
      source_parent_ids: selectedObj[0].parent_ids,
    };
    this.selected_topics.push(data);
    this.dataSource = new MatTableDataSource(this.selected_topics);
    this.curriculum_id = '';
    this.selected_course = '';
    this.topic = '';
    this.selected_topic = '';
    this.level_options = [];
    this.all_level_options = [];
    this.selected_level = [];
    this.level_id = 0;
    this.curriculum_labels = [];
    this.enable_add_button = false;
    console.log(this.selected_topics);    
  }

  removeTopic(index) {
    if (this.selected_topics[index]['pk_id'] > 0) {
      this.delete_topics.push(this.selected_topics[index]['pk_id']);
    }
    this.selected_topics.splice(index, 1);
    this.dataSource = new MatTableDataSource(this.selected_topics);
  }
}
