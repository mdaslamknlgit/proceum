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
  public isLoading = new BehaviorSubject(false);
  private apiURL: string;
  public menu_status: String;
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
    return this.http.get("https://proceum.kpoint.com/api/v1/xapi/kapsule/"+param['video_id']+"/bookmarks?xt="+param['xt']).pipe(
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
  public ucFirst(value: string): string {
    let first = value.substr(0, 1).toUpperCase();
    return first + value.substr(1);
  }
}
