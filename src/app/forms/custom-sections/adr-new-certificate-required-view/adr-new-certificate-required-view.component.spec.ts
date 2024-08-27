import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { State, initialAppState } from '@store/index';
import { AdrTankDetailsM145ViewComponent } from '../adr-tank-details-m145-view/adr-tank-details-m145-view.component';
import { AdrNewCertificateRequiredViewComponent } from './adr-new-certificate-required-view.component';

describe('AdrNewCertificateRequiredViewComponent', () => {
  let component: AdrNewCertificateRequiredViewComponent;
  let fixture: ComponentFixture<AdrNewCertificateRequiredViewComponent>;

  const control = new CustomFormControl({
    name: 'techRecord_adrDetails_m145Statement',
    type: FormNodeTypes.CONTROL,
    value: [],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrNewCertificateRequiredViewComponent],
      imports: [SharedModule],
      providers: [
        provideMockStore<State>({ initialState: initialAppState }),
        { provide: NG_VALUE_ACCESSOR, useExisting: AdrTankDetailsM145ViewComponent, multi: true },
        { provide: NgControl, useValue: { control } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdrNewCertificateRequiredViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
