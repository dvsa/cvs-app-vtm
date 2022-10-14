import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomDefectComponent } from '../custom-defect/custom-defect.component';
import { CustomDefectsComponent } from './custom-defects.component';

describe('CustomDefectsComponent', () => {
  let component: CustomDefectsComponent;
  let fixture: ComponentFixture<CustomDefectsComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [CustomDefectsComponent, CustomDefectComponent],
      providers: [DynamicFormService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDefectsComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct header', () => {
    expect(el.query(By.css('h2')).nativeElement.innerHTML).toBe('Custom Defects');
  });
});
