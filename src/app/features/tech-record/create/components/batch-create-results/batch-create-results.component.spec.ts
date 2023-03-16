import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchCreateResultsComponent } from './batch-create-results.component';

describe('BatchCreateResultsComponent', () => {
  let component: BatchCreateResultsComponent;
  let fixture: ComponentFixture<BatchCreateResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchCreateResultsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchCreateResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
