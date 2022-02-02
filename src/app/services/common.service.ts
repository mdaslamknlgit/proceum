import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public child_data: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public child_data_editor: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public isLoading = new BehaviorSubject(false);
  public apiURL: string;
  public kpoint_api_url = "https://proceum.kpoint.com/api/v1/xapi/";
  public appsquadz_api_url = "https://dev.medvizz3d.com/AppSquadz/index.php/";
  public menu_status: String;
  ipResult : any;
  public lang = "en";
  public search_string = '';
  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
  }
  getToken() {
    let token = localStorage.getItem('_token');
    return token;
  }
  getUser() {
    if (localStorage.getItem('user'))
      return JSON.parse(atob(localStorage.getItem('user')));
    else {
      return '';
    }
  }
  public removeSession() {
    localStorage.removeItem('_token');
    localStorage.removeItem('user');
  }
  public kpointGet(param){
    return this.http.get(this.kpoint_api_url+param['url']).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  public AppSquadzPost(param){
    let headers = new HttpHeaders();
    headers = headers
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Headers', 'Content-Type')
      .set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
      .set('Content-Type', 'multipart/form-data');
    return this.http.post(this.appsquadz_api_url + param.url, param, { headers: headers }).pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  public get(param) {
    let user = this.getUser();
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', 'Bearer ' + this.getToken())
      .set('config', JSON.stringify(user['configs']))
      .set('Content-Type', 'application/json');
    return this.http.get(this.apiURL + param.url, { headers: headers }).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  public post(param) {
    let user = this.getUser();
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', 'Bearer ' + this.getToken())
      .set('config', JSON.stringify(user['configs']))
      .set('Content-Type', 'application/json');
    return this.http
      .post(this.apiURL + param.url, param, { headers: headers })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }

  public nonAuthenticatedPost(param) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http
      .post(this.apiURL + param.url, param, { headers: headers })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }

  public put(param) {
    let user = this.getUser();
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', 'Bearer ' + this.getToken())
      .set('config', JSON.stringify(user['configs']))
      .set('Content-Type', 'application/json');
    return this.http
      .put(this.apiURL + param.url, param, { headers: headers })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  public delete(param) {
    let user = this.getUser();
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', 'Bearer ' + this.getToken())
      .set('config', JSON.stringify(user['configs']))
      .set('Content-Type', 'application/json');
    return this.http.delete(this.apiURL + param.url, { headers: headers }).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

  public import(param: any, formData: any) {
    let user = this.getUser();
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', 'Bearer ' + this.getToken())
      .set('config', JSON.stringify(user['configs']));
    return this.http
      .post(this.apiURL + param.url, formData, { headers: headers })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }

  errorHandler(error: Response) {
    return throwError(error);
  }

  public imageUpload(param: any, myFormData: any) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Bearer ' + this.getToken());

    return this.http
      .post(this.apiURL + param.url, myFormData, { headers: headers })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  setToDecimal(num) {
    if (parseInt(num) > 0) {
      return (Math.round(num * 100) / 100).toFixed(2);
    } else {
      return '0.00';
    }
  }
  public setChildData(data: any) {
    this.child_data.next(data);
  }
  public setChildDataEditor(data: any) {
    this.child_data_editor.next(data);
  }
  public ucFirst(value: string): string {
    let first = value.substr(0, 1).toUpperCase();
    return first + value.substr(1);
  }

    getRandomString(length) {
        let result           = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
  getClientIp() {
    return this.http.get('https://ipv4.jsonip.com').pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

}
