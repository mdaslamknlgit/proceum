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

@Injectable()
export class Loader {
  private requests: HttpRequest<any>[] = [];

  constructor(
    private loaderService: CommonService,
    private toster: ToastrService,
    private route: Router
  ) {}

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
    this.requests.push(req);
    this.loaderService.isLoading.next(true);
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
          if (err.status == 401) {
            this.toster.error(err.statusText, 'Session Error');
            sessionStorage.clear();
            this.route.navigateByUrl('/login');
          }
          if (err.status == 400) {
            this.toster.error(err.error, 'Error');
          }
          if (err.status == 500 || err.status == 405) {
            this.toster.error(err.error['message'], 'Error');
          }
          if (err.status == 404) {
            this.toster.error('Requested url end point not found', 'Error');
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
