import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatbeltInstallationCheckComponent } from './seatbelt-installation-check.component';
import {SharedModule} from '@app/shared/shared.module';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {TestType} from '@app/models/test.type';
import {TestResultModel} from '@app/models/test-result.model';

describe('SeatbeltInstallationCheckComponent', () => {
  let component: SeatbeltInstallationCheckComponent;
  let fixture: ComponentFixture<SeatbeltInstallationCheckComponent>;
  const testType = {} as TestType;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ],
      providers: [
        TechRecordHelpersService
      ],
      declarations: [ SeatbeltInstallationCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatbeltInstallationCheckComponent);
    component = fixture.componentInstance;
    component.testType = testType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
