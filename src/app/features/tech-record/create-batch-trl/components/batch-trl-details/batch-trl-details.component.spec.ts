import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTrlDetailsComponent } from './batch-trl-details.component';

describe('BatchTrlDetailsComponent', () => {
  let component: BatchTrlDetailsComponent;
  let fixture: ComponentFixture<BatchTrlDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchTrlDetailsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchTrlDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
