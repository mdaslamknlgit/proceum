import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class Loader {
  private requests: HttpRequest<any>[] = [];
    public hide_loader = [];
  constructor(
    private loaderService: CommonService,
    private toster: ToastrService,
    private route: Router
  ) {
      this.hide_loader = [environment.apiUrl+'get-sub-headings', environment.apiUrl+'get-partners', environment.apiUrl+'vdocipher/get-otp', environment.apiUrl+'get-kpoint-token']
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }
 
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.hide_loader.indexOf(req.url) == -1) {
        this.requests.push(req);
        this.loaderService.isLoading.next(true);
    }
    //this.requests.push(req);
    //this.loaderService.isLoading.next(true);
    return Observable.create((observer) => {
      const subscription = next.handle(req).subscribe(
        (event) => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req);
            observer.next(event);
          }
        },
        (err) => {
          this.removeRequest(req);
          observer.error(err);
          if (err.status == 401 && !req.url.includes("proceum.kpoint.com/api/v1/xapi/")) {
            this.toster.error(err.statusText, 'Session Error', {
              closeButton: true,
            });
            localStorage.clear();
            this.route.navigateByUrl('/login');
          }
          if (err.status == 400) {
              if(err.error.error != undefined && err.error.error.code != '9001')
                this.toster.error(JSON.stringify(err.error), 'Error', { closeButton: true });
          }
          if (err.status == 500 || err.status == 405) {
            this.toster.error(err.error['message'], 'Error', {
              closeButton: true,
            });
          }
          if (err.status == 404) {
            this.toster.error('Requested url end point not found', 'Error', {
              closeButton: true,
            });
          }
        },
        () => {
          this.removeRequest(req);
          observer.complete();
        }
      );
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
