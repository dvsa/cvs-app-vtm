import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SeatbeltInstallationCheckComponent} from './seatbelt-installation-check.component';
import {SharedModule} from '@app/shared/shared.module';
import {TestType} from '@app/models/test.type';
import {VIEW_STATE} from '@app/app.enums';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

describe('SeatbeltInstallationCheckComponent', () => {
  let component: SeatbeltInstallationCheckComponent;
  let fixture: ComponentFixture<SeatbeltInstallationCheckComponent>;
  const testType = {} as TestType;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [SeatbeltInstallationCheckComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatbeltInstallationCheckComponent);
    component = fixture.componentInstance;
    component.testType = testType;
    component.editState = VIEW_STATE.VIEW_ONLY;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
