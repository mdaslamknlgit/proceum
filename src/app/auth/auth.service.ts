import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private Lurl = "https://appleid.apple.com/auth/keys";
  private apiURL: string;
  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
  }
  public login(param) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http
      .post(this.apiURL + param.url, param, { headers: headers })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  public removeSession() {
    sessionStorage.removeItem('_token');
    sessionStorage.removeItem('user');
  }
  public register(param) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http
      .post(this.apiURL + param.url, param, { headers: headers })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }

  public verify(param) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json');
    return this.http.get(this.apiURL + param.url, { headers: headers }).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

  get():Observable<any>{

    return this.http.get(this.Lurl);
  };
	public post(param) {
		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/json');
		return this.http.post(this.apiURL + param.url, param, { headers: headers }).pipe(map(res => res), catchError(this.errorHandler));
	}
  errorHandler(error: Response) {
    return throwError(error);
  }
}
