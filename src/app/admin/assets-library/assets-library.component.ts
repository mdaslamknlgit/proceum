import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assets-library',
  templateUrl: './assets-library.component.html',
  styleUrls: ['./assets-library.component.scss'],
})
export class AssetsLibraryComponent implements OnInit {
  @Input() data = {};
  public activeTab = 'documents';
  public current_path = 'documents';
  public current_path_list = ['documents'];
  public files = [];
  public directories = [];
  public bucket_path = '';
  public preview_path = '';
  public all_files: ReplaySubject<any> = new ReplaySubject<any>(1);
  search_images = '';
  public properties_popup: boolean = false;
  public file_details = [];
  constructor(private http: CommonService, private toster: ToastrService) {}

  ngOnInit(): void {
    this.openFolder(this.current_path);
  }
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
  showPropertisModal(path, image_path) {
    this.preview_path = image_path
      ? '../../../assets/images/' + image_path
      : this.bucket_path + path;
    this.properties_popup = true;
    let param = { url: 'get-file-details', path: path };
    this.http.post(param).subscribe((res) => {
      this.file_details = res['data'];
      this.http.setChildData(this.file_details);
    });
  }
  ClosePropertisModal() {
    this.properties_popup = false;
  }
  uploadFiles(event) {
    const uploadData = new FormData();
    let files = event.target.files;
    console.log(files);
    for (var i = 0; i < files.length; i++) {
      uploadData.append('file' + i, files[i]);
    }
    uploadData.append('path', this.current_path);
    uploadData.append('number_files', files.length);
    let param = { url: 'upload-files' };
    this.http.imageUpload(param, uploadData).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success('Files successfully uploaded.', 'File Uploaded');
        this.openFolder(this.current_path);
      }
    });
  }
  deleteFile(path) {
    let param = { url: 'delete-file', path: path };
    this.http.post(param).subscribe((res) => {
      this.toster.success('Files successfully Deleted.', 'File Deleted');
      this.openFolder(this.current_path);
      this.ClosePropertisModal();
    });
  }
  downloadFile(file) {
    let path = file.split('/').join('|');
    window.location.href = environment.apiUrl + 'download-file/' + path;
  }
}
