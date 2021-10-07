import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAlphaNumericOnly]'
})

export class AlphaNumericOnlyDirective {
  key;
  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    this.key = event.keyCode;
    //console.log(this.key);
    if ((this.key >= 57 && this.key <= 64) || (this.key >= 123) || (this.key >= 96 && this.key <= 105)) {
      event.preventDefault();
    }
  }
}