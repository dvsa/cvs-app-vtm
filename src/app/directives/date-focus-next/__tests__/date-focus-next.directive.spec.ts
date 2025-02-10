import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DateFocusNextDirective } from '../date-focus-next.directive';

@Component({
	selector: 'app-test',
	template: `
    <div>
      <input appFocusNext [displayTime]="displayTime" type="number" id="test-day" />
      <input appFocusNext [displayTime]="displayTime" type="number" id="test-month" />
      <input appFocusNext [displayTime]="displayTime" type="number" id="test-year" />
      <input appFocusNext [displayTime]="displayTime" type="number" id="test-hour" />
      <input appFocusNext [displayTime]="displayTime" type="number" id="test-minute" />
    </div>
  `,
})
class TestComponent {
	displayTime = false;
}

describe('FocusNextDirective', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let de: DebugElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DateFocusNextDirective],
			declarations: [TestComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		de = fixture.debugElement;
	});

	it('should create an instance', () => {
		expect(component).toBeDefined();
	});

	it('should tab from day to month after two numbers', () => {
		const day: HTMLInputElement = fixture.debugElement.query(By.css('#test-day')).nativeElement;
		const month: HTMLInputElement = fixture.debugElement.query(By.css('#test-month')).nativeElement;
		day.value = '01';
		day.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		const focusedElement = de.query(By.css(':focus')).nativeElement;
		expect(month).toBe(focusedElement);
	});

	it('should tab from month to year after two numbers', () => {
		const month: HTMLInputElement = fixture.debugElement.query(By.css('#test-month')).nativeElement;
		const year: HTMLInputElement = fixture.debugElement.query(By.css('#test-year')).nativeElement;
		month.value = '01';
		month.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		const focusedElement = de.query(By.css(':focus')).nativeElement;
		expect(year).toBe(focusedElement);
	});

	it('should tab from hour to minute after two numbers', () => {
		const hour: HTMLInputElement = fixture.debugElement.query(By.css('#test-hour')).nativeElement;
		const minute: HTMLInputElement = fixture.debugElement.query(By.css('#test-minute')).nativeElement;
		hour.value = '01';
		hour.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		const focusedElement = de.query(By.css(':focus')).nativeElement;
		expect(minute).toBe(focusedElement);
	});

	it('should tab from year to hour after four numbers if displayTime is true', () => {
		const year: HTMLInputElement = fixture.debugElement.query(By.css('#test-year')).nativeElement;
		const hour: HTMLInputElement = fixture.debugElement.query(By.css('#test-hour')).nativeElement;

		year.focus();
		year.value = '2000';
		year.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		let focusedElement = de.query(By.css(':focus')).nativeElement;
		expect(year).toBe(focusedElement);

		component.displayTime = true;
		fixture.detectChanges();
		year.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		focusedElement = de.query(By.css(':focus')).nativeElement;
		expect(hour).toBe(focusedElement);
	});
});
