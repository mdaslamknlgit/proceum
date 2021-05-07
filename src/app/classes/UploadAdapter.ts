export class UploadAdapter {
    private loader;
    private url;
    xhr: any;
    constructor(loader,url) {
      this.loader = loader;
      this.url = url;
    }
    upload() {
      return this.loader.file
        .then(file => new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        }));
    }
    // Aborts the upload process.
    abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }
    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
      let token = sessionStorage.getItem('_token');
      const xhr = this.xhr = new XMLHttpRequest();
      xhr.open('POST',this.url, true);
      xhr.responseType = 'json';
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }
    _initListeners(resolve, reject, file) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${file.name}.`;
      xhr.addEventListener('error', () => reject(genericErrorText));
      xhr.addEventListener('abort', () => reject());
      xhr.addEventListener('load', () => {
        const response = xhr.response;
        if (!response || response.error) {
          return reject(response && response.error ? response.error.message : genericErrorText);
        }
        resolve({
          default: response.url
        });
      });
      if (xhr.upload) {
        xhr.upload.addEventListener('progress', evt => {
          if (evt.lengthComputable) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        });
      }
    }
   _sendRequest(file) {
    const data = new FormData();
    data.append('upload', file);
    this.xhr.send(data);
  }
  }