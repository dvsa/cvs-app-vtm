import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestRecordComponent } from './create-test-record.component';

describe('CreateTestRecordComponent', () => {
  let component: CreateTestRecordComponent;
  let fixture: ComponentFixture<CreateTestRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTestRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
