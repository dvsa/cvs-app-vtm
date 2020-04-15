import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { KeyValue } from '@angular/common';
import { TreeData } from '@app/models/tree-data';

export class TreeNode {
  children: BehaviorSubject<TreeNode[]>;
  isActive?: boolean;
  constructor(
    public nodeName: string,
    public id: string,
    children?: TreeNode[]) {
    this.children = new BehaviorSubject(children === undefined ? [] : children);
  }
}

@Component({
  selector: 'vtm-tree-component',
  templateUrl: './tree.component.html'
})
export class TreeComponent implements OnInit {
  @Input() treeData: TreeData[];
  @Output() sendTreeData = new EventEmitter<KeyValue<string, string>>();

  levels = new Map<TreeNode, number>();

  activeNode: KeyValue<string, string>;

  treeControl: FlatTreeControl<TreeNode>;
  treeFlattener: MatTreeFlattener<TreeNode, TreeNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, TreeNode>;

  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer.bind(this),
      this.getLevel.bind(this),
      this.isExpandable.bind(this),
      this.getChildren.bind(this)
    );

    this.treeControl = new FlatTreeControl<TreeNode>(
      this.getLevel.bind(this),
      this.isExpandable.bind(this)
    );

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit() {
    this.dataSource.data = this.treeData ? this.convertToTreeNodes(this.treeData) : [];
  }

  convertToTreeNodes(treeData): TreeNode[] {
    return treeData
      .map(this.mapTreeDataToTreeNodes.bind(this))
      .sort(this.sortTreeNodeByChildren.bind(this));
  }

  private mapTreeDataToTreeNodes(obj) {
    const hasChildren = obj.children && obj.children.length;

    if (hasChildren) {
      return new TreeNode(obj.nodeName, obj.id, this.convertToTreeNodes(obj.children));
    } else {
      return new TreeNode(obj.nodeName, obj.id);
    }
  }

   sortTreeNodeByChildren(a, b) {
    if (a.children && a.children.value < b.children && b.children.value) {
      return -1;
    }
    if (a.children && a.children.value > b.children && b.children.value) {
      return 1;
    }
    return 0;
  }

  getLevel(node: TreeNode): number {
    return this.levels.get(node) || 0;
  }

  isExpandable(node: TreeNode): boolean {
    return node.children.value.length > 0;
  }

  getChildren(node: TreeNode) {
    return node.children;
  }

  transformer(node: TreeNode, level: number) {
    this.levels.set(node, level);
    return node;
  }

  hasChildren(index: number, node: TreeNode): boolean {
    return node.children.value.length > 0;
  }

  setActiveNode(node) {
    this.treeControl.dataNodes.forEach(dnode => dnode.isActive = false);
    node.isActive = !node.isActive;

    this.activeNode = { key: node.id, value: node.nodeName };

    this.sendTreeData.emit(this.activeNode);
  }
}
