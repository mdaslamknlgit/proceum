import { Component, OnInit } from '@angular/core';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussels sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
];


@Component({
  selector: 'app-proceum-library',
  templateUrl: './proceum-library.component.html',
  styleUrls: ['./proceum-library.component.scss']
})
export class ProceumLibraryComponent implements OnInit {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

 
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
 
 constructor() {
    this.dataSource.data = TREE_DATA;
  }

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
