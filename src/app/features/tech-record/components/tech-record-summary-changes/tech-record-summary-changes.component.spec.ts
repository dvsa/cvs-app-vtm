import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechRecordSummaryChangesComponent } from './tech-record-summary-changes.component';

describe('TechRecordSummaryChangesComponent', () => {
  let component: TechRecordSummaryChangesComponent;
  let fixture: ComponentFixture<TechRecordSummaryChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechRecordSummaryChangesComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TechRecordSummaryChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
