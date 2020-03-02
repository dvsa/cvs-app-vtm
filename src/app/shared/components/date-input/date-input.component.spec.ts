import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DateInputComponent } from './date-input.component';

describe('DateInputComponent', () => {
  let fixture: ComponentFixture<TestDateInputComponent>;
  let date: FormControl;
  let form: NgForm;
  let dayInput: DebugElement;
  let monthInput: DebugElement;
  let yearInput: DebugElement;

  function setDateValues(values: { day?: string; month?: string; year?: string }) {
    const { day, month, year } = values;

    dayInput.nativeElement.value = day;
    monthInput.nativeElement.value = month;
    yearInput.nativeElement.value = year;

    dayInput.nativeElement.dispatchEvent(new Event('input'));
    monthInput.nativeElement.dispatchEvent(new Event('input'));
    yearInput.nativeElement.dispatchEvent(new Event('input'));
  }

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [DateInputComponent, TestDateInputComponent],
      providers: [NgForm]
    });

    fixture = TestBed.createComponent(TestDateInputComponent);
    fixture.componentInstance.testDateControl = new FormControl('');
    fixture.detectChanges();
    tick();

    form = fixture.debugElement.children[0].injector.get(NgForm);
    date = form.control.get('date') as FormControl;

    dayInput = fixture.debugElement.query(By.css('[name=dateDay]'));
    monthInput = fixture.debugElement.query(By.css('[name=dateMonth]'));
    yearInput = fixture.debugElement.query(By.css('[name=dateYear]'));
  }));

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('constructs a date string from the entered parts', () => {
    setDateValues({ day: '9', month: '3', year: '2020' });

    // console.log(form.control.get('testDateControl') as FormControl);
    // expect(date.value).toEqual('2020-03-09');
  });

  it('populates the internal inputs when an external value is provided', fakeAsync(() => {
    fixture.componentInstance.testDateControl = new FormControl('2020-03-09');
    fixture.detectChanges();
    tick();

    expect(dayInput.nativeElement.value).toEqual('09');
    expect(monthInput.nativeElement.value).toEqual('03');
    expect(yearInput.nativeElement.value).toEqual('2020');
  }));

  it('applies the aria-describedby attribute to the day input', () => {
    expect(dayInput.nativeElement.getAttribute('aria-describedby')).toEqual('identifier');
  });
});

@Component({
  selector: 'test-date-input',
  template: `
    <form>
      <vtm-date-input
        id="testDate"
        name="date"
        [formControl]="testDateControl"
        aria-describedby="identifier"
      ></vtm-date-input>
    </form>
  `
})
class TestDateInputComponent {
  testDateControl: FormControl;
}
