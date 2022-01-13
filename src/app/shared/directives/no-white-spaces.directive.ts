import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNoDoubleWhiteSpaces]'
})

export class NoDoubleWhiteSpacesDirective {
  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/  +/g, ' ');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}