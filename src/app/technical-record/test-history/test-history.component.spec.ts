import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { SharedModule } from '@app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestHistoryComponent } from '@app/technical-record/test-history/test-history.component';

describe('VehicleSummaryComponent', () => {
  let component: TestHistoryComponent;
  let fixture: ComponentFixture<TestHistoryComponent>;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [TestHistoryComponent],
      providers: [TechRecordHelpersService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHistoryComponent);
    injector = getTestBed();
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create my component', () => {
    expect(component).toBeTruthy();
  });

  it('should test result color', () => {
    const color = component.setResultColor('pass');
    expect(color.color).toEqual('#00703C');
  });

  it('should test result color', () => {
    const color = component.setResultColor('prs');
    expect(color.color).toEqual('#1D70B8');
  });

  it('should test result color', () => {
    const color = component.setResultColor('fail') || component.setResultColor('abandoned');
    expect(color.color).toEqual('#D4351C');
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
