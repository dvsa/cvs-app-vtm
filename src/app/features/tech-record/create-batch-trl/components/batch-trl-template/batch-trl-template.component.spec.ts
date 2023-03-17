import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchTrlTemplateComponent } from './batch-trl-template.component';

describe('BatchTrlTemplateComponent', () => {
  let component: BatchTrlTemplateComponent;
  let fixture: ComponentFixture<BatchTrlTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchTrlTemplateComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchTrlTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
