import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectsComponent } from './defects.component';
import {SharedModule} from '@app/shared/shared.module';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {TestType} from '@app/models/test.type';
import {TestResultModel} from '@app/models/test-result.model';

describe('DefectsComponent', () => {
  let component: DefectsComponent;
  let fixture: ComponentFixture<DefectsComponent>;
  const testType = {} as TestType;
  const testRecord = {} as TestResultModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ],
      declarations: [ DefectsComponent ],
      providers: [
        TechRecordHelpersService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectsComponent);
    component = fixture.componentInstance;
    component.testType = testType;
    component.testRecord = testRecord;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
