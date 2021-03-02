import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
	public isLoading = new BehaviorSubject(false);
  	private apiURL: string;
  	constructor(private http: HttpClient) {
    	this.apiURL = environment.apiUrl;
  	}
  	getToken() {
    	let token = sessionStorage.getItem("_token");
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
