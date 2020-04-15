import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoxConfirmationComponent } from './dialog-box-confirmation.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { FormsModule } from '@angular/forms';

describe('DialogBoxConfirmationComponent', () => {
  let component: DialogBoxConfirmationComponent;
  let fixture: ComponentFixture<DialogBoxConfirmationComponent>;
  const dialogMock = { close: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogBoxConfirmationComponent],
      imports: [MatDialogModule, MaterialModule, FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBoxConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  describe('close', () => {
    it('should close the modal when called', () => {
      spyOn(component.dialogRef, 'close');
      component.close();
      expect(component.dialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('save', () => {
    it('should close the modal after saving action', () => {
      spyOn(component.dialogRef, 'close');
      component.save();
      expect(component.dialogRef.close).toHaveBeenCalledWith(true);
    });
  });

});
