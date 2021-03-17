import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  scrollToTop() {
    // window.scroll(0, 0);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
