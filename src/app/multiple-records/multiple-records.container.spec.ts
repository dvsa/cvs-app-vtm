import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { SharedModule } from '@app/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { MultipleRecordsContainer } from '@app/multiple-records/multiple-records.container';
import { of } from 'rxjs';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store, INITIAL_STATE } from '@ngrx/store';
import { hot } from 'jasmine-marbles';

describe('MultipleRecordsContainer', () => {
  let container: MultipleRecordsContainer;
  let fixture: ComponentFixture<MultipleRecordsContainer>;
  const vTechRec: VehicleTechRecordModel = {} as VehicleTechRecordModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      providers: [
        TechRecordHelpersService,
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        }
      ],
      declarations: [MultipleRecordsContainer],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleRecordsContainer);
    container = fixture.componentInstance;
    container.vehicleTechRecords$ = of([vTechRec]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(container).toBeTruthy();
  });
});
