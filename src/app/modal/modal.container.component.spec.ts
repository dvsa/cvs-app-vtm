import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalContainerComponent } from './modal.container.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { getCurrentModalState } from './modal.selectors';
import { map } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';

const mockSelector = new BehaviorSubject<any>(undefined);

class MockStore {
  select(selector: any) {
    switch (selector) {
      case getCurrentModalState:
        return mockSelector.pipe(
          map((value: any) =>
            value && value.hasOwnProperty('getCurrentModalState')
              ? value['getCurrentModalState']
              : {}
          )
        );
      default:
        return mockSelector;
    }
  }

  dispatch(action: Action) {
    return [];
  }
}

describe('ModalComponent', () => {
  let component: ModalContainerComponent;
  let fixture: ComponentFixture<ModalContainerComponent>;
  const store: MockStore = new MockStore();
  const dialogMock = { close: () => {} };
  const storeProvider = { provide: Store, useValue: store };
  const matDialogProvider = { provide: MatDialogRef, useValue: dialogMock };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalContainerComponent ],
      imports: [MatDialogModule, MaterialModule, RouterTestingModule],
      providers: [matDialogProvider, storeProvider]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create modal container component', () => {
    expect(component).toBeTruthy();
  });
});
