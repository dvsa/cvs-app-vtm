import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { TimeInputComponent } from './time-input.component';
import { Component, DebugElement } from '@angular/core';

describe('TimeInputComponent', () => {
  let fixture: ComponentFixture<TestTimeInputControl>;
  let time: FormControl;
  let form: NgForm;
  let hourInput: DebugElement;
  let minuteInput: DebugElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [TimeInputComponent, TestTimeInputControl],
      providers: [NgForm]
    }).compileComponents();

    fixture = TestBed.createComponent(TestTimeInputControl);
    fixture.componentInstance.testTimeControl = new FormControl('');
    fixture.detectChanges();
    tick();

    form = fixture.debugElement.children[0].injector.get(NgForm);
    time = form.control.get('time') as FormControl;

    hourInput = fixture.debugElement.query(By.css('[name=hour]'));
    minuteInput = fixture.debugElement.query(By.css('[name=minute]'));
  }));

  it('should create', () => {
    expect(fixture).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should set properly the values for hour and time in UTC format', fakeAsync(() => {
    const testDate = new Date();
    fixture.componentInstance.testTimeControl = new FormControl(testDate.toISOString());
    fixture.detectChanges();
    tick();

    expect(hourInput.nativeElement.value).toEqual(testDate.getUTCHours().toString());
    expect(minuteInput.nativeElement.value).toEqual(testDate.getUTCMinutes().toString());

  }));

  it('should add properly aria-described value', () => {
    expect(hourInput.nativeElement.getAttribute('aria-describedby')).toEqual('test');
  });

});

@Component({
  selector: 'test-time-input',
  template: `
    <form>
      <vtm-time-input
        id="testTime"
        name="time"
        [formControl]="testTimeControl"
        aria-describedby="test"
      ></vtm-time-input>
    </form>
  `
})
class TestTimeInputControl {
  testTimeControl: FormControl;
}
