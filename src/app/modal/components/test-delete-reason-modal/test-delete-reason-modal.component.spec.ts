import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TestDeleteReasonModalComponent } from './test-delete-reason-modal.component';
import { APP_MODALS } from '@app/app.enums';

describe('TestDeleteReasonModalComponent', () => {
  let component: TestDeleteReasonModalComponent;
  let fixture: ComponentFixture<TestDeleteReasonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestDeleteReasonModalComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDeleteReasonModalComponent);
    component = fixture.componentInstance;
    component.modalContent = {
      payload: null,
      modal: APP_MODALS.REASON_FOR_DELETED,
      status: true
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    it('should close the modal when the close button is clicked', () => {
      spyOn(component.okCancelAction, 'emit');
      component.close();

      expect(component.okCancelAction.emit).toHaveBeenCalledWith({ isOk: false });
    });
  });
  describe('save', () => {
    it('should close the modal with entered data when save button is clicked', () => {
      const data = 'some entered data';
      spyOn(component.okCancelAction, 'emit');

      component.save(data);
      expect(component.okCancelAction.emit).toHaveBeenCalledWith({ isOk: true, payload: data });
    });
  });
});
