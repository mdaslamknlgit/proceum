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
    // event.preventDefault(); //uncomment to desable right click
  }
  public is_admin: boolean = false;
  public is_student: boolean = false;
  constructor(private http: CommonService, private router: Router) {}
  ngOnInit() {
    window.addEventListener('keyup', (e) => {
      var keyCode = e.keyCode ? e.keyCode : e.which;
      if (keyCode == 44) {
        e.stopPropagation();
        console.log(keyCode);
        this.stopPrntScr();
      }
    });
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
