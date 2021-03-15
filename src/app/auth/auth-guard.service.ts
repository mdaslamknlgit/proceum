import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router,
    private toastr: ToastrService
  ) {}
  /*canActivate(): boolean {
    if (!sessionStorage.getItem('_token')) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }*/
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    return this.checkUserLogin(next, url);
  }
  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (sessionStorage.getItem('_token')) {
      const userRole = sessionStorage.getItem('role');
      if (route.data.role && route.data.role.indexOf(userRole) === -1) {
        this.toastr.error(
          'You Don`t have permissions to access this url',
          'Permission Deneid',
          { closeButton: true }
        );
        this.router.navigate(['/not-found']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
