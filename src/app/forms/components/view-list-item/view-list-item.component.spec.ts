import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '../../services/dynamic-form.types';
import { ViewListItemComponent } from './view-list-item.component';

@Component({
  selector: 'app-host-component',
  template: `<form [formGroup]="form">
  <app-view-list-item name="foo" formControlName="foo"></app-view-list-item>
</form>
`,
  styles: []
})
class HostComponent {
  form = new FormGroup({
    foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL, children: [] }, '')
  });
}

describe('ListItemOutputComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewListItemComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
