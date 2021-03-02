import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private apiURL: string;
  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
  }
  getToken() {
    let userData = sessionStorage.getItem("userData");
    let token = JSON.parse(userData).UserAuthenticationToken;
    return token;
  }
  public postGetData(param) {
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + this.getToken()).set('Content-Type', 'application/json');
    return this.http.post(this.apiURL + param.url, param, { headers: headers }).pipe(map(res => res), catchError(this.errorHandler));
  }
  errorHandler(error: Response) {
    return throwError(error);
  }
}
