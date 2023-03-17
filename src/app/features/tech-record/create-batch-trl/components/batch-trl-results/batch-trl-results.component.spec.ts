import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTrlResultsComponent } from './batch-trl-results.component';

describe('BatchTrlResultsComponent', () => {
  let component: BatchTrlResultsComponent;
  let fixture: ComponentFixture<BatchTrlResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchTrlResultsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchTrlResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
