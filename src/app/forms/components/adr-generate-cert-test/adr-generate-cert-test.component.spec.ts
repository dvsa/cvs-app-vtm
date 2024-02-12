import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State, initialAppState } from '@store/index';
import { ReplaySubject, of } from 'rxjs';
import { AdrGenerateCertTestComponent } from './adr-generate-cert-test.component';

describe('AdrGenerateCertTestComponent', () => {
  let component: AdrGenerateCertTestComponent;
  let fixture: ComponentFixture<AdrGenerateCertTestComponent>;
  let store: Store<State>;
  let techRecordService: TechnicalRecordService;
  let actions$: ReplaySubject<Action>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdrGenerateCertTestComponent],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        { provide: ActivatedRoute, useValue: { params: of([{ id: 1 }]) } },
        provideMockActions(() => actions$),
        TechnicalRecordService,
      ],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AdrGenerateCertTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(Store);
    techRecordService = TestBed.inject(TechnicalRecordService);
    fixture = TestBed.createComponent(AdrGenerateCertTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
