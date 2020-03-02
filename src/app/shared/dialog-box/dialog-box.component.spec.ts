import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoxComponent } from './dialog-box.component';
import { FormsModule } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MaterialModule} from '@app/material.module';

describe('DialogBoxComponent', () => {
  let component: DialogBoxComponent;
  let fixture: ComponentFixture<DialogBoxComponent>;
  const dialogMock = { close: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogBoxComponent],
      imports: [MatDialogModule, MaterialModule, FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogBoxComponent);
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
    it('should close the modal & send modal data', () => {
      const modalData = { isSave: true, data: 'test data' };
      spyOn(component.dialogRef, 'close');
      component.save('test data');
      expect(component.dialogRef.close).toHaveBeenCalledWith(modalData);

    });
  });

});
