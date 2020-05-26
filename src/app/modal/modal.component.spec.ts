import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { Component } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

const mockSelector = new BehaviorSubject<any>(undefined);

class MockStore {
  select(selector: any) {
        return mockSelector;
    }

  dispatch(action: Action) {
    return [];
  }
}

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  const store: MockStore = new MockStore();
  const dialogMock = { close: () => {} };
  const matDialogProvider = { provide: MatDialogRef, useValue: dialogMock };
  const model = {
    currentModal: 'modal',
    currentRoute: 'route'
  };
  const matDialogData = {
    provide: MAT_DIALOG_DATA,
    useValue: model
  };
  const storeProvider = { provide: Store, useValue: store };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [ModalComponent, TestLoseChangesComponent],
      providers: [matDialogProvider, matDialogData, storeProvider]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create modal component', () => {
    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-lose-changes',
  template: `
    <div>works</div>
  `
})
class TestLoseChangesComponent {}
