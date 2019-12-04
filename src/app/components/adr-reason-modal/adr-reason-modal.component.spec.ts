import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {AdrReasonModalComponent} from './adr-reason-modal.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MaterialModule} from '@app/material.module';

describe('AdrReasonModalComponent', () => {
  let component: AdrReasonModalComponent;
  let fixture: ComponentFixture<AdrReasonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdrReasonModalComponent],
      imports: [MatDialogModule, MaterialModule],
      providers: [
        {provide: MatDialogRef, useValue: {close: jest.fn()}},
        {provide: MAT_DIALOG_DATA, useValue: {}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdrReasonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', inject([MatDialogRef], () => {
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalled();
  }));
});
