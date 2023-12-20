import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrExaminerNotesHistoryViewComponent } from './adr-examiner-notes-history-view.component';

describe('AdrExaminerNotesHistoryViewComponent', () => {
  let component: AdrExaminerNotesHistoryViewComponent;
  let fixture: ComponentFixture<AdrExaminerNotesHistoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdrExaminerNotesHistoryViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdrExaminerNotesHistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
