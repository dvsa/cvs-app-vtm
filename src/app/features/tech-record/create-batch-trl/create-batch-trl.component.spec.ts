import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatchTrlComponent } from './create-batch-trl.component';

describe('CreateBatchTrlComponent', () => {
  let component: CreateBatchTrlComponent;
  let fixture: ComponentFixture<CreateBatchTrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBatchTrlComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBatchTrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
