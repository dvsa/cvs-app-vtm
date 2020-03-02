import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { PreventLeavePageModalComponent } from './prevent-leave-page-modal.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdrReasonModalComponent', () => {
  let component: PreventLeavePageModalComponent;
  let fixture: ComponentFixture<PreventLeavePageModalComponent>;
  const dialogMock = { close: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreventLeavePageModalComponent],
      imports: [MatDialogModule, MaterialModule, FormsModule, RouterTestingModule],
      providers: [{ provide: MatDialogRef, useValue: dialogMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventLeavePageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('should close the modal when called', () => {
      spyOn(component.dialogRef, 'close');
      component.close();

      expect(component.dialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('on action', () => {
    it('should close the modal when called', () => {
      spyOn(component.dialogRef, 'close');
      component.action();

      expect(component.dialogRef.close).toHaveBeenCalledWith(true);
    });
  });
});
