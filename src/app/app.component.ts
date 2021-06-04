import { Component, HostListener } from '@angular/core';
import { CommonService } from './services/common.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault(); //uncomment to desable right click
  }
  public is_admin: boolean = false;
  public is_student: boolean = false;
  windowScrolled = false;
  constructor(private http: CommonService, private router: Router) {}
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }
  scrollToTop() {
    (function smoothscroll() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }
  ngOnInit() {
    window.addEventListener('keyup', (e) => {
      var keyCode = e.keyCode ? e.keyCode : e.which;
      if (keyCode == 44) {
        e.stopPropagation();
        this.stopPrntScr();
      }
    });
  }
  get sidemenuStatus() {
    return this.http.menu_status;
  }
  stopPrntScr() {
    var inpFld = window.document.createElement('input');
    inpFld.setAttribute('value', '.');
    inpFld.setAttribute('width', '0');
    inpFld.style.height = '0px';
    inpFld.style.width = '0px';
    inpFld.style.border = '0px';
    window.document.body.appendChild(inpFld);
    inpFld.select();
    window.document.execCommand('copy');
    inpFld.remove();
  }
}
