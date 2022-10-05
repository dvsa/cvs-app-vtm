import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { DefectsTpl } from '@forms/templates/general/defect.template';
import { mockTestResult } from '@mocks/mock-test-result';
import { Defect } from '@models/defects/defect.model';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '@store/.';
import { initialAppState } from '@store/.';
import { DefectSelectComponent } from '../defect-select/defect-select.component';
import { DefectComponent } from '../defect/defect.component';
import { DefectsComponent } from './defects.component';
import { ButtonComponent } from '@shared/components/button/button.component';
import { TruncatePipe } from '@shared/pipes/truncate/truncate.pipe';
import { TagComponent } from '@shared/components/tag/tag.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CustomFormGroup } from '@forms/services/dynamic-form.types';

describe('DefectsComponent', () => {
  let component: DefectsComponent;
  let fixture: ComponentFixture<DefectsComponent>;
  let el: DebugElement;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [DefectComponent, DefectSelectComponent, DefectsComponent, ButtonComponent, TruncatePipe, TagComponent],
      providers: [DynamicFormService, provideMockStore({ initialState: initialAppState })]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(DefectsComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct header', () => {
    fixture.detectChanges();
    expect(el.query(By.css('h2')).nativeElement.innerHTML).toBe('Defects');
  });

  it('should add the selected defect into the defects form', () => {
    component.template = DefectsTpl;
    component.data = mockTestResult();

    fixture.detectChanges();

    expect(component.defectsForm.length).toBe(1);

    const expectedSelection = {
      defect: { imNumber: 1 } as Defect,
      item: { itemNumber: 2 } as Item,
      deficiency: { deficiencyId: '3' } as Deficiency
    };

    component.handleDefectSelection(expectedSelection);

    expect(component.defectsForm.length).toBe(2);
  });

  describe('No defects', () => {
    it('should be displayed when defects is undefined or empty array', fakeAsync(() => {
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
});
