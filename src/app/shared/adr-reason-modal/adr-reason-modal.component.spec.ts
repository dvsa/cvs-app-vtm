import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { AdrReasonModalComponent } from './adr-reason-modal.component';


describe('AdrReasonModalComponent', () => {
  let component: AdrReasonModalComponent;
  let fixture: ComponentFixture<AdrReasonModalComponent>;
  const dialogMock = { close: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdrReasonModalComponent],
      imports: [MatDialogModule, MaterialModule, FormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
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

  describe('close', () => {
    it('should close the modal when called', () => {
      spyOn(component.dialogRef, 'close');
      component.close();

      expect(component.dialogRef.close).toHaveBeenCalled();
    });
  });
});
