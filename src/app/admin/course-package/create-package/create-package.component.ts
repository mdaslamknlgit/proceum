import { Component, OnInit ,Injectable} from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject,BehaviorSubject } from 'rxjs';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

/**
 * Node for to-do item
 */
 export class TodoItemNode {
  children: TodoItemNode[];
  name: string;
  id:number;
  isChecked:boolean;
  curriculum_id: number;
  parentid: number;
  is_curriculum_root: boolean;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  children: TodoItemNode[];
  level: number;
  name: string;
  id:number;
  isChecked:boolean;
  curriculum_id: number;
  parentid: number;
  is_curriculum_root: boolean;
  expandable: boolean;
}

const TREE_DATA = [
  
];

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const item = obj[key];
      const node = new TodoItemNode();
      node.name = obj[key].name;
      node.id = obj[key].id;
      node.isChecked=  obj[key].isChecked;
      node.curriculum_id=  obj[key].claimId;
      node.parentid=  obj[key].parentid;

      if (item != null) {
        if (typeof item === 'object'  && item.children!= undefined) { 
       

          node.children = this.buildFileTree(item.children, level + 1);
        } else {
          node.name = item.name;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({name: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.name = name;
    this.dataChange.next(this.data);
  }
}

@Component({
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.scss'],
  providers: [ChecklistDatabase]
})
export class CreatePackageComponent implements OnInit {

  public user = [];
  public package_id = 0;
  public package_prices = [{pk_id:0, country_id:'', price_amount:'', status:''}];
  public countries = [];
  public package_name = '';
  public package_img = '';
  public package_desc = '';
  public pricing_model = 'fixed';
  public courses_ids_csv = '';
  public applicable_to_university = '';
  public applicable_to_college = '';
  public applicable_to_institute = '';
  public valid_up_to : any = '';
  public billing_frequency = 'monthly';
  public today_date = new Date();
  public edit_model_status = false;;
  all_countries: ReplaySubject<any> = new ReplaySubject<any>(1);
  

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);


  constructor(
    private http: CommonService,
    private toster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private database: ChecklistDatabase
  ) {
      this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
        this.isExpandable, this.getChildren);
      this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

      database.dataChange.subscribe(data => {
        this.dataSource.data = data;
    });
   }

   checkAll(){
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {

    if(this.treeControl.dataNodes[i].isChecked)
        this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
      this.treeControl.expand(this.treeControl.dataNodes[i])
    }
  }

   GetCheckAll(){

    console.log( this.dataSource.data );
      // if( this.treeFlattener.flattenNodes[0].check) console.log(this.treeControl.dataNodes[i].id);
 
     
    // for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
     
    //   if(this.treeControl.dataNodes[i].isChecked) console.log(this.treeControl.dataNodes[i].id);

    // if(this.treeControl.dataNodes[i].isChecked){
    //   console.log('---------------------------------------------');
    //     console.log(this.treeControl.dataNodes[i].id);
    //     console.log(this.treeControl.dataNodes[i].claimId);

    // }
   // }
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.name === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.id=node.id;
     flatNode.isChecked = node.isChecked;
     flatNode.parentid = node.parentid;
     flatNode.curriculum_id = node.curriculum_id;
     flatNode.is_curriculum_root = node.is_curriculum_root;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
     this.checklistSelection.isSelected(child))
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
  
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    node.isChecked ?  node.isChecked=false:node.isChecked=true; 
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode!, itemValue);
  }

  ngOnInit(): void {
    this.getCountries();
    this.getCurriculumnHierarchy();
  }

  getPackage() {
    let data = { url: 'edit-package/' + this.package_id };
    this.http.post(data).subscribe((res) => {
      if (res['error'] == false) {
        let package_data = res['data']['package_data'];
        this.package_name = package_data.package_name;
        this.package_img = package_data.package_img;
        this.package_desc = package_data.package_desc;
        this.pricing_model = package_data.pricing_model;
        this.applicable_to_university = package_data.applicable_to_university;
        this.applicable_to_college = package_data.applicable_to_college;
        this.applicable_to_institute = package_data.applicable_to_institute;
        this.billing_frequency = package_data.billing_frequency;
        //For reccuring datetime
        if(package_data.valid_up_to !== null){
          let valid_date = package_data.valid_up_to.split('-');
          console.log(valid_date);
          this.valid_up_to = new Date(
            package_data.valid_up_to
          );
          console.log(this.valid_up_to); 
          this.today_date = this.valid_up_to;
        }
        // For package prices
        if(res['data']['package_prices_data'].length > 0){
          this.package_prices = res['data']['package_prices_data'];
        }
      }
    });
  }

  getCountries(){
    let param = { url: 'get-countries' };
    this.http.post(param).subscribe((res) => {
      if (res['error'] == false) {
        this.countries = res['data']['countries'];
        if(this.countries != undefined){
          this.all_countries.next(this.countries.slice());
          
        }
      } else {
        //this.toster.error(res['message'], 'Error');
      }
    });
  }

  uploadImage(event) {
    let allowed_types = ['jpg', 'jpeg', 'bmp', 'gif', 'png'];
    const uploadData = new FormData();
    let files = event.target.files;
    let file = files[0];
    if (files.length == 0) return false;
    let ext = file.name.split('.').pop().toLowerCase();
    if (allowed_types.includes(ext)) {
      uploadData.append('upload', file);
    } else {
      this.toster.error(
        ext +
          ' Extension not allowed file (' +
          files.name +
          ') not uploaded'
      );
      return false;
    }
    let param = { url: 'upload-picture' };
    this.http.imageUpload(param, uploadData).subscribe((res) => {
      console.log(res);
      if (res['error'] == false) {
        //this.toastr.success('Files successfully uploaded.', 'File Uploaded');
        this.package_img = res['url'];
      }
    });
  }


  addPackagePriceField(){
    this.package_prices.push({pk_id:0, country_id:'', price_amount:'', status:''});
  }
  removePackagePrice(index){
    this.package_prices[index]['status'] = "delete";
  }

  createPackageService(){
    let form_data = {
      package_id : this.package_id,
      package_name : this.package_name,
      package_img : this.package_img,
      package_desc : this.package_desc,
      pricing_model : this.pricing_model,
      package_prices : this.package_prices,
      courses_ids_csv : this.courses_ids_csv,
      applicable_to_university : this.applicable_to_university,
      applicable_to_college : this.applicable_to_college,
      applicable_to_institute : this.applicable_to_institute,
      valid_up_to : this.valid_up_to,
      billing_frequency : this.billing_frequency,
    };
    let params = { url: 'update-package', form_data: form_data };
    this.http.post(params).subscribe((res) => {
      if (res['error'] == false) {
        this.toster.success(res['message'], 'Success', { closeButton: true });
        //this.navigateTo('manage-content');
      } else {
          this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }

  getCurriculumnHierarchy(){
    let params = { url: 'get-curriculumn-hierarchy'};
    this.http.post(params).subscribe((res) => {
      console.log(res);
      //this.tree_items = res['data'];
      this.dataSource.data = res['data'];
      if (res['error'] == false) {
        //this.toster.success(res['message'], 'Success', { closeButton: true });
        //this.navigateTo('manage-content');
      } else {
          //this.toster.error(res['message'], 'Error', { closeButton: true });
      }
    });
  }
}
