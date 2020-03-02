import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitComponent } from './visit.component';
import { SharedModule } from '@app/shared/shared.module';
import { TestResultModel } from '@app/models/test-result.model';
import {CUSTOM_ELEMENTS_SCHEMA, Input} from '@angular/core';
import {VIEW_STATE} from '@app/app.enums';
import {TestStation} from '@app/models/test-station';

describe('VisitComponent', () => {
  let component: VisitComponent;
  let fixture: ComponentFixture<VisitComponent>;
  const testRecord = {} as TestResultModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [VisitComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitComponent);
    component = fixture.componentInstance;
    component.testRecord = testRecord;
    component.editState = VIEW_STATE.VIEW_ONLY;
    component.testStations = [{} as TestStation];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
