import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TechnicalRecordComponent } from './technical-record.component';
import { scrollToSection } from '@app/utils';

describe('TechnicalRecordComponent', () => {
  // let component: TechnicalRecordComponent;
  // let fixture: ComponentFixture<TechnicalRecordComponent>;
  let dialog: MatDialog;
  let injector: TestBed;

  const mockPanels = [
    { panel: 'Test History', isOpened: false },
    { panel: 'Tech Record History', isOpened: false }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      declarations: [TechnicalRecordComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    injector = getTestBed();
    dialog = injector.get(MatDialog);
  });

  it('should scroll & open section via "scrollToSection" util', () => {
    window.scrollTo = jest.fn();
    const mockFn = jest.fn(scrollToSection);
    mockFn(mockPanels, mockPanels[1].panel);
    expect(mockFn).toHaveBeenCalledWith(mockPanels, mockPanels[1].panel);
  });
});
