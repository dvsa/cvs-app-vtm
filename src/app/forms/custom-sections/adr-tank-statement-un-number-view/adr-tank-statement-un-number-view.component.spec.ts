import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { State, initialAppState } from '@store/index';
import { AdrTankStatementUnNumberViewComponent } from './adr-tank-statement-un-number-view.component';

describe('AdrTankStatementUnNumberViewComponent', () => {
  let component: AdrTankStatementUnNumberViewComponent;
  let fixture: ComponentFixture<AdrTankStatementUnNumberViewComponent>;

  const control = new CustomFormControl({
    name: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo',
    label: 'UN Number',
    type: FormNodeTypes.CONTROL,
    value: ['UN number 1'],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormsModule, SharedModule, FormsModule],
      declarations: [AdrTankStatementUnNumberViewComponent],
      providers: [
        provideMockStore<State>({ initialState: initialAppState }),
        { provide: NG_VALUE_ACCESSOR, useExisting: AdrTankStatementUnNumberViewComponent, multi: true },
        { provide: NgControl, useValue: { control } },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdrTankStatementUnNumberViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
