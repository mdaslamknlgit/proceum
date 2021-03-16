import { Component, HostListener } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostListener('contextmenu', ['$event'])
  onRightClick(event) {
    event.preventDefault();
  }
  constructor() {}
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
