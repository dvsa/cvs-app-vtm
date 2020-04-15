import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalContent } from './modal.model';
import { APP_MODALS } from '../app.enums';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  const dialogMock = { close: () => {} };
  const matDialogProvider = { provide: MatDialogRef, useValue: dialogMock };
  const model = {
    currentModal: 'lose-changes'
  };
  const matDialogData = {
    provide: MAT_DIALOG_DATA,
    useValue: model
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ModalComponent, TestLoseChangesComponent],
      providers: [matDialogProvider, matDialogData]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialse currentModal with correct data', () => {
    expect(component.currentModal).toEqual({
      modal: APP_MODALS.LOSE_CHANGES
    } as ModalContent);
  });

  it('should create modal component', () => {
    expect(fixture).toMatchSnapshot();
  });

  it('should fire close modal component with correct data', () => {
    spyOn(component.dialogRef, 'close');
    component.okCancelAction({ isOk: true });

    expect(component.dialogRef.close).toHaveBeenCalledWith({
      status: true,
      modal: model.currentModal
    });
  });
});

@Component({
  selector: 'vtm-lose-changes',
  template: `
    <div>works</div>
  `
})
class TestLoseChangesComponent {}
