import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCombinationComponent } from './view-combination.component';
import { CustomFormControl, FormNode, FormNodeTypes } from '../../services/dynamic-form.types';
import { SharedModule } from '@shared/shared.module';
import { FormControl, FormGroup } from '@angular/forms';

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

  const formGroup = new FormGroup({
    aName: new CustomFormControl({ name: 'aName', type: FormNodeTypes.CONTROL, children: [] }, ''),
    aName2: new CustomFormControl({ name: 'aName2', type: FormNodeTypes.CONTROL, children: [] }, '')
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCombinationComponent ],
      imports: [SharedModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCombinationComponent);
    component = fixture.componentInstance;
    component.formNode = formNode;
    component.formGroup = formGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find the left and right components to make up the combination', () => {
    expect(component.leftComponent?.name).toEqual('aName');
    expect(component.rightComponent?.name).toEqual('aName2');
  });
});
