import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  constructor() {}
  public isOpen = false;
  ngOnInit(): void {}
  scrollToTop() {
    // window.scroll(0, 0);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  menuToggle(){
    this.isOpen = !this.isOpen;
}

  isSticky: boolean = false;
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= 150;
  }
}
