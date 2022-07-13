import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { Defect } from '@models/defect';
import { DefaultNullOrEmpty } from '@shared/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { createMockList } from 'ts-auto-mock';
import { DefectsComponent } from './defects.component';

@Component({
  selector: 'app-defect[form]',
  template: ``,
  providers: [DefaultNullOrEmpty]
})
export class MockDefectComponent {
  @Input() form!: CustomFormGroup;
  @Input() isEditing = false;
}

describe('DefectsComponent', () => {
  let component: DefectsComponent;
  let fixture: ComponentFixture<DefectsComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefectsComponent, MockDefectComponent],
      providers: [DynamicFormService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectsComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    component.form = new CustomFormGroup(
      { name: 'defects', type: FormNodeTypes.GROUP },
      {
        testTypes: new CustomFormArray({ name: 'testTypes', type: FormNodeTypes.ARRAY }, [
          new CustomFormGroup(
            { name: 'testType', type: FormNodeTypes.GROUP },
            {
              defects: new CustomFormArray({ name: 'defects', type: FormNodeTypes.ARRAY }, [])
            }
          )
        ])
      }
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct header', () => {
    expect(el.query(By.css('h2')).nativeElement.innerHTML).toBe('Defects');
  });

  describe('No defects', () => {
    it('should be dysplayed when defects is undefined or empty array', fakeAsync(() => {
      const expectedText = 'No defects';

      tick();
      fixture.detectChanges();

      let text: HTMLParagraphElement = el.query(By.css('p')).nativeElement;
      expect(text.innerHTML).toBe(expectedText);

      tick();
      fixture.detectChanges();

      text = el.query(By.css('p')).nativeElement;
      expect(text.innerHTML).toBe(expectedText);
    }));
  });

  describe('Defects', () => {
    it('should render app-defect component', fakeAsync(() => {
      const defectsForm = component.form.get(['testTypes', '0', 'defects']) as CustomFormArray;
      defectsForm.addControl();

      tick();
      fixture.detectChanges();

      expect(el.query(By.directive(MockDefectComponent))).toBeTruthy();
      expect(el.query(By.directive(MockDefectComponent))).toBeDefined();
    }));
  });
});
