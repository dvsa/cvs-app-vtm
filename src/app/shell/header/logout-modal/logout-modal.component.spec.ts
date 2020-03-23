import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { LogoutModalComponent } from './logout-modal.component';


describe('AdrReasonModalComponent', () => {
  let component: LogoutModalComponent;
  let fixture: ComponentFixture<LogoutModalComponent>;
  const dialogMock = { close: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogoutModalComponent],
      imports: [MatDialogModule, MaterialModule, FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('should close the modal when called', () => {
      spyOn(component.dialogRef, 'close');
      component.cancel();

      expect(component.dialogRef.close).toHaveBeenCalledWith(false);
    });
  });

  describe('save', () => {
    it('should close the modal when called', () => {
      spyOn(component.dialogRef, 'close');
      component.confirm();

      expect(component.dialogRef.close).toHaveBeenCalledWith(true);
    });
  });
});
