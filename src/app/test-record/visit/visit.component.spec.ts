import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitComponent } from './visit.component';
import {SharedModule} from '@app/shared/shared.module';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {TestType} from '@app/models/test.type';
import {TestResultModel} from '@app/models/test-result.model';

describe('VisitComponent', () => {
  let component: VisitComponent;
  let fixture: ComponentFixture<VisitComponent>;
  const testRecord = {} as TestResultModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ],
      providers: [
        TechRecordHelpersService
      ],
      declarations: [ VisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitComponent);
    component = fixture.componentInstance;
    component.testRecord = testRecord;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
