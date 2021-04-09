import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  public isLoading = new BehaviorSubject(false);
  private apiURL: string;
  public menu_status: String;
  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
  }
  getToken() {
    let token = sessionStorage.getItem('_token');
    return token;
  }
  getUser() {
    if (sessionStorage.getItem('user'))
      return JSON.parse(atob(sessionStorage.getItem('user')));
    else {
      return '';
    }
  }
  public removeSession() {
    sessionStorage.removeItem('_token');
    sessionStorage.removeItem('user');
  }
  public get(param) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', 'Bearer ' + this.getToken())
      .set('Content-Type', 'application/json');
    return this.http.get(this.apiURL + param.url, { headers: headers }).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  public post(param) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', 'Bearer ' + this.getToken())
      .set('Content-Type', 'application/json');
    return this.http
      .post(this.apiURL + param.url, param, { headers: headers })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  public put(param) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', 'Bearer ' + this.getToken())
      .set('Content-Type', 'application/json');
    return this.http
      .put(this.apiURL + param.url, param, { headers: headers })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  public delete(param) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Authorization', 'Bearer ' + this.getToken())
      .set('Content-Type', 'application/json');
    return this.http.delete(this.apiURL + param.url, { headers: headers }).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

  public import(param:any,formData:any){
    let headers = new HttpHeaders();
      headers = headers
      .set("Authorization", "Bearer "+this.getToken());
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

  public formData(param, myFormData) {
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
}
