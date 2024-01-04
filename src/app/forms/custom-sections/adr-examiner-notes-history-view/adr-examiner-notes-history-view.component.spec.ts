import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { provideMockStore } from '@ngrx/store/testing';
import { State, initialAppState } from '@store/index';
import { AdrExaminerNotesHistoryViewComponent } from './adr-examiner-notes-history-view.component';

describe('AdrExaminerNotesHistoryViewComponent', () => {
  let component: AdrExaminerNotesHistoryViewComponent;
  let fixture: ComponentFixture<AdrExaminerNotesHistoryViewComponent>;

  const control = new CustomFormControl({
    name: 'techRecord_adrDetails_additionalExaminerNotes',
    type: FormNodeTypes.CONTROL,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrExaminerNotesHistoryViewComponent],
      providers: [
        provideMockStore<State>({ initialState: initialAppState }),
        { provide: NG_VALUE_ACCESSOR, useExisting: AdrExaminerNotesHistoryViewComponent, multi: true },
        {
          provide: NgControl,
          useValue: {
            control: { key: control.meta.name, value: control },
          },
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdrExaminerNotesHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
