import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormGroupComponent } from './dynamic-form-group.component';

describe('DynamicFormGroupComponent', () => {
  let component: DynamicFormGroupComponent;
  let fixture: ComponentFixture<DynamicFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicFormGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
