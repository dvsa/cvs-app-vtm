import {async, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {SharedModule} from '@app/shared/shared.module';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { DimensionsComponent } from './dimensions.component';
import { TechRecord } from '@app/models/tech-record.model';

describe('DimensionsComponent', () => {

  let component: DimensionsComponent;
  let fixture: ComponentFixture<DimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [
        DimensionsComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionsComponent);
    component = fixture.componentInstance;
    const tecRec: TechRecord = {
                                frontAxleTo5thWheelMin: 456,
                                frontAxleTo5thWheelMax: 660,
                                frontAxleTo5thWheelCouplingMin: 100,
                                frontAxleTo5thWheelCouplingMax: 150,
                                dimensions: {
                                            length: 100,
                                            width: 100,
                                            axleSpacing: [
                                              { axles: '1', value: 100},
                                              { axles: '2', value: 100},
                                              { axles: '3', value: 100},
                                            ]
                                            }
                              } as TechRecord;
    component.activeRecord = tecRec;
    component.axleSpacing = [
                              { axles: '1', value: 100},
                              { axles: '2', value: 100},
                              { axles: '3', value: 100},
                            ];
  });

  fit('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
