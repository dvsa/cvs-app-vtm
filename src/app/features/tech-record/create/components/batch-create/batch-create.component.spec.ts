import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchCreateComponent } from './batch-create.component';

describe('BatchCreateComponent', () => {
  let component: BatchCreateComponent;
  let fixture: ComponentFixture<BatchCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchCreateComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
