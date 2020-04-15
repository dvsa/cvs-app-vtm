import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ModalContainerComponent } from './modal.container.component';

import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { APP_MODALS } from '../app.enums';

import { ModalState } from './modal.reducer';
import { MockStore } from '@app/utils/mockStore';
import { ModalContent } from './modal.model';

describe('ModalComponent', () => {
  const modalState = {
    currentModal: APP_MODALS.LOSE_CHANGES,
    urlToRedirect: 'some/url'
  } as ModalState;

  const modalContent = {
    modal: APP_MODALS.LOSE_CHANGES,
    status: true,
    payload: 'someValue'
  } as ModalContent;

  class MatDialogMock {
    open() {
      return {
        afterClosed: () => of(modalContent)
      };
    }
  }
  const mockSelector = new BehaviorSubject<any>(undefined);
  let component: ModalContainerComponent;
  let fixture: ComponentFixture<ModalContainerComponent>;
  const store: MockStore = new MockStore(mockSelector);
  let dialog: MatDialogMock;
  let open: jest.Mock;

  beforeEach(async(() => {
    open = jest.fn();
    TestBed.configureTestingModule({
      declarations: [ModalContainerComponent],
      imports: [MatDialogModule, MaterialModule, RouterTestingModule],
      providers: [
        { provide: MatDialog, useValue: { open } },
        { provide: Store, useValue: store }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContainerComponent);
    dialog = TestBed.get(MatDialog);
    component = fixture.componentInstance;
    mockSelector.next({
      getCurrentModalState: modalState
    });
  });

  it('should open the dialog', () => {
    spyOn(dialog, 'open').and.callThrough();
    fixture.detectChanges();

    expect(dialog.open).toHaveBeenCalled();
  });
});
