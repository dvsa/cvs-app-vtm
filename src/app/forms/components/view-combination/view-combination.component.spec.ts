import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCombinationComponent } from './view-combination.component';
import { FormNode, FormNodeTypes } from '../../services/dynamic-form.types';

describe('ViewCombinationComponent', () => {
  let component: ViewCombinationComponent;
  let fixture: ComponentFixture<ViewCombinationComponent>;

  const formNode: FormNode = {
    name: 'combination',
    label: 'label',
    type: FormNodeTypes.COMBINATION,
    options: {
      leftComponentName: 'aName',
      rightComponentName: 'aName2',
      separator: ' '
    },
    children: []
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCombinationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCombinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find the left and right components to make up the combination', () => {
    console.log(component)
  });
});
