import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-assets-library',
  templateUrl: './assets-library.component.html',
  styleUrls: ['./assets-library.component.scss'],
})
export class AssetsLibraryComponent implements OnInit {
  public activeTab = 'documents';
  public current_path = 'documents';
  public current_path_list = ['documents'];
  public files = [];
  public directories = [];
  public bucket_path = '';
  public all_files: ReplaySubject<any> = new ReplaySubject<any>(1);
  search_images = '';
  constructor(private http: CommonService) {}

  ngOnInit(): void {}
  getFiles(tab) {
    this.activeTab = tab.tab.textLabel.toLowerCase();
    this.current_path = this.activeTab;
    this.current_path_list = this.current_path.split('/');
    let param = { url: 'get-files', path: this.activeTab };
    this.http.post(param).subscribe((res) => {
      this.files = res['data']['files'];
      this.all_files.next(this.files.slice());
      this.directories = res['data']['directories'];
      this.bucket_path = res['data']['url'];
    });
  }
  filterFiles() {
    let search = this.search_images;
    if (!search) {
      this.all_files.next(this.files.slice());
      return;
    } else {
      search = this.search_images.toLowerCase();
    }
    this.all_files.next(
      this.files.filter(
        (file) =>
          file
            .substring(file.lastIndexOf('/') + 1)
            .toLowerCase()
            .indexOf(search) > -1
      )
    );
  }
  openFolder(path) {
    this.current_path = path;
    this.current_path_list = this.current_path.split('/');
    let param = { url: 'get-files', path: path };
    this.http.post(param).subscribe((res) => {
      this.files = res['data']['files'];
      this.all_files.next(this.files.slice());
      this.directories = res['data']['directories'];
      this.bucket_path = res['data']['url'];
    });
  }
  goBack() {
    let current_path_array = this.current_path.split('/');
    current_path_array.pop();
    let current_path = current_path_array.join('/');
    this.openFolder(current_path);
  }
}
