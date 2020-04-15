import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeComponent, TreeNode } from './tree.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { TreeData } from '@app/models/tree-data';

const mockTreeData = () => {
  return [
    {
      nodeName: 'Annual test',
      id: '97'
    },
    {
      nodeName: 'First test retest',
      id: '102',
      children: [
        {
          nodeName: 'Paid',
          id: '103'
        },
        {
          nodeName: 'Part paid',
          id: '104'
        }
      ]
    }
  ] as TreeData[];
};

describe('TreeComponent', () => {
  let component: TreeComponent;
  let fixture: ComponentFixture<TreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTreeModule, CdkTreeModule],
      declarations: [TreeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should start with a list of defined TreeData', () => {
    expect(component.dataSource.data).toBeDefined();
  });

  it('should convert Tree Data to TreeNodes', () => {
    component.treeData = mockTreeData();
    const expectedTreeNodes = component.convertToTreeNodes(mockTreeData());

    expect(expectedTreeNodes).toMatchSnapshot();
  });

  it('should get level of the node', () => {
    const treeNode = new TreeNode('First test', '54');
    component.levels.set(treeNode, 0);
    const expectedLevel = component.getLevel(treeNode);

    expect(expectedLevel).toBe(0);
  });

  it('should be falsy if node is not expandable', () => {
    const treeNode = new TreeNode('First test', '54');
    const isExpandable = component.isExpandable(treeNode);

    expect(isExpandable).toBeFalsy();
  });

  it('should get children of the node', () => {
    const childrenNodes = [{ id: '104', nodeName: 'Part paid' }] as TreeNode[];

    const treeNode = new TreeNode('First test', '54', childrenNodes);
    const expectedChildren = component.getChildren(treeNode);

    expect(expectedChildren).toEqual(treeNode.children);
  });

  it('should return a node with an incremented level', () => {
    const childrenNodes = [{ id: '104', nodeName: 'Part paid' }] as TreeNode[];

    const treeNode = new TreeNode('First test', '54', childrenNodes);
    const expectedNode = component.transformer(treeNode, 1);

    expect(expectedNode).toEqual(treeNode);
  });

  it('should be truthy if the node has children', () => {
    const childrenNodes = [{ id: '104', nodeName: 'Part paid' }] as TreeNode[];
    const treeNode = new TreeNode('First test', '54', childrenNodes);

    expect(component.hasChildren(0, treeNode)).toBeTruthy();
  });


  it('should emit the activeNode', () => {
    const selectedNode = { nodeName: 'First test', id: '95', children: BehaviorSubject, isActive: false };
    const emittedNode = { key: selectedNode.id, value: selectedNode.nodeName };

    spyOn(component.sendTreeData, 'emit');
    component.setActiveNode(selectedNode);

    expect(component.sendTreeData.emit).toHaveBeenCalledWith(emittedNode);
  });

});
