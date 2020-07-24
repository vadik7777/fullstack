// Copyright © 2020 Vadim Konovalov. Contacts: <vadik.olympus@e1.ru>
// License: https://www.eclipse.org/legal/epl-2.0/

import {FlatTreeControl} from '@angular/cdk/tree';
import {Component} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {TodoItemFlatNode, TodoItemNode} from './model';
import {DataHandlerService} from './service/data-handler.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from './views/dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [DataHandlerService]
})
export class AppComponent {

  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  dataSearch: TodoItemNode[];

  search: boolean;

  constructor(private _database: DataHandlerService, public dialog: MatDialog) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    _database.searchData.subscribe(search => {
      this.search = search;
    });

    _database.dataChangeSearch.subscribe(dataSearch => {
      this.dataSearch = dataSearch;
    });
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.title === node.title
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.title = node.title;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
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

   // add Node
   addItem(node: TodoItemFlatNode) {
     const dialogRef = this.dialog.open(DialogComponent, {data: { item: '', editable: true}});
     dialogRef.afterClosed().subscribe(item => {
       if (item) {
         const parentNode = this.flatNodeMap.get(node);
         this._database.insertItem(parentNode!, item);
         this.treeControl.expand(node);
       }
     });
  }

  // edit Node
  editItem(node: TodoItemFlatNode) {
    const dialogRef = this.dialog.open(DialogComponent, {data: { item: node.title, editable: true}});
    dialogRef.afterClosed().subscribe(item => {
        if (node.title !== item) {
              const nestedNode = this.flatNodeMap.get(node);
              this._database.updateItem(nestedNode!, item);
        }
    });
  }

  // remove Node
  removeItem(node: TodoItemFlatNode) {
    const dialogRef = this.dialog.open(DialogComponent, {data: { item: node.title, editable: false}});
    dialogRef.afterClosed().subscribe(item => {
      if (item) {
        const nestedNode = this.flatNodeMap.get(node);
        this._database.removeItem(nestedNode!);
      }
    });
  }
}
