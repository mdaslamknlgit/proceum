import { Component, OnInit } from '@angular/core';
import { GlobalApp } from 'src/global';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  constructor(
    public app:GlobalApp
  ) { }

  ngOnInit(): void {
    
  }
  
  getFooterLogo() {
    let header_logo = localStorage.getItem('footer_logo');
    if (header_logo) {
        return header_logo;
    } else {
        return "./assets/images/ProceumLogo.png";
    }
}
}
