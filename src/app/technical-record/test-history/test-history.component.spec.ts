import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
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

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
