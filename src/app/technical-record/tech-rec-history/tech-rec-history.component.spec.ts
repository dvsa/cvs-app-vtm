import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { SharedModule } from '@app/shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TechRecHistoryComponent } from '@app/technical-record/tech-rec-history/tech-rec-history.component';
import { Router } from '@angular/router';

describe('TechRecHistoryComponent', () => {
  let component: TechRecHistoryComponent;
  let fixture: ComponentFixture<TechRecHistoryComponent>;
  let injector: TestBed;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [TechRecHistoryComponent],
      providers: [TechRecordHelpersService, { provide: Router, useValue: mockRouter }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TechRecHistoryComponent);
    injector = getTestBed();
    mockRouter = TestBed.get(Router);
    component = fixture.componentInstance;
    component.techRecordsJson = [
      {
        techRecord: [
          {
            vin: 'XMGDE02FS0H012345',
            statusCode: 'aaaa',
            reasonForCreation: 'bbbb',
            createdByName: 'dddd',
            createdAt: 'eeee'
          }
        ]
      }
    ];
    fixture.detectChanges();
  });

  it('should create my component', async(() => {
    expect(component).toBeTruthy();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
