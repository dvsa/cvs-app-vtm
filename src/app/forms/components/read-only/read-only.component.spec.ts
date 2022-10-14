import { Component, Host } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { SharedModule } from '@shared/shared.module';
import { ReadOnlyComponent } from './read-only.component';

@Component({
  selector: 'app-host-component',
  template: `<form [formGroup]="form">
    <app-read-only formControlName="foo"></app-read-only>
  </form> `,
  styles: []
})
class HostComponent {
  form = new FormGroup({
    foo: new CustomFormControl({ name: 'foo', type: FormNodeTypes.CONTROL }, '')
  });
}

describe('ReadOnlyComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, ReadOnlyComponent],
      imports: [SharedModule, FormsModule, ReactiveFormsModule]
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
