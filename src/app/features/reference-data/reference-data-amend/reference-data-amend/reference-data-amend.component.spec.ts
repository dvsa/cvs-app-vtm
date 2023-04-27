import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDataAmendComponent } from './reference-data-amend.component';

describe('ReferenceDataAmendComponent', () => {
  let component: ReferenceDataAmendComponent;
  let fixture: ComponentFixture<ReferenceDataAmendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDataAmendComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDataAmendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
