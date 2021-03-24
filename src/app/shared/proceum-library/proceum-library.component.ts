import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proceum-library',
  templateUrl: './proceum-library.component.html',
  styleUrls: ['./proceum-library.component.scss']
})
export class ProceumLibraryComponent implements OnInit {

  constructor() { }

  public model_status = false;

  ngOnInit(): void {
  }

  openModel (){
    this.model_status = true;
  }
  closeModel (){
    this.model_status = false;
  }
}
